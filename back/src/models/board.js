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
    Content: DataTypes.STRING,
    Star: DataTypes.INTEGER,
    Views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
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
    Board.belongsTo(models.Hashtag, {
      foreignKey: 'BID'
    });
  };


  return Board;
};