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
    PlaceName : DataTypes.STRING,
    Content: DataTypes.STRING(10000),
    Star: DataTypes.INTEGER,
    Views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
    modelName: 'Board',
  });

  Board.associate = (models) => {
    Board.hasMany(models.Comment, {
      foreignKey: "BID"
    });
    Board.hasMany(models.Picture,{
      foreignKey: "BID"
    });
    Board.hasMany(models.BoardLike, {
      foreignKey: "BID"
    });
    Board.belongsTo(models.Users, {
      foreignKey: "UID"
    });
    Board.hasMany(models.Hashtag, {
      foreignKey: 'BID'
    });
  };


  return Board;
};