const calendarUserServices = require('../services/calendarUserServices');
const orderController = require('../controllers/orderController');
const moment = require('moment-timezone');
const { getDaysInMonthWithSpecificWeekdays } = require('../utils/utils');

exports.getCalendarByDate = async (req, res) => {
    const facility_id = req.params.id
    const day = req.body.date

    try {
        const calendar = await calendarUserServices.getCalendarByDate(facility_id, day);

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

// check calendar
exports.checkCalendar = async (req, res) => {
    const data = req.body

    try {
        const court = await calendarUserServices.checkCalendar(data);

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

        const court = await calendarUserServices.checkCalendarDefaultMonth(data, dates);

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