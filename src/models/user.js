'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    UID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    Email: {
      type:DataTypes.STRING,
      unique: true,
      allowNull:false
    },
    Pwd: DataTypes.STRING,
    Name: DataTypes.STRING,
    NickName: {
      type: DataTypes.STRING,
      unique: true
    },
    BirthDay: DataTypes.DATE,
    Salt: DataTypes.STRING,
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
    modelName: 'Users'
  });

  User.associate = (models) => {
    User.hasMany(models.Follwer);
    User.hasMany(models.Board);
    User.hasMany(models.Comment);
  };  

  return User;
};