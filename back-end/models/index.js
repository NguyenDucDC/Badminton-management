const sequelize = require('../config/database');
const User = require('./user');
const Facility = require('./facility');
const FacilitySales = require('./facility-sales');
const Order = require('./order')
const Price = require('./price')
const OrderCourt = require('./order-court')
const Customer = require('./customer')
const CustomerFacility = require('./customer-facility')
const FacilityImage = require('./facility-image')
const IncomeExpenditure = require('./income-expenditure')
const ContractImage = require('./contract-image')
const Lock = require('./lock')
const LockFacility = require('./lock-facility')
const Posts = require('./posts')
const PostsImage = require('./posts-image')

const db = {
    sequelize,
    User,
    Facility,
    FacilitySales,
    Order,
    Price,
    OrderCourt,
    Customer,
    CustomerFacility,
    FacilityImage,
    IncomeExpenditure,
    ContractImage,
    Lock,
    LockFacility,
    Posts,
    PostsImage
};

module.exports = db;
