const express = require('express');
const router = express.Router();
const salesUserController = require('../controllers/salesUserController');

router.get('/get-sales-facility/:id', salesUserController.getSalesFacility);

module.exports = router;
