const Review = require('../models/Review');
const { logActivity } = require('../utils/activityLogger');

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order: [['date', 'DESC']]
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
};

exports.getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { status: 'approved' },
            order: [['date', 'DESC']]
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        res.status(500).json({ message: 'Server error while fetching approved reviews' });
    }
};

exports.submitReview = async (req, res) => {
    try {
        const { name, company, role, rating, comment } = req.body;

        if (!name || !rating || !comment) {
            return res.status(400).json({ message: 'Name, rating, and comment are required' });
        }

        const newReview = await Review.create({
            name,
            company,
            role,
            rating,
            comment,
            status: 'pending',
            date: new Date()
        });

        // Log Activity
        await logActivity(`New review submitted by \"${name}\" for ${company || 'Unknown Company'}`, 'Review');

        res.status(201).json({ message: 'Review submitted successfully', data: newReview });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Server error while submitting review' });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.status = status;
        await review.save();

        // Log Activity
        await logActivity(`Review from \"${review.name}\" status updated to ${status}`, 'Review');

        res.status(200).json({ message: `Review status updated to ${status}`, data: review });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ message: 'Server error while updating review status' });
    }
};
