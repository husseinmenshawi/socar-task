"use strict";

const STATUS_ENUMS = {
  AVAILABLE: {
    id: 1,
    status: "Available",
  },
  BOOKED: {
    id: 2,
    status: "Booked",
  },
};

const statusKeys = Object.keys(STATUS_ENUMS);

const DB_STATUSES = new Array(statusKeys.length);

for (let i = 0; i < DB_STATUSES.length; i += 1) {
  const key = statusKeys[i];
  const values = STATUS_ENUMS[key];
  DB_STATUSES[i] = values;
}

module.exports = {
  STATUS_ENUMS,
  DB_STATUSES,
};
