const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email server connection error:', error);
    } else {
        console.log('Email server is ready to take our messages');
    }
});

/**
 * Send email using the transporter
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} [replyTo] - Optional Reply-To address
 */
const sendEmail = async (to, subject, html, replyTo = null) => {
    try {
        const mailOptions = {
            from: `"Auxilum Contact Form" <${process.env.EMAIL_USER}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        };

        // Inject replyTo if prominently provided
        if (replyTo) {
            mailOptions.replyTo = replyTo;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
