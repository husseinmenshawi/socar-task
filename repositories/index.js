"use strict";

module.exports = {
  Db: {
    Primary: {
      User: require("./db-primary/user-repository"),
      Car: require("./db-primary/car-repository"),
    },
  },
};
