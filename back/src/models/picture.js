'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Picture.init({
    PID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    BID: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    Photo: {
      allowNull: false,
      type: DataTypes.BLOB("long")
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
    timestamps: false,
    modelName: 'Picture',
  });

  Picture.associate = (models) => {
    Picture.belongsTo(models.Board, {
      foreignKey: "BID"
    });
  };


  return Picture;
};