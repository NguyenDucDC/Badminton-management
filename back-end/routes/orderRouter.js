const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const Authorization = require('../middleware/authorization');


router.post('/create-order', Authorization.authenToken(), orderController.createOrder);
router.post('/price-calculation', Authorization.authenToken(), orderController.priceCalculation);
router.post('/get-filter-order', Authorization.authenToken(), orderController.getFilterOrder);

router.get('/get-detail-order/:id', Authorization.authenToken(), orderController.getDetailOrder);
router.get('/get-list-order-sales/:id', Authorization.authenToken(), orderController.getListOrderSales);
router.get('/get-list-order-manager/:id', Authorization.authenToken(), orderController.getListOrderManager);
router.get('/get-all-order', Authorization.authenToken(), orderController.getAllOrder);

router.delete('/cancel-order/:id', Authorization.authenToken(), orderController.cancelOrder);

module.exports = router;
