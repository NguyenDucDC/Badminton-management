
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostsImage = sequelize.define('PostsImage', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    posts_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = PostsImage;
