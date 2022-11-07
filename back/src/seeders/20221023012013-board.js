'use strict';
const  models = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert("boards", [
      {
        UID: 1,
        Location: "인천 남동구 예술로152번길 33",
        Content: "인천 MBC 인천지국이라는 곳이라더라",
        Star: 3,
      }, {
        UID: 1,
        Location: "인천 남동구 성말로13번길 78",
        Content: "예술회관역 구월여자 중학교라는데? 쩐다",
        Star: 2,
      }, {
        UID: 1,
        Location: "인천 남동구 문화서로18번길 22",
        Content: "GS25 남동늘푸른점은 별로인거 같아",
        Star: 1,
      }, {
        UID: 1,
        Location: "인천 남동구 정각로 29",
        Content: "인천광역시청가니까 사람들 친절하고 좋은거같기도?",
        Star: 4,
      }, {
        UID: 2,
        Location: "인천광역시 미추홀구 주안로 95-19",
        Content: "놀사람 주안역 모여라!!",
        Star: 5,
      }, {
        UID: 2,
        Location: "인천 미추홀구 미추홀대로 743",
        Content: "점심은 롯데리아다!!!!",
        Star: 5,
      }, {
        UID: 2,
        Location: "인천 미추홀구 주안서로 25",
        Content: "아 나 아파... 보건소점",
        Star: 2,
      }, {
        UID: 2,
        Location: "인천 부평구 부평대로 168",
        Content: "심심한데 부평구청 갈사람 ㅋㅋ",
        Star: 4,
      }
    ],{},)

    for(let i = 0; i < 50; i++){
      await queryInterface.bulkInsert("boards", [
        {
          UID: 1,
          Location: "게시판 주소 : " + i,
          Content: "글 내용 : " + i,
          Star : 3
        }
      ]
      ,{})
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
     await models.Board.truncate();
     await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
  }
};
