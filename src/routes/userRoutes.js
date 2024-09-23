const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const {
    registerValidator,
    validateHandler,
    otpValidator,
    loginValidator,
    resetRequestValidator,
    verifyOTPValidator
} = require('../helpers/validations');
const authMiddleware = require('../middleware/authMiddleware');

const { createUser, verifyAccountOTP, loginUser, requestPasswordReset, verifyOtpAndResetPassword, updateFCMToken } = userController;

// router.get('/', getAllUsers);
router.post('/signup', registerValidator(), validateHandler, createUser);
router.post('/verify-otp', otpValidator(), validateHandler, verifyAccountOTP);
router.post('/signin', loginValidator(), validateHandler, loginUser);
router.post('/request-reset', resetRequestValidator(), validateHandler, requestPasswordReset);
router.post('/reset-password', verifyOTPValidator(), validateHandler, verifyOtpAndResetPassword);

router.use(authMiddleware)
router.put('/update-fcm/:userId', updateFCMToken);

module.exports = router;
