'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    CID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    BID: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    UID: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    comm: DataTypes.STRING,
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
    modelName: 'Comment',
  });

    Comment.associate = (models) => {
      Comment.belongsTo(models.Users,{
        foreignKey: "UID"
      });
      Comment.belongsTo(models.Board, {
        foreignKey: "BID"
      });
    };




  return Comment;
};