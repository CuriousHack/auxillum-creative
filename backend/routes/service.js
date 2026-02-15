const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// All routes (No Auth for now per request)
router.get('/', serviceController.getServices);
router.post('/', serviceController.createService);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
