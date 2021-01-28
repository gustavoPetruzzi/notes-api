const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('notes', 'root', '1161544761', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;