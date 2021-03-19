module.exports = (sequelize, Sequelize) => {
  const tableName = "Users";

  const tableDefintion = {
    id: {
      primaryKey: true,
      type: Sequelize.DECIMAL(38, 0),
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  };

  const table = sequelize.define(tableName, tableDefintion, {
    underscored: true,
  });

  table.associate = (models) => {
    models.Roles.hasOne(table);
    table.belongsTo(models.Roles, { foreignKey: "roleId" });
  };

  return table;
};
