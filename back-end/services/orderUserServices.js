const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order');
const Customer = require('../models/customer');
const OrderCourt = require('../models/order-court');
const CustomerFacility = require('../models/customer-facility')
const User = require('../models/user')
const sequelize = require('../config/database');
const moment = require('moment-timezone');

exports.createOrderDefaultMonth = async (data, days) => {
    const orderId = uuidv4();

    await Order.create({
        id: orderId,
        cus_name: data.cus_name,
        cus_phone: data.cus_phone,
        facility_id: data.facility,
        note: data.note,
        price: data.price,
        default: true
    });

    const checkInMoment = moment(data.checkIn).tz("Asia/Ho_Chi_Minh");
    const checkOutMoment = moment(data.checkOut).tz("Asia/Ho_Chi_Minh");

    const hoursCheckIn = checkInMoment.hours();
    const hoursCheckOut = checkOutMoment.hours();

    for (let i = 0; i < days.length; i++) {
        const day = moment(days[i])

        const checkIn = day.clone().set({ hour: hoursCheckIn, minute: '00', second: '00' });
        const checkOut = day.clone().set({ hour: hoursCheckOut, minute: '00', second: '00' });

        await OrderCourt.bulkCreate(
            data.court.map(court => ({
                id: uuidv4(),
                order_id: orderId,
                court_id: court,
                checkIn: checkIn,
                checkOut: checkOut,
            }))
        )
    }

    const customer = await Customer.findOne({
        where: {
            phone: data.cus_phone
        }
    })
    if (!customer) {
        const customer_id = uuidv4()
        await Customer.create({
            id: customer_id,
            username: data.cus_name,
            phone: data.cus_phone
        })
        await CustomerFacility.create({
            customer_id: customer_id,
            facility_id: data.facility
        })
    } else {
        const facility = await CustomerFacility.findOne({
            where: {
                customer_id: customer.id,
                facility_id: data.facility
            }
        })

        if (!facility) {
            await CustomerFacility.create({
                customer_id: customer.id,
                facility_id: data.facility
            })
        }
    }
}

exports.createOrder = async (data) => {
    const orderId = uuidv4();

    await Order.create({
        id: orderId,
        cus_name: data.cus_name,
        cus_phone: data.cus_phone,
        facility_id: data.facility,
        note: data.note,
        price: data.price,
        default: false
    });

    await OrderCourt.bulkCreate(
        data.court.map(court => ({
            id: uuidv4(),
            order_id: orderId,
            court_id: court,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
        }))
    )

    const customer = await Customer.findOne({
        where: {
            phone: data.cus_phone
        }
    })
    if (!customer) {
        const customer_id = uuidv4()
        await Customer.create({
            id: customer_id,
            username: data.cus_name,
            phone: data.cus_phone
        })
        await CustomerFacility.create({
            customer_id: customer_id,
            facility_id: data.facility
        })
    } else {
        const facility = await CustomerFacility.findOne({
            where: {
                customer_id: customer.id,
                facility_id: data.facility
            }
        })

        if (!facility) {
            await CustomerFacility.create({
                customer_id: customer.id,
                facility_id: data.facility
            })
        }
    }
};


// get list order
exports.getListOrder = async (id) => {

    const user = await User.findOne({
        where: { id }
    });

    const phoneNumber = user.phone

    const query = `
      SELECT 
        orders.id,
        orders.cus_name, 
        orders.cus_phone, 
        orders.facility_id,
        orders.note,
        orders.price,
        orders.sale_id,
        orders.default,
        orders.createdAt,
        facilities.name,
        facilities.number,
        MIN(orderCourts.checkIn) AS checkIn,
        MIN(orderCourts.checkOut) AS checkOut,
        GROUP_CONCAT(orderCourts.court_id) AS courts
      FROM orders
      JOIN orderCourts ON orders.id = orderCourts.order_id
      JOIN facilities ON facilities.id = orders.facility_id
      WHERE orders.cus_phone = :phoneNumber
      GROUP BY orders.id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { phoneNumber },
    });

    // Chuyển đổi courts từ chuỗi thành mảng
    const updatedResults = await Promise.all(results.map(async (order) => {

        const days = await OrderCourt.findAll({ where: { order_id: order.id } });

        const weekdays = [...new Set(days.map(day => {
            const checkInDate = new Date(day.checkIn);
            return checkInDate.getDay();
        }))];

        if (order && order.courts) {
            order.courts = [...new Set(order.courts.split(',').map(Number))];
        }

        order.createdAt = moment(order.createdAt).format();
        order.checkIn = moment(order.checkIn).format();
        order.checkOut = moment(order.checkOut).format();
        order.days = weekdays;

        return order;
    }));

    return updatedResults;
};
