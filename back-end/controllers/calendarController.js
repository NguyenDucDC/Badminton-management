const calendarServices = require('../services/calendarServices');
const orderController = require('../controllers/orderController');
const moment = require('moment-timezone');
const { getDaysInMonthWithSpecificWeekdays } = require('../utils/utils');

// get calendar by date
exports.getCalendarByDate = async (req, res) => {
    const facility_id = req.params.id
    const day = req.body.date

    try {
        const calendar = await calendarServices.getCalendarByDate(facility_id, day);

        res.status(200).json({
            message: 'Lấy lịch thành công!',
            status: 1,
            calendar
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get lock by date
exports.getLockByDate = async (req, res) => {
    const facility_id = req.params.id
    const day = req.body.date

    try {
        const lock = await calendarServices.getLockByDate(facility_id, day);

        res.status(200).json({
            message: 'Lấy lịch khoá cơ sở thành công!',
            status: 1,
            lock
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// check calendar
exports.checkCalendar = async (req, res) => {
    const data = req.body

    try {
        const court = await calendarServices.checkCalendar(data);

        res.status(200).json({
            message: 'Lấy lịch thành công!',
            status: 1,
            court
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// check calendar default month
exports.checkCalendarDefaultMonth = async (req, res) => {
    const data = req.body

    try {
        const monthGMT7 = moment(data.month).tz("Asia/Ho_Chi_Minh");
        const dates = getDaysInMonthWithSpecificWeekdays(monthGMT7.month(), monthGMT7.year(), data.day)

        const court = await calendarServices.checkCalendarDefaultMonth(data, dates);

        res.status(200).json({
            message: 'Kiểm tra lịch thành công!',
            status: 1,
            court
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};