const express = require('express');
const router = express.Router();
const customerUserController = require('../controllers/customerUserController');
const Authorization = require('../middleware/authorization');

router.post('/find-customer', customerUserController.findCustomer);

module.exports = router;
