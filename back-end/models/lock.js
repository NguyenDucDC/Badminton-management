const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lock = sequelize.define('Lock', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    time_start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time_end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Lock;
