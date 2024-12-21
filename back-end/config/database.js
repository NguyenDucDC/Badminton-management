// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('BadmintonManagement', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
