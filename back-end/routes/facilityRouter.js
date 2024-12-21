const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-facility', Authorization.authenToken(), upload.single('image'), facilityController.createFacility);

router.get('/get-facility', Authorization.authenToken(), facilityController.getFacility);
router.get('/get-facility-empty', Authorization.authenToken(), facilityController.getFacilityEmpty);
router.get('/get-facility-available/:id', Authorization.authenToken(), facilityController.getFacilityAvailable);
router.get('/get-detail-facility/:id', Authorization.authenToken(), facilityController.getDetailFacility);
router.get('/get-price-facility/:id', Authorization.authenToken(), facilityController.getPriceFacility);
router.get('/get-images-facility/:id', Authorization.authenToken(), facilityController.getImageFacility);
router.get('/get-list-lock-facility', Authorization.authenToken(), facilityController.getListLockFacility);
router.get('/get-detail-lock-facility/:id', Authorization.authenToken(), facilityController.getDetailLockFacility);

router.put('/update-facility/:id', Authorization.authenToken(), upload.single('image'), facilityController.updateFacility);
router.put('/update-personnel-facility/:id', Authorization.authenToken(), facilityController.updatePersonnelFacility);
router.put('/update-status-facility/:id', Authorization.authenToken(), facilityController.updateStatusFacility);
router.put('/update-price-facility/:id', Authorization.authenToken(), facilityController.updatePriceFacility);
router.put('/update-lock-facility/:id', Authorization.authenToken(), facilityController.updateLockFacility);

router.post('/upload-images-facility/:id', Authorization.authenToken(), upload.array('images', 20), facilityController.uploadImageFacility);
router.post('/add-lock-facility', Authorization.authenToken(), facilityController.lockFacility);

// delete
router.put('/delete-image-facility', Authorization.authenToken(), facilityController.deleteImageFacility);

module.exports = router;
