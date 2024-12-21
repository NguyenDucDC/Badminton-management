const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    cus_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cus_phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    facility_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sale_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    default: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = Order;
