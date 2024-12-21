
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FacilityImage = sequelize.define('FacilityImage', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    facility_id: {
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

module.exports = FacilityImage;
