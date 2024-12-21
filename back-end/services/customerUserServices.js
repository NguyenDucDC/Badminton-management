const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('../models/customer');

// find customer
exports.findCustomer = async (phone) => {
    return Customer.findOne({ where: { phone } })
}
