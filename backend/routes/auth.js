const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/setup-initial-admin', authController.setupInitialAdmin);

router.put('/profile', protect, userController.updateProfile);
router.post('/change-password', protect, authController.changePassword);
router.post('/verify-change-password', protect, authController.verifyChangePassword);

module.exports = router;
