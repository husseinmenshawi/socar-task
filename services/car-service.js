"use strict";

const moment = require("moment");

const BaseClass = require("./_base-service");

module.exports = class CarService extends BaseClass {
  constructor() {
    super();
  }

  async Create({ payload, userId }) {
    if (!this.ValidationUtil.isCreateCarObject(payload)) {
      throw this.ErrorUtil.CarMetadataInvalidError();
    }
    const { carModal, gearType, manufactureYear } = payload;
    const carExist = await new this.Repositories.Db.Primary.Car().FindCarsByParams(
      {
        carModal,
        gearType,
        userId,
        manufactureYear,
      }
    );
    if (carExist.length > 0) {
      throw super.ErrorUtil.CarExistError();
    }

    payload.userId = userId;
    const carCreated = await new this.Repositories.Db.Primary.Car().CreateCar({
      payload,
    });

    return await this.FindCarById({ id: carCreated.id });
  }

  async CreateCarListing({ payload, userId }) {
    if (!this.ValidationUtil.isCreateListingObject(payload)) {
      throw this.ErrorUtil.ListingMetadataInvalidError();
    }
    const { carId, availableDate } = payload;

    const targetCar = await new this.Repositories.Db.Primary.Car().FindCarById({
      id: carId,
    });

    if (targetCar) {
      if (targetCar.User.id != userId) {
        throw super.ErrorUtil.NotCarOwnerError();
      }
    } else {
      throw super.ErrorUtil.CarDoesntExistError();
    }

    const carListingExist = await new this.Repositories.Db.Primary.Car().FindCarListingsByParams(
      {
        carId,
        availableDate,
      }
    );
    if (carListingExist.length > 0) {
      throw super.ErrorUtil.CarListingExistError();
    }

    payload.userId = userId;
    payload.carStatusId = 1;
    if (payload.availableDate.length == 1) {
      payload.availableDate = moment(payload.availableDate[0]).format(
        "YYYY-MM-DD"
      );
      const carListingCreated = await new this.Repositories.Db.Primary.Car().CreateCarListing(
        { payload }
      );

      return await this.FindCarListingById({ id: carListingCreated.id });
    } else if (payload.availableDate.length > 1) {
      let promises = [];
      const availableDates = payload.availableDate;
      for (let i = 0; i < availableDates.length; i++) {
        payload.availableDate = moment(availableDates[i]).format("YYYY-MM-DD");
        const promise = new this.Repositories.Db.Primary.Car().CreateCarListing(
          {
            payload,
          }
        );
        promises.push(promise);
      }
      await Promise.all(promises);
      const returnObject = {
        ListingsCreated: promises.length,
        carModal,
      };

      return returnObject;
    }
  }

  async FindCarById({ id }) {
    if (!super.ValidationUtil.isUUID(id)) {
      throw super.ErrorUtil.CarIdInvalidError();
    }

    return await new this.Repositories.Db.Primary.Car().FindCarById({
      id,
    });
  }

  async FindCarListingById({ id }) {
    if (!super.ValidationUtil.isUUID(id)) {
      throw super.ErrorUtil.CarListingIdInvalidError();
    }

    return await new this.Repositories.Db.Primary.Car().FindCarListingById({
      id,
    });
  }

  async FindMyCars({ userId }) {
    return await new this.Repositories.Db.Primary.Car().FindCarsByUserId({
      id: userId,
    });
  }

  async FindMyCarListings({ userId }) {
    return await new this.Repositories.Db.Primary.Car().FindCarListingsByUserId(
      {
        id: userId,
      }
    );
  }

  async FindCarListingsByParams({ query }) {
    if (!super.ValidationUtil.isFindCarListingObject(query)) {
      throw super.ErrorUtil.ListingMetadataInvalidError();
    }
    const { carId, availableDate, carStatusId } = query;
    return await new this.Repositories.Db.Primary.Car().FindCarListingsByParams(
      {
        carId,
        availableDate: availableDate ? [availableDate] : undefined,
        carStatusId,
      }
    );
  }

  async FindAllCars({ userId }) {
    return await new this.Repositories.Db.Primary.Car().FindCarsByUserId({
      notId: userId,
    });
  }

  async UpdateCarListingById({ id, userId, availableDate }) {
    if (!super.ValidationUtil.isUUID(id)) {
      throw super.ErrorUtil.CarListingIdInvalidError();
    }

    if (!super.ValidationUtil.dateStringFormat(availableDate)) {
      throw super.ErrorUtil.dateInvalidError();
    }
    const today = moment().format("YYYY-MM-DD");
    if (moment(availableDate).format("YYYY-MM-DD") < today) {
      throw super.ErrorUtil.passedDateError();
    }
    const targetListing = await new this.Repositories.Db.Primary.Car().FindCarListingById(
      {
        id,
      }
    );

    if (targetListing) {
      if (targetListing.userId != userId) {
        throw super.ErrorUtil.NotCarOwnerError();
      } else if (targetListing.carStatusId == 2) {
        throw super.ErrorUtil.ListingAlreadyBookedError();
      }
    } else {
      throw super.ErrorUtil.ListingDoesntExistError();
    }

    return await new this.Repositories.Db.Primary.Car().UpdateCarListingById({
      id,
      payload: { availableDate },
    });
  }

  async BookCarListingById({ id, userId }) {
    if (!super.ValidationUtil.isUUID(id)) {
      throw super.ErrorUtil.CarListingIdInvalidError();
    }

    const targetListing = await new this.Repositories.Db.Primary.Car().FindCarListingById(
      {
        id,
      }
    );

    if (targetListing) {
      if (targetListing.userId == userId) {
        throw super.ErrorUtil.BookingOwnListingError();
      } else if (targetListing.carStatusId == 2) {
        throw super.ErrorUtil.ListingAlreadyBookedError();
      }
    } else {
      throw super.ErrorUtil.ListingDoesntExistError();
    }

    const { availableDate, carId } = targetListing;
    const bookingPayload = {
      bookingDate: availableDate,
      userId,
      carId,
    };
    const booking = await new this.Repositories.Db.Primary.Car().CreateBooking({
      payload: bookingPayload,
    });
    await new this.Repositories.Db.Primary.Car().UpdateCarListingById({
      id,
      payload: { carStatusId: 2 },
    });

    return booking;
  }
};
