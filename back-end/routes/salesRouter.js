const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-sales', Authorization.authenToken(), salesController.createSales);
router.get('/get-all-sales', Authorization.authenToken(), salesController.getAllSales);
router.get('/get-sales-facility/:id', Authorization.authenToken(), salesController.getSalesOfFacility);
router.get('/get-detail-sales/:id', Authorization.authenToken(), salesController.getDetailSales);

router.put('/update-sales_manager-admin/:id', Authorization.authenToken(), salesController.updateSales_ManagerAndAdmin);
router.put('/reset-password-sales/:id', Authorization.authenToken(), salesController.resetPassword);
router.put('/update-avatar-sales/:id', Authorization.authenToken(), upload.single('image'), salesController.updateAvatar);

module.exports = router;
