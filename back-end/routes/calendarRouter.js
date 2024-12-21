const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const Authorization = require('../middleware/authorization');

router.post('/get-calendar-by-date/:id', Authorization.authenToken(), calendarController.getCalendarByDate);
router.post('/get-lock-by-date/:id', Authorization.authenToken(), calendarController.getLockByDate);
router.post('/check-calendar', Authorization.authenToken(), calendarController.checkCalendar);
router.post('/check-calendar-default-month', Authorization.authenToken(), calendarController.checkCalendarDefaultMonth);

module.exports = router;
