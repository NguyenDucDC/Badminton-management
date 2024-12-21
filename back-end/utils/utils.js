const moment = require('moment-timezone');

const getDaysInMonthWithSpecificWeekdays = (month, year, dayInWeek) => {
    const daysInMonth = moment({ year, month: month }).daysInMonth();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = moment({ year, month: month, day }).tz("Asia/Ho_Chi_Minh");
        const weekday = currentDay.day();

        if (dayInWeek.includes(weekday)) {
            days.push(currentDay);
        }
    }

    return days;
};

module.exports = {
    getDaysInMonthWithSpecificWeekdays,
};
