// =======================================  Importing Libraries  ================================================
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, ErrorHandler } = require('../helpers/utils');
const jwt = require('jsonwebtoken');
const { VerificationToken } = require('../models/verificationToken');
const { sendAccountVerificationEmail, sendResetOTPEmail } = require('../email/mails');
const { TryCatch } = require('../middleware/error');

// --------------------------- Get All Tenants

const getAll = async (req, res) => {
    try {
        const result = await User.find({ isDeleted: false });

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Create User

const createUser = TryCatch(async (req, res, next) => {
    let { email, password, firstName, lastName, phoneNo, dateOfBirth, role } = req?.body;

    const user = await User.findOne({ email, isDeleted: false });

    if (user) {
        if (user.isVerifiedAccount) {
            return res.status(400).json({ message: 'User already registered and verified' });
        }

        const existingToken = await VerificationToken.findOne({ owner: user._id });
        if (existingToken) {
            sendAccountVerificationEmail(user?.email, existingToken.token, user?.firstName);
            return res.status(200).json({ message: 'OTP sent to email' });
        }
    }

    const insertUser = new User({
        email: email?.toLowerCase()?.trim(),
        username: `${email?.toLowerCase()?.trim()}${Date?.now()}`,
        passwordHash: bcrypt.hashSync(password, 12),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        phoneNo,
        dateOfBirth,
        role,
        photosAllowed: role == 'influencer' ? 10 : role == 'content-creator' ? 4 : 0,
        videosAllowed: role == 'influencer' ? 5 : role == 'content-creator' ? 2 : 0
    });

    const newUser = await insertUser.save();
    if (newUser) {
        // Generate and save OTP
        const otp = generateOTP();
        const token = new VerificationToken({ owner: newUser._id, token: otp });
        await token.save();
        sendAccountVerificationEmail(newUser?.email, otp, newUser?.firstName);
        return res.status(201).json({ success: true, message: 'OTP sent to email' });
    }
});

// --------------------------- Verify OTP

const verifyAccountOTP = TryCatch(async (req, res, next) => {
    let { email, otp } = req?.body;

    const user = await User.findOne({ email: email?.trim()?.toLowerCase(), isDeleted: false });
    if (!user) return next(new ErrorHandler('User not found', 400));

    const tokenEntry = await VerificationToken.findOne({ owner: user._id });
    if (!tokenEntry) return next(new ErrorHandler('OTP not found', 400));

    if (tokenEntry.token !== otp) return next(new ErrorHandler('Invalid OTP', 400));

    if (Date.now() - tokenEntry.dateCreated > 10 * 60 * 1000) {
        // 10 minutes validity
        await VerificationToken.deleteOne({ _id: tokenEntry._id });
        return next(new ErrorHandler('OTP expired', 400));
    }

    user.isVerifiedAccount = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: tokenEntry._id });

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// --------------------------- Login User

const loginUser = TryCatch(async (req, res, next) => {
    let { email, password } = req?.body;

    const user = await User.findOne({ email: email?.trim()?.toLowerCase(), isDeleted: false });
    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    if (user?.isActive == false) return next(new ErrorHandler('Your account has been de-activated', 400));
    if (user?.isVerifiedAccount == false) {
        const otp = generateOTP();
        const token = new VerificationToken({ owner: newUser._id, token: otp });
        await token.save();
        sendAccountVerificationEmail(newUser?.email, otp, newUser?.firstName);
        return next(new ErrorHandler('An OTP has been sended, please verify your account!', 400));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, isVerifiedAccount: user?.isVerifiedAccount }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({ success: true, token, message: 'Login successful' });
});

// --------------------------- Request Password Reset

const requestPasswordReset = TryCatch(async (req, res, next) => {
    let { email } = req?.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Generate OTP
    const otp = generateOTP();
    const token = new VerificationToken({ owner: user._id, token: otp });
    await token.save();
    sendResetOTPEmail(user?.email, otp, user?.firstName);

    res.status(200).json({ success: true, message: 'OTP sent to email' });
});

// --------------------------- Verify OTP and Password Reset

const verifyOtpAndResetPassword = TryCatch(async (req, res, next) => {
    let { email, otp, newPassword } = req?.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const tokenEntry = await VerificationToken.findOne({ owner: user._id });
    if (!tokenEntry) {
        return next(new ErrorHandler('OTP not found', 400));
    }

    if (tokenEntry.token !== otp) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }

    if (Date.now() - tokenEntry.dateCreated > 10 * 60 * 1000) {
        // 10 minutes validity
        await VerificationToken.deleteOne({ _id: tokenEntry._id });
        return next(new ErrorHandler('OTP expired', 400));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    user.passwordHash = hashedPassword;
    await user.save();

    // Remove the OTP token
    await VerificationToken.deleteOne({ _id: tokenEntry._id });

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
});

// --------------------------- Update FCM Token

const updateFCMToken = TryCatch(async (req, res, next) => {
    let { mobileFcmToken, webFcmToken } = req?.body;

    const user = await User.findById(req?.params?.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req?.params?.id,
        {
            mobileFcmToken: mobileFcmToken || null,
            webFcmToken: webFcmToken || null,
            updatedBy: req?.auth?.userId,
            updatedOn: new Date()
        },
        { new: true }
    );

    if(updatedUser){
        res.status(200).json({ success: true, message: 'Token updated successfully!' });
    }
});

module.exports = {
    createUser,
    verifyAccountOTP,
    loginUser,
    requestPasswordReset,
    verifyOtpAndResetPassword,
    updateFCMToken
};
