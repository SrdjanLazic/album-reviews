'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Albums}) {
      // define association here
      this.hasMany(Albums, {foreignKey: 'artistId', as: 'albums', onDelete: 'cascade', hooks: true})
    }
  };
  Artists.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Artists',
  });
  return Artists;
};