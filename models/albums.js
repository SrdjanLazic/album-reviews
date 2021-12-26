'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Albums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Artists, Reviews, Users}) {
      // define association here
      this.belongsTo(Artists, {foreignKey: 'artistId', as: 'artist'});
      this.hasMany(Reviews, {foreignKey: 'albumId', as: 'reviews', onDelete: 'cascade', hooks: true});
    }
  };
  Albums.init({
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    
  }, {
    sequelize,
    modelName: 'Albums',
  });
  return Albums;
};