const express = require('express');
const router = express.Router();
const managerController = require('../controllers//managerController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-manager', Authorization.authenToken(), managerController.createManager);
router.put('/update-manager/:id', Authorization.authenToken(), managerController.updateManager);
router.get('/get-manager', Authorization.authenToken(), managerController.getManager);
router.get('/get-detail-manager/:id', Authorization.authenToken(), managerController.getDetailManager);
router.put('/reset-password-manager/:id', Authorization.authenToken(), managerController.resetPassword);
router.put('/update-avatar-manager/:id', Authorization.authenToken(), upload.single('image'), managerController.updateAvatar);

module.exports = router;
