// utils/sendEmail.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // store securely in .env

const sendEmail = async ({ to, subject, text, html }) => {
    const msg = {
        to,
        from: 'parthrkakadiya@gmail.com', // must be verified in SendGrid
        subject,
        text,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Email failed', error.response?.body || error);
    }
};

module.exports = sendEmail;
