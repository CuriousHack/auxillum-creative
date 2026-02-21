const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Submit form (Public)
router.post('/', contactController.submitContactForm);

// Admin Routes (No Auth for now per request)
router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

// Message operations
router.put('/:id/read', contactController.markAsRead);
router.put('/:id/unread', contactController.markAsUnread);
router.post('/:id/reply', contactController.replyToContact);

module.exports = router;
