const { body, param, validationResult } = require('express-validator');
const { ErrorHandler } = require('./utils');

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);

    const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(', ');

    if (errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
    body('firstName', 'Please Enter Name').notEmpty(),
    body('email', 'Please Enter Email').notEmpty(),
    body('password', 'Please Enter Password').notEmpty()
];
const otpValidator = () => [body('email', 'Please Enter Email').notEmpty(), body('otp', 'Please Enter OTP').notEmpty()];
const loginValidator = () => [body('email', 'Please Enter Email').notEmpty(), body('password', 'Please Enter Password').notEmpty()];
const resetRequestValidator = () => [body('email', 'Please Enter Email').notEmpty()];
const verifyOTPValidator = () => [
    body('email', 'Please Enter Email').notEmpty(),
    body('otp', 'Please Enter OTP').notEmpty(),
    body('newPassword', 'Please Enter New Password').notEmpty()
];

const newGroupValidator = () => [
    body('name', 'Please Enter Name').notEmpty(),
    body('members').notEmpty().withMessage('Please Enter Members').isArray({ min: 2, max: 100 }).withMessage('Members must be 2-100')
];

const addMemberValidator = () => [
    body('chatId', 'Please Enter Chat ID').notEmpty(),
    body('members').notEmpty().withMessage('Please Enter Members').isArray({ min: 1, max: 97 }).withMessage('Members must be 1-97')
];

const removeMemberValidator = () => [body('chatId', 'Please Enter Chat ID').notEmpty(), body('userId', 'Please Enter User ID').notEmpty()];

const sendAttachmentsValidator = () => [body('chatId', 'Please Enter Chat ID').notEmpty()];

const chatIdValidator = () => [param('id', 'Please Enter Chat ID').notEmpty()];

const renameValidator = () => [param('id', 'Please Enter Chat ID').notEmpty(), body('name', 'Please Enter New Name').notEmpty()];

const sendRequestValidator = () => [body('userId', 'Please Enter User ID').notEmpty()];

const acceptRequestValidator = () => [
    body('requestId', 'Please Enter Request ID').notEmpty(),
    body('accept').notEmpty().withMessage('Please Add Accept').isBoolean().withMessage('Accept must be a boolean')
];

const adminLoginValidator = () => [body('secretKey', 'Please Enter Secret Key').notEmpty()];

module.exports = {
    acceptRequestValidator,
    addMemberValidator,
    adminLoginValidator,
    chatIdValidator,
    loginValidator,
    resetRequestValidator,
    verifyOTPValidator,
    newGroupValidator,
    registerValidator,
    otpValidator,
    removeMemberValidator,
    renameValidator,
    sendAttachmentsValidator,
    sendRequestValidator,
    validateHandler
};
