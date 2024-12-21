const express = require('express');
const router = express.Router();
const facilityUserController = require('../controllers/facilityUserController');

router.get('/get-all-facility', facilityUserController.getAllFacility);
router.get('/get-detail-facility/:id', facilityUserController.getDetailFacility);
router.get('/get-price-facility/:id', facilityUserController.getPriceFacility);
router.get('/get-images-facility/:id', facilityUserController.getImageFacility);

module.exports = router;