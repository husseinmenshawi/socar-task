const express = require("express");
const router = express.Router();

const constants = require("../constants");
const Services = require("../services");
const middlewares = require("../middlewares");

module.exports = (app) => {
  app.use(`${constants.API.VERSIONS["V1.0"].BASE_PATH}/car`, router);
};

router.post(
  "/create-car",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { body, user } = req;

    try {
      const createdEntry = await new Services.Car().Create({
        payload: body,
        userId: user.userId,
      });
      res.status(201);
      res.json(createdEntry);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create-listing",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { body, user } = req;

    try {
      const createdEntry = await new Services.Car().CreateCarListing({
        payload: body,
        userId: user.userId,
      });
      res.status(201);
      res.json(createdEntry);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/my-cars",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { user } = req;

    try {
      const myCars = await new Services.Car().FindMyCars({
        userId: user.userId,
      });
      res.status(200);
      res.json(myCars);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/findOne/:id",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const car = await new Services.Car().FindCarById({
        id,
      });
      res.status(200);
      res.json(car);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/available-cars",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { user } = req;

    try {
      const myCars = await new Services.Car().FindAllCars({
        userId: user.userId,
      });
      res.status(200);
      res.json(myCars);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/listing-availablity",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    try {
      const carListings = await new Services.Car().FindCarListingsByParams({
        query: req.query,
      });
      res.status(200);
      res.json(carListings);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/my-listing",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { user } = req;

    try {
      const myCarListings = await new Services.Car().FindMyCarListings({
        userId: user.userId,
      });
      res.status(200);
      res.json(myCarListings);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/car-listing/:id",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const carListing = await new Services.Car().FindCarListingById({
        id,
      });
      res.status(200);
      res.json(carListing);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/car-listing/:id",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { userId } = req.user;
    const { availableDate } = req.body;
    const { id } = req.params;
    try {
      await new Services.Car().UpdateCarListingById({
        id,
        userId,
        availableDate,
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/book-listing/:id",
  middlewares.passport.jwtToken.authenticate("jwt", { session: false }),
  middlewares.jtwTokenValidator.validate,
  async (req, res, next) => {
    const { userId } = req.user;
    const { id } = req.params;
    try {
      const createdBooking = await new Services.Car().BookCarListingById({
        id,
        userId,
      });
      res.status(201);
      res.json(createdBooking);
    } catch (error) {
      next(error);
    }
  }
);
