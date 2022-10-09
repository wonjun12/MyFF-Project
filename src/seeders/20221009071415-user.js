'use strict';
const  crypto = require('crypto');
const  models = require('../models');


const salt = {
  t1: Math.round((new Date().valueOf() * Math.random())) + "",
  t2: Math.round((new Date().valueOf() * Math.random())) + "",
  t3: Math.round((new Date().valueOf() * Math.random())) + "",
  t4: Math.round((new Date().valueOf() * Math.random())) + "",
  t5: Math.round((new Date().valueOf() * Math.random())) + "",
};
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
   
    await queryInterface.bulkInsert("users", [
        {
          Email: "won@myff.com",
          Name: "원준",
          NickName: "집돌이",
          BirthDay: new Date,
          Pwd: crypto.createHash("sha512").update("123456789" + salt.t1).digest("hex"),
          Salt: salt.t1
        },
        {
          Email: "jun@myff.com",
          Name: "준준",
          NickName: "밖돌이",
          BirthDay: new Date,
          Pwd: crypto.createHash("sha512").update("abcdefg" + salt.t2).digest("hex"),
          Salt: salt.t2
        },
        {
          Email: "son@myff.com",
          Name: "손민수",
          NickName: "송송돌이",
          BirthDay: new Date,
          Pwd: crypto.createHash("sha512").update("qwe789" + salt.t3).digest("hex"),
          Salt: salt.t3
        },
        {
          Email: "big@myff.com",
          Name: "빅맘파",
          NickName: "먹을거 주세요",
          BirthDay: new Date,
          Pwd: crypto.createHash("sha512").update("asd456" + salt.t4).digest("hex"),
          Salt: salt.t4
        },
        {
          Email: "home@myff.com",
          Name: "김민수",
          NickName: "집 전세냄",
          BirthDay: new Date,
          Pwd: crypto.createHash("sha512").update("zxc123" + salt.t5).digest("hex"),
          Salt: salt.t5
        }
      ],{},);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // await queryInterface.bulkDelete("users", null, { truncate: true});
    await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
    await models.Users.truncate();
    await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
