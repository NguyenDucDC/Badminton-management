
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatarURL: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'sale', 'user'),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true,
});

module.exports = User;
