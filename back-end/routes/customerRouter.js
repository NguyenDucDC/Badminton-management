const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const Authorization = require('../middleware/authorization');

router.get('/get-all-customer', Authorization.authenToken(), customerController.getAllCustomer);
router.get('/get-customer/:id', Authorization.authenToken(), customerController.getCustomer);
router.get('/get-list-customer-manager', Authorization.authenToken(), customerController.getListCustomer_manager);
router.post('/get-filter-customer', Authorization.authenToken(), customerController.getFilterCustomer);

// search customer
router.post('/get-customer-by-phone', Authorization.authenToken(), customerController.getCustomerByPhone);
router.post('/find-customer', Authorization.authenToken(), customerController.findCustomer);

router.put('/delete-customer/:id', Authorization.authenToken(), customerController.deleteCustomer);

module.exports = router;
