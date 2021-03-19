"use strict";

const BaseClass = require("../_base-db-repository");
const { Op } = require("sequelize");

module.exports = class DbPrimaryUserRepository extends BaseClass {
  get MainTableName() {
    return "Users";
  }

  get UserCredentialsTableName() {
    return "UserCredentials";
  }

  get AccessTokenTableName() {
    return "UserTokens";
  }

  get RolesMasterDataTableName() {
    return "Roles";
  }

  get UserRolesTableName() {
    return "UserRoles";
  }

  async Create({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels[this.MainTableName].create(
      payload
    );
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async CreateUserCredential({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels[
      this.UserCredentialsTableName
    ].create(payload);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async CreateUserRole({ payload, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels[
      this.UserRolesTableName
    ].create(payload);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async FindUserByParams({
    email,
    roleId,
    not_id,
    includeCredentials = false,
    returnAsJson = true,
  }) {
    const options = {
      where: {},
      include: [],
    };

    if (email) {
      options.where.email = email;
    }
    if (roleId) {
      options.where.roleId = roleId;
    }

    if (not_id) {
      options.where.id = { [Op.ne]: not_id };
    }

    if (includeCredentials) {
      options.include.push({
        model: super.PrimaryDbModels[this.UserCredentialsTableName],
      });
    }

    const dbResult = await super.PrimaryDbModels[this.MainTableName].findOne(
      options
    );
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async CreateUserToken({ input, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels[
      this.AccessTokenTableName
    ].create(input);
    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async FindAccessToken({ accessToken, returnAsJson = true }) {
    const dbResult = await super.PrimaryDbModels[
      this.AccessTokenTableName
    ].findByPk(accessToken);

    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }

  async FindUserById({ id, includeCredentials = false, returnAsJson = true }) {
    const options = {
      include: [
        {
          model: super.PrimaryDbModels[this.RolesMasterDataTableName],
        },
      ],
    };

    if (includeCredentials) {
      options.include.push({
        model: super.PrimaryDbModels[this.UserCredentialsTableName],
      });
    }

    const dbResult = await super.PrimaryDbModels[this.MainTableName].findByPk(
      id,
      {
        ...options,
      }
    );

    return super.handleSingObjectReturn({ dbResult, returnAsJson });
  }
};
