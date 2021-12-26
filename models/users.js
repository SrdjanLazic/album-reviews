'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Albums, Reviews}) {
      // define association here
      this.hasMany(Reviews, {foreignKey: 'userId', as: 'reviews', onDelete: 'cascade', hooks: true});
    }
  };
  Users.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Email address is not valid"
        },
        notNull: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    }
  }, {
    sequelize,
    defaultScope: {
      attributes: { exclude: ['email']}
    },
    modelName: 'Users',
  });
  return Users;
};