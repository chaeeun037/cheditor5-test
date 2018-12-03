'use strict'

module.exports = function (sequelize ,Sequelize) {
  let model = sequelize.define('file',{
    name : {type : Sequelize.STRING}, /* 파일 명 */  
  });

  return model;
}