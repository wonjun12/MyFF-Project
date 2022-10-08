'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Board.init({
    BID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UID: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    Location: {
      allowNull: false,
      type: DataTypes.STRING
    },
    Content: DataTypes.STRING,
    Star: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
    modelName: 'Board',
  });

  Board.associate = (models) => {
    Board.hasMany(models.Comment);
    Board.hasMany(models.Picture);
    Board.belongsTo(models.Users, {
      foreignKey: "UID"
    });
  };


  return Board;
};