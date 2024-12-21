
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncomeExpenditure = sequelize.define('IncomeExpenditure', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('income', 'expenditure'),
        allowNull: false
    },
    facility_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    value: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
});

module.exports = IncomeExpenditure;
