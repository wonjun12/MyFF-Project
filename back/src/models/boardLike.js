'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoardLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BoardLike.init({
    BID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
    timestamps: false,
    modelName: 'BoardLike',
  });

  BoardLike.associate = (models) => {
    BoardLike.belongsTo(models.Users, {
        foreignKey: "UID"
      });
      BoardLike.belongsTo(models.Board, {
        foreignKey: "BID"
      });
  };


  return BoardLike;
};