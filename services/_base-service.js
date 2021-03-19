"use strict";

const config = require("../config");
const utils = require("../utilities");
const repositories = require("../repositories");

module.exports = class BaseService {
  get SystemConfig() {
    return config;
  }

  get ErrorUtil() {
    return utils.Error;
  }

  get CryptoUtil() {
    return {
      Bcrypt: utils.Bcrypt,
    };
  }

  get ValidationUtil() {
    return utils.Validation;
  }

  get Repositories() {
    return repositories;
  }

  get UserRepo() {
    return new this.Repositories.Db.Primary.User();
  }
};
