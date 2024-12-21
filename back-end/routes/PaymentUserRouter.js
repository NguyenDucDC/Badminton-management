const express = require('express');
const router = express.Router();
const paymentUserController = require('../controllers/paymentUserController');


router.post('/create_payment_url', paymentUserController.createPaymentUrl);
router.get('/vnpay_return', paymentUserController.vnpayReturn);
router.get('/vnpay_ipn', paymentUserController.vnpay_ipn);

router.post('/refund', paymentUserController.vnpay_refund);

module.exports = router;
