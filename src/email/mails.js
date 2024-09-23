const { sendEmail } = require('./sendEmail');

const sendAccountVerificationEmail = (email, otp, name) => {
    sendEmail(null, email, 'Account Verification', 'otpTemplate', { name, otp });
};

const sendResetOTPEmail = (email, otp, name) => {
    sendEmail(null, email, 'Request Reset password OTP', 'otpTemplate', { name, otp });
};

const sendOfferEmail = (offer, bussinessOwner, creator) => {
    let emailData = {
        senderName: bussinessOwner?.firstName,
        receiverName: creator?.firstName,
        description: offer?.description,
        amount: offer?.amount
    };
    sendEmail(null, creator?.email, `New Offer from ${bussinessOwner?.firstName}`, 'sendOfferTemplate', emailData);
};

module.exports = { sendAccountVerificationEmail, sendResetOTPEmail, sendOfferEmail };
