"use strict";

const dbConfig = {
  dbUri: null,
};

function getDbUri() {
  return [
    "mssql",
    "://",
    encodeURIComponent("testuser"),
    ":",
    encodeURIComponent("123456"),
    "@",
    "localhost",
    ":",
    1433,
    "/",
    "socar-task-db",
  ].join("");
}

dbConfig.dbUri = getDbUri();

module.exports = dbConfig;
