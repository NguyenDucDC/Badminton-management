const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Price = sequelize.define('Price', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    facility_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    p1: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p2: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p3: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p4: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p5: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p6: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p7: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
    p8: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Price;
