'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      UID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull:false,
        validate: {
        isEmail: true
      }
      },
      Pwd: {
        allowNull:false,
        type: Sequelize.STRING
      },
      Name: {
        allowNull:false,
        unique: true,
        type: Sequelize.STRING
      },
      NickName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      BirthDay: {
        type: Sequelize.DATE
      },
      Salt: {
        allowNull:false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};