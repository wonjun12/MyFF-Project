'use strict';
const  models = require('../models');
const imgDummy = require("../img/imgDummy");

let photoDummy = [];
imgDummy.photo(1).then(result => {
  photoDummy.push(result);
});
imgDummy.photo(2).then(result => {
  photoDummy.push(result);
});

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
    await queryInterface.bulkInsert("pictures", [
      {
        BID: 1,
        Photo: photoDummy[0]
      },
      {
        BID: 2,
        Photo: photoDummy[0]
      },
      {
        BID: 3,
        Photo: photoDummy[0]
      },
      {
        BID: 4,
        Photo: photoDummy[0]
      },
      {
        BID: 5,
        Photo: photoDummy[1]
      },
      {
        BID: 6,
        Photo: photoDummy[1]
      },
      {
        BID: 7,
        Photo: photoDummy[1]
      },
      {
        BID: 8,
        Photo: photoDummy[1]
      },
    ],{},)


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
     await models.Picture.truncate();
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
