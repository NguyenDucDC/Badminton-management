const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order');
const Customer = require('../models/customer');
const OrderCourt = require('../models/order-court');
const Facility = require('../models/facility');
const CustomerFacility = require('../models/customer-facility')
const sequelize = require('../config/database');
const moment = require('moment-timezone');
const facilityServices = require('./facilityServices')

exports.createOrderDefaultMonth = async (saleId, data, days) => {
    const orderId = uuidv4();

    await Order.create({
        id: orderId,
        cus_name: data.cus_name,
        cus_phone: data.cus_phone,
        facility_id: data.facility,
        sale_id: saleId,
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

exports.createOrder = async (saleId, data) => {
    const orderId = uuidv4();

    await Order.create({
        id: orderId,
        cus_name: data.cus_name,
        cus_phone: data.cus_phone,
        facility_id: data.facility,
        sale_id: saleId,
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

// get detail order
exports.getDetailOrder = async (id) => {

    const days = await OrderCourt.findAll({ where: { order_id: id } });

    const weekdays = days.map(day => {
        const checkInDate = new Date(day.checkIn);
        return checkInDate.getDay();
    });

    const query = `
      SELECT 
        orders.cus_name, 
        orders.cus_phone, 
        orders.facility_id,
        orders.note,
        orders.price,
        orders.sale_id,
        orders.default,
        MIN(orderCourts.checkIn) AS checkIn,
        MIN(orderCourts.checkOut) AS checkOut,
        GROUP_CONCAT(orderCourts.court_id) AS courts
      FROM orders
      JOIN orderCourts ON orders.id = orderCourts.order_id
      WHERE orders.id = :id
      GROUP BY orders.id
    `;

    const [results, metadata] = await sequelize.query(query, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
    });

    // Chuyển đổi courts từ chuỗi thành mảng
    if (results && results.courts) {
        results.courts = results.courts.split(',').map(Number);
    }

    results.checkIn = moment(results.checkIn).format()
    results.checkOut = moment(results.checkOut).format()
    results.days = weekdays

    return results;
};


// get list order of facilities that sales work
exports.getListOrderSales = async (id, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const facilities = await facilityServices.getFacilityOfSales(id)
    const facilitiesId = facilities.map(facility => facility.id)

    const query = `
      SELECT 
        orders.id,
        orders.cus_name,
        orders.cus_phone,
        orders.note,
        orders.default,
        orders.price,
        facilities.name as facility_name,
        users.username as sales_name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      JOIN users ON users.id = orders.sale_id
      WHERE orders.sale_id = :id
      ORDER BY orders.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { id, pageSize, offset }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM orders
        WHERE orders.sale_id = :id
    `;
    const [countResult] = await sequelize.query(countQuery, {
        replacements: { id }
    });
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};

// get list order of facilities that manager work
exports.getListOrderManager = async (id, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const facilities = await facilityServices.getFacilityOfManager(id)
    const facilitiesId = facilities.map(facility => facility.id)

    const query = `
      SELECT 
        orders.id,
        orders.cus_name,
        orders.cus_phone,
        orders.note,
        orders.default,
        orders.price,
        facilities.name as facility_name,
        users.username as sales_name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      LEFT JOIN users ON users.id = orders.sale_id
      WHERE orders.facility_id IN (:facilitiesId)
      ORDER BY orders.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { facilitiesId, pageSize, offset }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM orders
        WHERE orders.facility_id IN (:facilitiesId)
    `;
    const [countResult] = await sequelize.query(countQuery, {
        replacements: { facilitiesId }
    });
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};

// get all order
exports.getAllOrder = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;

    const query = `
      SELECT 
        orders.id,
        orders.cus_name,
        orders.cus_phone,
        orders.note,
        orders.default,
        orders.price,
        facilities.name as facility_name,
        users.username as sales_name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      LEFT JOIN users ON users.id = orders.sale_id
      ORDER BY orders.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { pageSize, offset }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM orders
    `;
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};


// get filter order by admin
exports.getFilterOrder = async (page, pageSize, user, data) => {
    const offset = (page - 1) * pageSize;

    // Xây dựng phần WHERE động
    let whereClauses = [];
    let replacements = { pageSize, offset };

    // Điều chỉnh múi giờ khi so sánh ngày, tháng, năm
    const adjustedDateField = "CONVERT_TZ(orders.createdAt, '+00:00', '+07:00')";

    // check role
    if (user.role === "sale") {
        whereClauses.push(`orders.sale_id = :sale_id`);
        replacements.sale_id = user.id;
    } else if (user.role === "manager" && !data.facility_id) {
        const facilities = await facilityServices.getFacilityOfManager(user.id)
        const facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    }

    // Kiểm tra và thêm điều kiện vào mảng whereClauses nếu dữ liệu có giá trị
    if (data.facility_id) {
        whereClauses.push(`orders.facility_id = :facility_id`);
        replacements.facility_id = data.facility_id;
    }

    if (data.sales_id) {
        whereClauses.push(`orders.sale_id = :sales_id`);
        replacements.sales_id = data.sales_id;
    }

    if (data.year) {
        whereClauses.push(`YEAR(${adjustedDateField}) = :year`);
        replacements.year = data.year;
    }

    if (data.month) {
        whereClauses.push(`MONTH(${adjustedDateField}) = :month`);
        replacements.month = data.month;
    }

    if (data.day) {
        whereClauses.push(`DAY(${adjustedDateField}) = :day`);
        replacements.day = data.day;
    }

    if (data.phone) {
        whereClauses.push(`orders.cus_phone = :phone`);
        replacements.phone = data.phone;
    }

    // Kết hợp các điều kiện WHERE với nhau
    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        orders.id,
        orders.cus_name,
        orders.cus_phone,
        orders.note,
        orders.default,
        orders.price,
        facilities.name as facility_name,
        users.username as sales_name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      LEFT JOIN users ON users.id = orders.sale_id
      ${whereClause}
      ORDER BY orders.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM orders
        ${whereClause}
    `;
    const [countResult] = await sequelize.query(countQuery, {
        replacements
    });
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};



// cancel order
exports.cancelOrder = async (order_id) => {
    // delete order 
    const queryDeleteOrder = `
        DELETE FROM orders
        WHERE orders.id = :order_id
    `;

    await sequelize.query(queryDeleteOrder, {
        replacements: { order_id }
    });

    //delete orderCourts
    const queryDeleteOrderCourts = `
        DELETE FROM orderCourts
        WHERE orderCourts.order_id = :order_id
    `;

    await sequelize.query(queryDeleteOrderCourts, {
        replacements: { order_id }
    });

    return;
};




