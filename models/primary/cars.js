"use strict";

module.exports = (sequelize, Sequelize) => {
  const tableName = "Cars";

  const tableDefintion = {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    carModal: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    manufactureYear: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    numberOfSeats: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gearType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  };

  const table = sequelize.define(tableName, tableDefintion, {
    underscored: true,
  });

  table.associate = (models) => {
    models.Users.hasMany(table);
    table.belongsTo(models.Users, { foreignKey: "userId" });
  };

  return table;
};
