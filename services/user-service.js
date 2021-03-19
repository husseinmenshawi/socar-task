"use strict";

const moment = require("moment");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const constants = require("../constants");
const ttl = 28800;
const secret = "socar-task-secret";

const BaseClass = require("./_base-service");

module.exports = class UserService extends BaseClass {
  constructor() {
    super();
  }

  async Create({ payload }) {
    if (!this.ValidationUtil.isCreateUserObject(payload)) {
      throw this.ErrorUtil.UserMetadataInvalidError();
    }
    const { email, name, password, phoneNumber, roleId, kitchenName } = payload;
    const bakeryCuisineId = 1;
    const emailExist = await super.UserRepo.FindUserByParams({
      email,
      roleId,
    });
    if (emailExist) {
      throw super.ErrorUtil.UserEmailExistError();
    }
    let kitchenCreated = null;

    if (roleId === 2) {
      const kitchenMetadata = {
        name: kitchenName,
        email,
      };
      kitchenCreated = await super.KitchenRepo.Create({
        payload: kitchenMetadata,
      });
    }

    const kitchenId = kitchenCreated ? kitchenCreated.id : null;

    if (kitchenId) {
      await super.KitchenRepo.CreateKitchenCuisineType({
        payload: {
          kitchenId,
          cuisineTypeId: bakeryCuisineId,
        },
      });
    }

    const userMetadata = {
      name,
      email,
      phoneNumber,
      kitchenId,
      roleId,
    };

    const userCreated = await super.UserRepo.Create({ payload: userMetadata });
    const hashedPassword = await super.CryptoUtil.Bcrypt.hashPassword({
      password,
    });

    const userId = userCreated.id;
    await super.UserRepo.CreateUserCredential({
      payload: { userId, password: hashedPassword },
    });

    return await this.FindUserById({ id: userCreated.id });
  }

  async AuthenticateUser({ email, password, roleId, userAgent }) {
    const credentials = { email, password };
    if (!super.ValidationUtil.isCredentialObject(credentials)) {
      throw super.ErrorUtil.InvalidUserCredentialError();
    }

    const currentUser = await super.UserRepo.FindUserByParams({
      email,
      roleId,
      includeCredentials: true,
    });

    if (!currentUser) {
      throw super.ErrorUtil.UserNotFoundError();
    }

    const passwordIsValid = await super.CryptoUtil.Bcrypt.comparePasword({
      password,
      hashedPassword: currentUser.UserCredential.password,
    });

    if (!passwordIsValid) {
      throw super.ErrorUtil.PasswordInvalidError();
    }

    const { id: userId } = currentUser;
    const accessTokenMetadata = this._generateAccessTokenMetadataForUser({
      secret,
      ttl,
      userId,
      email,
    });

    if (super.ValidationUtil.isString(userAgent)) {
      accessTokenMetadata.userAgent = userAgent;
    }

    const dbEntry = await super.UserRepo.CreateUserToken({
      input: accessTokenMetadata,
    });
    const { id: accessToken, expirationDate, refreshToken } = dbEntry;

    return {
      accessToken,
      expirationDate,
      refreshToken,
      kitchenId: currentUser.Kitchen ? currentUser.Kitchen.id : null,
      userId: currentUser.id,
    };
  }

  _generateAccessTokenMetadataForUser({ email, userId, secret, ttl }) {
    const currentMoment = moment();
    const expirationMoment = currentMoment.clone().add(ttl, "seconds");
    const expirationDate = expirationMoment.toISOString();

    const token = jwt.sign({ email, userId, expirationDate }, secret, {
      expiresIn: ttl,
    });
    const refreshToken = uuid.v4();

    return {
      id: token,
      expirationDate,
      ttl,
      refreshToken,
      userId,
    };
  }

  async FindUserById({ id }) {
    if (!super.ValidationUtil.isInteger(id)) {
      throw super.ErrorUtil.UserIdInvalidError();
    }

    return new this.Repositories.Db.Primary.User().FindUserById({
      id,
    });
  }
};
