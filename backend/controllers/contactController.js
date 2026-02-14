const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');
const { getAdminNotificationTemplate, getUserAutoReplyTemplate } = require('../utils/emailTemplates');
const dotenv = require('dotenv');

dotenv.config();

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        // 1. Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        // 2. Save to Database
        const newContact = await Contact.create({
            name,
            email,
            phone,
            service,
            message,
        });

        // 3. Send Emails (Async - don't block response if possible, but for reliability we wait or catch errors)
        // Admin Notification
        const adminHtml = getAdminNotificationTemplate({ name, email, phone, service, message });
        const adminEmailPromise = sendEmail(
            process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Fallback to sender if admin not set
            `New Contact: ${name} - ${service || 'Inquiry'}`,
            adminHtml
        );

        // User Auto-Reply
        const userHtml = getUserAutoReplyTemplate(name);
        const userEmailPromise = sendEmail(
            email,
            'We received your message - Auxilum Creative Media',
            userHtml
        );

        await Promise.allSettled([adminEmailPromise, userEmailPromise]);

        return res.status(201).json({
            message: 'Thank you! Your message has been sent successfully.',
            data: newContact,
        });

    } catch (error) {
        console.error('Error in submitContactForm:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};
