const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderCourt = sequelize.define('OrderCourt', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    court_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    checkOut: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = OrderCourt;
