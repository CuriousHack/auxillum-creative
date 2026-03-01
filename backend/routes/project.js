const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/uploadProject');

// Define upload fields
const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'projectDocument', maxCount: 1 }
]);

// All routes (No Auth for now per request)
router.get('/', projectController.getProjects);
router.post('/', cpUpload, projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', cpUpload, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
