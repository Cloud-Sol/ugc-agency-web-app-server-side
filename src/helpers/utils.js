const generateOTP = () => {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        const randVal = Math.round(Math.random() * 9);
        otp = otp + randVal;
    }
    return otp;
};

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { generateOTP, ErrorHandler };
