const orderServices = require('../services/orderServices');
const facilityServices = require('../services/facilityServices');
const calendarServices = require('../services/calendarServices')
const moment = require('moment-timezone');
const { getDaysInMonthWithSpecificWeekdays } = require('../utils/utils');

// price calculation
exports.priceCalculation = async (req, res) => {
    if (req.user.role !== "sale") {
        return res.status(400).json({ message: 'you are not sales' })
    }

    try {
        const data = req.body
        const Price = await facilityServices.getPriceFacility(data.facility)
        const checkinInGMT7 = moment(data.checkIn).tz("Asia/Ho_Chi_Minh");
        const checkinOutGMT7 = moment(data.checkOut).tz("Asia/Ho_Chi_Minh");
        const checkinHour = checkinInGMT7.hour();
        const checkoutHour = checkinOutGMT7.hour();
        let cost = 0;
        const SHIFT_CHANGE = 17

        if (data.month) { // dat don co dinh theo thang
            const monthGMT7 = moment(data.month).tz("Asia/Ho_Chi_Minh");
            const days = getDaysInMonthWithSpecificWeekdays(monthGMT7.month(), monthGMT7.year(), data.day)

            for (let i = 0; i < days.length; i++) {
                const checkinDayOfWeek = days[i].day();
                const checkoutDayOfWeek = days[i].day();
                let price = 0;

                if (checkinDayOfWeek === checkoutDayOfWeek) { // trong ngay
                    if (checkinDayOfWeek === 0 || checkinDayOfWeek === 6) { // thu 7, chu nhat
                        if (checkinHour >= SHIFT_CHANGE) {
                            price = (checkoutHour - checkinHour) * Price.p7
                        } else if (checkoutHour <= SHIFT_CHANGE) {
                            price = (checkoutHour - checkinHour) * Price.p3
                        } else {
                            price = (checkoutHour - SHIFT_CHANGE) * Price.p7 + (SHIFT_CHANGE - checkinHour) * Price.p3
                        }
                    } else { // ngay trong tuan 2-6
                        if (checkinHour >= SHIFT_CHANGE) {
                            price = (checkoutHour - checkinHour) * Price.p5
                        } else if (checkoutHour <= SHIFT_CHANGE) {
                            price = (checkoutHour - checkinHour) * Price.p1
                        } else {
                            price = (checkoutHour - SHIFT_CHANGE) * Price.p5 + (SHIFT_CHANGE - checkinHour) * Price.p1
                        }
                    }
                } else if (checkinDayOfWeek === 5) { // lien ngay 6-7
                    if (checkinHour >= SHIFT_CHANGE) {
                        price = (24 - checkinHour) * Price.p5 + checkoutHour * Price.p3
                    } else if (checkinHour < SHIFT_CHANGE) {
                        price = (SHIFT_CHANGE - checkinHour) * Price.p1 + (24 - SHIFT_CHANGE) * Price.p5 + checkoutHour * Price.p3
                    }
                } else if (checkinDayOfWeek === 6) { // lien ngay 7-cn
                    if (checkinHour >= SHIFT_CHANGE) {
                        price = (24 - checkinHour) * Price.p7 + checkoutHour * Price.p3
                    } else {
                        price = (24 - SHIFT_CHANGE) * Price.p7 + (checkoutHour - checkinHour + SHIFT_CHANGE) * Price.p3
                    }
                } else if (checkinDayOfWeek === 0) { // lien ngay cn-2
                    if (checkinHour >= SHIFT_CHANGE) {
                        price = (24 - checkinHour) * Price.p7 + checkoutHour * Price.p1
                    } else {
                        price = (SHIFT_CHANGE - checkinHour) * Price.p3 + (24 - SHIFT_CHANGE) * Price.p7 + checkoutHour * Price.p1
                    }
                } else { // lien ngay trong tuan 2-6
                    if (checkinHour >= SHIFT_CHANGE) {
                        price = (24 - checkinHour) * Price.p5 + checkoutHour * Price.p1
                    } else {
                        price = (24 - SHIFT_CHANGE) * Price.p5 + (checkoutHour - checkinHour + SHIFT_CHANGE) * Price.p1
                    }
                }

                cost += price
            }

        } else { // dat don le
            const checkinDayOfWeek = checkinInGMT7.day();
            const checkoutDayOfWeek = checkinOutGMT7.day();

            if (checkinDayOfWeek === checkoutDayOfWeek) { // trong ngay
                if (checkinDayOfWeek === 0 || checkinDayOfWeek === 6) { // thu 7, chu nhat
                    if (checkinHour >= SHIFT_CHANGE) {
                        cost = (checkoutHour - checkinHour) * Price.p8
                    } else if (checkoutHour <= SHIFT_CHANGE) {
                        cost = (checkoutHour - checkinHour) * Price.p4
                    } else {
                        cost = (checkoutHour - SHIFT_CHANGE) * Price.p8 + (SHIFT_CHANGE - checkinHour) * Price.p4
                    }
                } else { // ngay trong tuan 2-6
                    if (checkinHour >= SHIFT_CHANGE) {
                        cost = (checkoutHour - checkinHour) * Price.p6
                    } else if (checkoutHour <= SHIFT_CHANGE) {
                        cost = (checkoutHour - checkinHour) * Price.p2
                    } else {
                        cost = (checkoutHour - SHIFT_CHANGE) * Price.p6 + (SHIFT_CHANGE - checkinHour) * Price.p2
                    }
                }
            } else if (checkinDayOfWeek === 5) { // lien ngay 6-7
                if (checkinHour >= SHIFT_CHANGE) {
                    cost = (24 - checkinHour) * Price.p6 + checkoutHour * Price.p4
                } else if (checkinHour < SHIFT_CHANGE) {
                    cost = (SHIFT_CHANGE - checkinHour) * Price.p2 + (24 - SHIFT_CHANGE) * Price.p6 + checkoutHour * Price.p4
                }
            } else if (checkinDayOfWeek === 6) { // lien ngay 7-cn
                if (checkinHour >= SHIFT_CHANGE) {
                    cost = (24 - checkinHour) * Price.p8 + checkoutHour * Price.p4
                } else {
                    cost = (24 - SHIFT_CHANGE) * Price.p8 + (checkoutHour - checkinHour + SHIFT_CHANGE) * Price.p4
                }
            } else if (checkinDayOfWeek === 0) { // lien ngay cn-2
                if (checkinHour >= SHIFT_CHANGE) {
                    cost = (24 - checkinHour) * Price.p8 + checkoutHour * Price.p2
                } else {
                    cost = (SHIFT_CHANGE - checkinHour) * Price.p4 + (24 - SHIFT_CHANGE) * Price.p8 + checkoutHour * Price.p2
                }
            } else { // lien ngay trong tuan 2-6
                if (checkinHour >= SHIFT_CHANGE) {
                    cost = (24 - checkinHour) * Price.p6 + checkoutHour * Price.p2
                } else {
                    cost = (24 - SHIFT_CHANGE) * Price.p6 + (checkoutHour - checkinHour + SHIFT_CHANGE) * Price.p2
                }
            }
        }

        cost = cost * data.court.length // number court

        res.status(200).json({
            message: 'Tính giá đơn hàng thành công!',
            status: 1,
            cost
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
}

// create order
exports.createOrder = async (req, res) => {
    if (req.user.role !== "sale") {
        return res.status(400).json({ message: 'you are not sales' })
    }

    const data = req.body
    const saleId = req.user.id

    try {
        if (data.defaultMonth) {
            const monthGMT7 = moment(data.month).tz("Asia/Ho_Chi_Minh");
            const days = getDaysInMonthWithSpecificWeekdays(monthGMT7.month(), monthGMT7.year(), data.day)

            const invalidCourt = await calendarServices.checkCalendarDefaultMonth(data, days) // trả về sân bị trùng lịch
            if (invalidCourt.length) {
                return res.status(500).json({
                    message: 'Đơn hàng bị trùng lịch!',
                    status: 0,
                    invalidCourt
                });
            } else {
                await orderServices.createOrderDefaultMonth(saleId, data, days); // nếu không bị trùng lịch thì tạo đơn hàng
            }

        } else {
            const invalidCourt = await calendarServices.checkCalendar(data) // trả về sân bị trùng lịch
            if (invalidCourt.length) {
                return res.status(500).json({
                    message: 'Đơn hàng bị trùng lịch!',
                    status: 0,
                    invalidCourt
                });
            } else {
                await orderServices.createOrder(saleId, data); // nếu không bị trùng lịch thì tạo đơn hàng
            }
        }

        return res.status(200).json({
            message: 'Thêm đơn hàng thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        return res.status(500).json({ message: `${err}` });
    }
};

// get detail order
exports.getDetailOrder = async (req, res) => {
    const id = req.params.id

    try {
        const order = await orderServices.getDetailOrder(id);

        res.status(200).json({
            message: 'Lấy chi tiết đơn hàng thành công!',
            status: 1,
            order
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get order sale
exports.getListOrderSales = async (req, res) => {
    const id = req.params.id
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const order = await orderServices.getListOrderSales(id, page, pageSize);

        res.status(200).json({
            message: 'Lấy đơn hàng thành công!',
            status: 1,
            order
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get list order manager
exports.getListOrderManager = async (req, res) => {
    if (req.user.role !== "manager") {
        return res.status(500).json({ message: 'you are not manager' });
    }
    const id = req.params.id
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const order = await orderServices.getListOrderManager(id, page, pageSize);

        res.status(200).json({
            message: 'Lấy đơn hàng thành công!',
            status: 1,
            order
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get all order
exports.getAllOrder = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(500).json({ message: 'you are not admin' });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const order = await orderServices.getAllOrder(page, pageSize);

        res.status(200).json({
            message: 'Lấy đơn hàng thành công!',
            status: 1,
            order
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get filter order
exports.getFilterOrder = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = req.body
    const user = req.user

    try {
        const order = await orderServices.getFilterOrder(page, pageSize, user, data);

        res.status(200).json({
            message: 'Lấy đơn hàng thành công!',
            status: 1,
            order
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// cancel order
exports.cancelOrder = async (req, res) => {
    if (req.user.role !== "sale" && req.user.role !== 'manager') {
        return res.status(500).json({ message: 'you are not sale or manager' });
    }

    const order_id = req.params.id

    try {
        await orderServices.cancelOrder(order_id);

        res.status(200).json({
            message: 'Huỷ đơn hàng thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};