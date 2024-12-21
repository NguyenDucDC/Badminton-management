const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LockFacility = sequelize.define('LockFacility', {
    lock_id: {
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
    timestamps: false,
});

module.exports = LockFacility;
