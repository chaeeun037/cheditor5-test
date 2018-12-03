'use strict';

const config = require('config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.get('sequelize'));
const db = {};
const fs = require('fs');
const kongFinanceModel = {};

fs.readdirSync(`${__dirname}/lib`).forEach(file => {
  let modelName = file.replace(/\.js$/, '').replace(/-[a-z]/g, str => str[1].toUpperCase());
  let model = require(`${__dirname}/lib/${file}`);

  kongFinanceModel[modelName] = model;
});


function afterHookChain (instance) {
  if (Array.isArray(instance)) {
    instance.forEach(item => {
      afterHookChain(item);
    });
  } else if (instance && instance.dataValues) {
    if (instance.dataValues.createdAt && instance.dataValues.createdAt instanceof Date) {
      instance.dataValues.createdAt = instance.dataValues.createdAt.getTime();
    }

    if (instance.dataValues.updatedAt && instance.dataValues.updatedAt instanceof Date) {
      instance.dataValues.updatedAt = instance.dataValues.updatedAt.getTime();
    }

    if (instance.dataValues.deletedAt && instance.dataValues.deletedAt instanceof Date) {
      instance.dataValues.deletedAt = instance.dataValues.deletedAt.getTime();
    }
  }
}

sequelize.addHook('afterFind', afterHookChain);
sequelize.addHook('afterCreate', afterHookChain);
sequelize.addHook('afterUpdate', afterHookChain);
sequelize.addHook('afterDestroy', afterHookChain);
sequelize.addHook('afterSave', afterHookChain);

Object.keys(kongFinanceModel).forEach(modelName => {
  db[modelName] = kongFinanceModel[modelName](sequelize, Sequelize);
});

for (let modelName in db) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.init = () => {
  let promises = [];

  for (let modelName in db) {
    if (db[modelName].postConstruct) {
      promises.push(db[modelName].postConstruct(db));
    }
  }

  return promises;
};

module.exports = db;
