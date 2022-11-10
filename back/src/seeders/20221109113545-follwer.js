'use strict';
const  models = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('follwers', [
      {
        MyUID: 1,
        FUID: 2
    }, 
    {
      MyUID : 1,
      FUID: 3
    },
    {
      MyUID : 1,
      FUID: 4
    }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
     await models.Follwer.truncate();
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
