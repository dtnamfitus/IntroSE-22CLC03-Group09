const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRESQL_DATABASE, process.env.POSTGRESQL_USERNAME, process.env.POSTGRESQL_PASSWORD, {
  host: process.env.POSTGRESQL_HOST,
  dialect: 'postgres',
});

module.exports = sequelize;
