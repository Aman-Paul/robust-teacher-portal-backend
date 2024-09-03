'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require("../dbConfig");
const BaseModel = require('./base.model');

class Users extends BaseModel {
    static associate(models) {
     
    }
  }

  Users.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: true
  });


module.exports = Users;
