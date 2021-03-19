"use strict";

module.exports = (sequelize, Sequelize) => {
  const tableName = "CarListings";

  const tableDefintion = {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    availableDate: {
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

    models.CarStatuses.hasOne(table);
    table.belongsTo(models.CarStatuses, { foreignKey: "carStatusId" });

    models.Cars.hasMany(table);
    table.belongsTo(models.Cars, { foreignKey: "carId" });
  };

  return table;
};
