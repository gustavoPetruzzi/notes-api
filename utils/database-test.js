const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('note_test', 'root', '1161544761', {
  dialect: 'mysql',
  host: 'mysql'
});

module.exports = sequelize;
