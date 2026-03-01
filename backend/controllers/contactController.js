const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');
const { getAdminNotificationTemplate, getUserAutoReplyTemplate } = require('../utils/emailTemplates');
const dotenv = require('dotenv');
const { logActivity } = require('../utils/activityLogger');

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

        // 2.5 Fetch Site Setting for Logo
        const Setting = require('../models/Setting');
        const setting = await Setting.findOne();
        const logoUrl = setting?.logo?.url || null;

        // 3. Send Emails (Async - don't block response if possible, but for reliability we wait or catch errors)
        // Admin Notification
        const adminHtml = getAdminNotificationTemplate({ name, email, phone, service, message }, logoUrl);
        const adminEmailPromise = sendEmail(
            process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Fallback to sender if admin not set
            `New Contact: ${name} - ${service || 'Inquiry'}`,
            adminHtml,
            email // Setting visitor's email as replyTo
        );

        // User Auto-Reply
        const userHtml = getUserAutoReplyTemplate(name, logoUrl);
        const userEmailPromise = sendEmail(
            email,
            'We received your message - Auxilum Creative Media',
            userHtml
        );

        // Await concurrently and specifically evaluate rejections instead of silently suppressing errors
        const results = await Promise.allSettled([adminEmailPromise, userEmailPromise]);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const type = index === 0 ? 'Admin Notification' : 'User Auto-Reply';
                console.error(`[Email Delivery Failure] ${type} failed to send:`, result.reason);
            }
        });

        // Log Activity
        await logActivity(`New contact message from "${name}"`, 'Contact');

        return res.status(201).json({
            message: 'Your message has been sent successfully!',
            data: newContact,
        });

    } catch (error) {
        console.error('Error in submitContactForm:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

// Get all contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({
            message: 'Contacts fetched successfully',
            data: contacts
        });
    } catch (error) {
        console.log('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// Get single contact
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        res.status(200).json({
            message: 'Contact details fetched successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact' });
    }
};

// Update contact (e.g. mark as read)
exports.updateContact = async (req, res) => {
    try {
        const { isRead } = req.body;
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        if (isRead !== undefined) contact.isRead = isRead;

        await contact.save();
        res.status(200).json({
            message: 'Contact updated successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact' });
    }
};

// Mark as read
exports.markAsRead = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        contact.isRead = true;
        await contact.save();
        res.status(200).json({ message: 'Marked as read' });

        // Log Activity
        await logActivity(`Message from "${contact.name}" marked as read`, 'Contact');
    } catch (error) {
        console.error('Error marking as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark as unread
exports.markAsUnread = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        contact.isRead = false;
        await contact.save();
        res.status(200).json({ message: 'Marked as unread' });

        // Log Activity
        await logActivity(`Message from "${contact.name}" marked as unread`, 'Contact');
    } catch (error) {
        console.error('Error marking as unread:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reply to contact
exports.replyToContact = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        // Send email
        await sendEmail(
            contact.email,
            subject,
            `<p>${message.replace(/\n/g, '<br>')}</p>`,
            process.env.ADMIN_EMAIL || process.env.EMAIL_USER
        );

        // Log reply
        const newReply = {
            date: new Date(),
            subject,
            message
        };

        // Append to existing replies (handle if null/undefined for legacy records)
        const currentReplies = contact.replies || [];
        contact.replies = [...currentReplies, newReply];

        await contact.save();
        res.status(200).json({ message: 'Reply sent successfully!' });

        // Log Activity
        await logActivity(`Replied to "${contact.name}" (${contact.email})`, 'Contact');

    } catch (error) {
        console.error('Error replying to contact:', error);
        res.status(500).json({ message: 'Failed to send reply' });
    }
};

// Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await contact.destroy();
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact' });
    }
};
