const express = require('express');
const router = express.Router();
const calendarUserController = require('../controllers/calendarUserController');

router.post('/get-calendar-by-date/:id', calendarUserController.getCalendarByDate);
router.post('/check-calendar', calendarUserController.checkCalendar);
router.post('/check-calendar-default-month', calendarUserController.checkCalendarDefaultMonth);

module.exports = router;
