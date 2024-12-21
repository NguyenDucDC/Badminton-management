const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const Authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/update-avt', Authorization.authenToken(), upload.single('image'), profileController.updateAvatar);
router.get('/get-profile', Authorization.authenToken(), profileController.getUser);
router.post('/update-password', Authorization.authenToken(), profileController.updatePassword);
router.post('/update-info', Authorization.authenToken(), profileController.updateInfoUser);

module.exports = router;
