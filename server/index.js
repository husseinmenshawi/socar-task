"use stict";

const express = require("express");
const glob = require("glob");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");

const config = require("../config");
const constants = require("../constants");
const primaryDb = require("../models/primary");
const Utilities = require("../utilities");

async function seedInitialUsers() {
  try {
    const adminUser = {
      name: "Hussein Admin",
      email: "menshawi98@gmail.com",
      phoneNumber: "012345678",
      roleId: 1,
    };

    const normalUserOne = {
      name: "User One",
      email: "userone@test.com",
      phoneNumber: "012345678",
      roleId: 2,
    };

    const normalUserTwo = {
      name: "User Two",
      email: "usertwo@test.com",
      phoneNumber: "012345678",
      roleId: 2,
    };

    const adminUserCreationPromise = primaryDb.sequelizeInstance.models.Users.findOrCreate(
      {
        where: {
          email: adminUser.email,
        },
        defaults: {
          ...adminUser,
        },
      }
    );

    const normalUserOneCreationPromise = primaryDb.sequelizeInstance.models.Users.findOrCreate(
      {
        where: {
          email: normalUserOne.email,
        },
        defaults: {
          ...normalUserOne,
        },
      }
    );

    const normalUserTwoCreationPromise = primaryDb.sequelizeInstance.models.Users.findOrCreate(
      {
        where: {
          email: normalUserTwo.email,
        },
        defaults: {
          ...normalUserTwo,
        },
      }
    );

    const userCreationResult = await Promise.all([
      adminUserCreationPromise,
      normalUserOneCreationPromise,
      normalUserTwoCreationPromise,
    ]);

    // Defaulting all users to same password for now
    const hashedPassword = await Utilities.Bcrypt.hashPassword({
      password: "123456",
    });

    const adminPasswordCreationPromise = primaryDb.sequelizeInstance.models.UserCredentials.findOrCreate(
      {
        where: {
          userId: userCreationResult[0][0].toJSON().id,
        },
        defaults: {
          password: hashedPassword,
        },
      }
    );

    const userOnePasswordCreationPromise = primaryDb.sequelizeInstance.models.UserCredentials.findOrCreate(
      {
        where: {
          userId: userCreationResult[1][0].toJSON().id,
        },
        defaults: {
          password: hashedPassword,
        },
      }
    );

    const userTwoPasswordCreationPromise = primaryDb.sequelizeInstance.models.UserCredentials.findOrCreate(
      {
        where: {
          userId: userCreationResult[2][0].toJSON().id,
        },
        defaults: {
          password: hashedPassword,
        },
      }
    );

    await Promise.all([
      adminPasswordCreationPromise,
      userOnePasswordCreationPromise,
      userTwoPasswordCreationPromise,
    ]);
  } catch (error) {
    throw new Error(error);
  }
}

async function seedRoleMasterData() {
  const roles = constants.USER_ROLES.DB_ROLES;
  const promises = roles.map((role) => {
    const { id } = role;

    return primaryDb.sequelizeInstance.models.Roles.findOrCreate({
      where: {
        id,
      },
      defaults: { ...role },
    });
  });
  return await Promise.all(promises);
}

async function seedCarStatusesMasterData() {
  const statuses = constants.CAR_STATUSES.DB_STATUSES;
  const promises = statuses.map((status) => {
    const { id } = status;

    return primaryDb.sequelizeInstance.models.CarStatuses.findOrCreate({
      where: {
        id,
      },
      defaults: { ...status },
    });
  });
  return await Promise.all(promises);
}

async function setupPrimaryDb() {
  await primaryDb.sequelizeInstance.sync();
  await seedRoleMasterData();
  await seedInitialUsers();
  await seedCarStatusesMasterData();
}

module.exports = () => {
  const app = express();

  // setup app variable constants
  app.locals.ENV = config.env;

  app.use(cors());
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // setup controllers
  const controllers = glob.sync(`${config.rootPath}/controllers/*.js`);
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  // error handing setup
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.httpErrorCode = 404;
    next(err);
  });

  app.use((error, req, res, next) => {
    const status = error.httpErrorCode || 500;
    res.status(status);

    if (config.env !== "production") {
      // ensures error object gets all details
      const jsonString = JSON.stringify(error, (key, value) => {
        if (value instanceof Error) {
          const error = {};

          Object.getOwnPropertyNames(value).forEach((key) => {
            error[key] = value[key];
          });

          return error;
        }

        return value;
      });
      const jsonObject = JSON.parse(jsonString);
      res.send({
        ...jsonObject,
      });
      return;
    }

    res.json({
      status,
      message: error.message,
    });
  });

  // Startup routine
  setupPrimaryDb()
    .then(() => {
      console.log("Socar DB setup complete");
      app.listen(config.port, () => {
        console.log("Express server listening on port " + config.port);
      });
    })
    .catch((error) => console.error("Startup failed", error));
};
