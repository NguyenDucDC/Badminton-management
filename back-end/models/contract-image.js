const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContractImage = sequelize.define('ContractImage', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    contract_id: {  // khoá ngoại liên kết đến id bảng income-expenditure
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

module.exports = ContractImage;
