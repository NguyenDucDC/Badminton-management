
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Facility = require('./facility');

const FacilitySales = sequelize.define('FacilitySales', {
  facility_id: {
    type: DataTypes.STRING,
    references: {
      model: Facility,
      key: 'id'
    },
    primaryKey: true,
  },
  sale_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'id'
    },
    primaryKey: true,
  },
  facility_name: {
    type: DataTypes.STRING,
  },
  sale_name: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});

module.exports = FacilitySales;
