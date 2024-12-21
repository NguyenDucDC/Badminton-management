const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/get-user/:id', Authorization.authenToken(), userController.getUser);

router.put('/update-avt', Authorization.authenToken(), upload.single('image'), userController.updateAvatar);
router.put('/update-info', Authorization.authenToken(), userController.updateUserInfo);
router.put('/change-password', Authorization.authenToken(), userController.changePassword);

module.exports = router;
