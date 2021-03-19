"use strict";

const primaryDbSetup = require("../models/primary");

module.exports = class BaseDbRepository {
  constructor(defaultPageSize = 50) {
    this._defaultPageSize = defaultPageSize;
  }

  get PrimaryDbModels() {
    return primaryDbSetup.sequelizeInstance.models;
  }

  get DefaultPageSize() {
    return this.DefaultPageSize;
  }

  handleSingObjectReturn({ dbResult, returnAsJson }) {
    if (!dbResult || !returnAsJson) {
      return dbResult;
    }

    return dbResult.toJSON();
  }
  handleArrayObjectReturn({ dbResult, returnAsJson }) {
    if (!dbResult || !returnAsJson) {
      return dbResult;
    }
    return dbResult.map((x) => {
      return x.toJSON();
    });
  }
};
