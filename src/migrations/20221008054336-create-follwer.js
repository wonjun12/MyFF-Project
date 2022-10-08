'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Follwers', {
      FID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MyUID: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      FUID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('', 'user_list_fk');
    await queryInterface.dropTable('Follwers');
  }
};