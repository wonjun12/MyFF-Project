'use strict';
const  models = require('../models');
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

    for(let i = 1; i < 5; i++){
      for(let j = 1; j < 3; j++){
        await queryInterface.bulkInsert('boardLikes', [
          {
            BID: i,
            UID: j
          }
        ], {});
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
     await models.BoardLike.truncate();
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
