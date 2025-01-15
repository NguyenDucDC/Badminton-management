const express = require('express');
const router = express.Router();
const authUserController = require('../controllers/authUserController');

router.post('/register', authUserController.register);
router.post('/login', authUserController.login);
router.post('/check-account', authUserController.checkAccount);
router.post('/change-password', authUserController.changePassword);

module.exports = router;