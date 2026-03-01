const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const upload = require('../middleware/uploadSettings');

// All routes (No Auth for now per request)
router.get('/', settingController.getSettings);
router.put('/', upload.any(), settingController.updateSettings);

module.exports = router;
