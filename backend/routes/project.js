const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/uploadProject');

// All routes (No Auth for now per request)
router.get('/', projectController.getProjects);
router.post('/', upload.single('image'), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', upload.single('image'), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
