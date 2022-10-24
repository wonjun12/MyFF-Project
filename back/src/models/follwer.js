'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follwer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  Follwer.init({
    MyUID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    FUID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    modelName: 'Follwer',
  });

  Follwer.associate = (models) => {
    Follwer.belongsTo(models.Users, {
      foreignKey: "MyUID"
    });
    Follwer.belongsTo(models.Users, {
      foreignKey: "FUID"
    });
  };


  return Follwer;
};