const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Posts = sequelize.define('Posts', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

module.exports = Posts;
