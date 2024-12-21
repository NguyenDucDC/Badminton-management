
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerFacility = sequelize.define('CustomerFacility', {
    customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    facility_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    }
}, {
    timestamps: true,
});

module.exports = CustomerFacility;
