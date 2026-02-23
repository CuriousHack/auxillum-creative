const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/uploadResource');

// Public route to get a resource
router.get('/:key', resourceController.getResourceByKey);

// Admin routes to manage resources
// router.get('/', protect, adminOnly, resourceController.getAllResources);
// router.post('/', protect, adminOnly, upload.single('file'), resourceController.upsertResource);

router.get('/', resourceController.getAllResources);
router.post('/', upload.single('file'), resourceController.upsertResource);

module.exports = router;
