const nodemailer = require('nodemailer');
const { User } = require('../models/user');
const { compileTemplate } = require('./emailTemplates');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (userId, email, subject, templateName, templateData) => {
    try {
        if (userId) {
            var user = await User.findById(userId);
        }
        const html = await compileTemplate(templateName, templateData);

        const mailOptions = {
            from: `"User Generated Content" <${process.env.EMAIL_USER}>`,
            to: email || user?.email,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
