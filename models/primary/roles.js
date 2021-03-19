"use strict";

module.exports = (sequelize, Sequelize) => {
  const tableName = "Roles";

  const tableDefintion = {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true,
    },
    roleName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  };

  const table = sequelize.define(tableName, tableDefintion, {
    underscored: true,
  });

  return table;
};
