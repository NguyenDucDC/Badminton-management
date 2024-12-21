const express = require('express');
const router = express.Router();
const incomeExpenditureController = require('../controllers/incomeExpenditureController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-income-expenditure', Authorization.authenToken(), upload.array('images', 20), incomeExpenditureController.createIncomeExpenditure);
router.get('/get-list-income-expenditure', Authorization.authenToken(), incomeExpenditureController.getListIncomeExpenditure);
router.get('/get-detail-income-expenditure/:id', Authorization.authenToken(), incomeExpenditureController.getDetailIncomeExpenditure);
router.post('/filter-income-expenditure', Authorization.authenToken(), incomeExpenditureController.filterIncomeExpenditure);

router.post('/update-income-expenditure/:id', Authorization.authenToken(), upload.array('images', 20), incomeExpenditureController.updateIncomeExpenditure);

router.put('/delete-image-contract', Authorization.authenToken(), incomeExpenditureController.deleteImageContract);

module.exports = router;
