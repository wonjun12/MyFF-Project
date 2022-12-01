"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hashtag.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      BID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false,
      sequelize,
      modelName: "Hashtag",
    }
  );

  Hashtag.associate = (models) => {
    Hashtag.belongsTo(models.Board, {
      foreignKey: "BID",
    });
  };
  return Hashtag;
};
