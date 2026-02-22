const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const uploadBlog = require('../middleware/uploadBlog');

// Admin & Public Routes
router.get('/', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);

// Admin Routes (Supports file upload)
router.post('/', uploadBlog.single('image'), blogController.createBlogPost);
router.put('/:id', uploadBlog.single('image'), blogController.updateBlogPost);
router.delete('/:id', blogController.deleteBlogPost);

module.exports = router;
