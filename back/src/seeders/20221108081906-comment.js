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
   for(let i = 9; i <= 58; i++){
      for(let j = 0; j < 15; j++){
        await queryInterface.bulkInsert("comments", [{
          BID: i,
          UID: Math.ceil((Math.random() * 5)),
          comm: '댓글 적은 내용 : ' + j
        }],{})
      }
   }
     
  },

  async down (queryInterface, Sequelize) {

     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
     await models.Comment.truncate();
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
