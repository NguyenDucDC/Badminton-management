const express = require('express');
const router = express.Router();
const orderUserController = require('../controllers/orderUserController');
const Authorization = require('../middleware/authorization');


router.post('/create-order', orderUserController.createOrder);
router.post('/price-calculation', orderUserController.priceCalculation);
router.get('/get-list-order/:id', Authorization.authenToken(), orderUserController.getListOrder);

module.exports = router;
