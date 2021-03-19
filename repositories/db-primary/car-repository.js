"use strict";

const BaseClass = require("../_base-db-repository");
const { Op } = require("sequelize");

module.exports = class DbPrimaryCarRepository extends BaseClass {
  async FindCarsByParams({
    carModal,
    gearType,
    userId,
    manufactureYear,
    returnAsJson = true,
  }) {
    const options = {
      where: {
        [Op.and]: [
          {
            userId,
          },
          {
            gearType,
          },
          {
            carModal,
          },
          {
            manufactureYear,
          },
        ],
      },
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
      ],
    };

    const dbResult = await super.PrimaryDbModels.Cars.findAll(options);
    return super.handleArrayObjectReturn({ dbResult, returnAsJson });
  }
  async FindCarListingsByParams({ carId, availableDate, returnAsJson = true }) {
    const options = {
      where: {
        [Op.and]: [
          {
            carId,
          },
          {
            availableDate: { [Op.in]: availableDate },
          },
        ],
      },
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
        {
          model: super.PrimaryDbModels.Cars,
        },
      ],
    };

    const dbResult = await super.PrimaryDbModels.CarListings.findAll(options);
    return super.handleArrayObjectReturn({ dbResult, returnAsJson });
  }

  async FindCarById({ id, returnAsJson = true }) {
    const options = {
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
      ],
    };

    const dbResult = await super.PrimaryDbModels.Cars.findByPk(id, {
      ...options,
    });

    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async FindCarListingById({ id, returnAsJson = true }) {
    const options = {
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
        {
          model: super.PrimaryDbModels.Cars,
        },
      ],
    };

    const dbResult = await super.PrimaryDbModels.CarListings.findByPk(id, {
      ...options,
    });

    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async FindCarsByUserId({ id, notId = null, returnAsJson = true }) {
    const options = {
      where: {
        userId: id,
      },
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
      ],
    };

    if (notId) {
      options.where.userId = {
        [Op.ne]: notId,
      };
    }
    const dbResult = await super.PrimaryDbModels.Cars.findAll(options);

    return super.handleArrayObjectReturn({ dbResult, returnAsJson });
  }

  async FindCarListingsByUserId({ id, returnAsJson = true }) {
    const options = {
      where: {
        userId: id,
      },
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
        {
          model: super.PrimaryDbModels.Cars,
        },
      ],
    };
    const dbResult = await super.PrimaryDbModels.CarListings.findAll(options);

    return super.handleArrayObjectReturn({ dbResult, returnAsJson });
  }

  async FindCarListingsByCarId({
    id,
    isAvailable = true,
    returnAsJson = true,
  }) {
    const options = {
      where: {
        [Op.and]: [
          {
            carId: id,
          },
        ],
      },
      include: [
        {
          model: super.PrimaryDbModels.Users,
        },
        {
          model: super.PrimaryDbModels.Cars,
        },
      ],
    };

    if (isAvailable) {
      options.where[Op.and].push({ carStatusId: 1 });
    }
    const dbResult = await super.PrimaryDbModels.CarListings.findAll(options);

    return super.handleArrayObjectReturn({ dbResult, returnAsJson });
  }

  async CreateCar({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels.Cars.create(payload);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async CreateCarListing({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels.CarListings.create(payload);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async UpdateCarListingById({ id, payload }) {
    const query = {
      where: {
        id,
      },
    };

    return await super.PrimaryDbModels.CarListings.update(payload, query);
  }
  async CreateBooking({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels.BookedCars.create(payload);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }
};
