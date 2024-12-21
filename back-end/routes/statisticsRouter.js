const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const Authorization = require('../middleware/authorization');

// Thống kê chung
router.post('/get-all-facilities-statistics', Authorization.authenToken(), statisticsController.getAllFacilitiesStatistics);
router.post('/get-income-statistics', Authorization.authenToken(), statisticsController.getIncomeStatistics);
router.post('/get-all-sales-statistics', Authorization.authenToken(), statisticsController.getAllSalesStatistics);
router.post('/get-customer-statistics/:id', Authorization.authenToken(), statisticsController.getCustomerStatistics);

// Thống kê chi tiết
router.post('/get-detail-facilities-statistics', Authorization.authenToken(), statisticsController.getDetailFacilitiesStatistics);
router.post('/get-detail-income-statistics', Authorization.authenToken(), statisticsController.getDetailIncomeStatistics);
router.post('/get-detail-sales-statistics', Authorization.authenToken(), statisticsController.getDetailSalesStatistics);
router.post('/get-detail-customer-statistics/:id', Authorization.authenToken(), statisticsController.getDetailCustomerStatistics);

module.exports = router;
