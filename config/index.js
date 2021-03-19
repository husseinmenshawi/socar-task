const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

module.exports = {
  rootPath,
  app: {
    name: process.env.APP_NAME || "socar-task",
  },
  env,
  port: process.env.PORT || 3000,
  db: {
    primary: require("./db-primary"),
  },
};
