"use strict";

module.exports = (sequelize, Sequelize) => {
  const tableName = "BookedCars";

  const tableDefintion = {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    bookingDate: {
      type: Sequelize.DATEONLY,
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

    models.Cars.hasMany(table);
    table.belongsTo(models.Cars, { foreignKey: "carId" });

  };

  return table;
};
