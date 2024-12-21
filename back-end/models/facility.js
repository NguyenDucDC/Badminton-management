
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Facility = sequelize.define('Facility', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
    },
    manager_id: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'id'
        },
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true,
});

module.exports = Facility;
