const admin = require('../config/firebase');

const sendNotification = async (token, title, message, icon) => {
    const payload = {
        notification: {
            title,
            body: message,
            icon
        },
        token
    };

    try {
        const response = await admin.messaging().send(payload);
        return response;
    } catch (error) {
        console.log('Firebase Notification Error -> ', error);
    }
};

module.exports = {
    sendNotification
};
