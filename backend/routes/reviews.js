const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// All routes (No Auth for now per request)
router.get('/', reviewController.getReviews);
router.get('/approved', reviewController.getApprovedReviews);
router.post('/', reviewController.submitReview);
router.put('/:id/status', reviewController.updateReviewStatus);

module.exports = router;
