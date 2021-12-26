'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Albums, Users}) {
      // define association here
      this.belongsTo(Albums, {foreignKey: 'albumId', as: 'album'});
      this.belongsTo(Users, {foreignKey: 'userId', as: 'user'});
    }
  };
  Reviews.init({
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};