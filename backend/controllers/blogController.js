const Blog = require('../models/Blog');
const { logActivity } = require('../utils/activityLogger');

// Create new blog post
exports.createBlogPost = async (req, res) => {
    try {
        let { title, excerpt, content, author, category, image, readTime } = req.body;

        // Handle file upload
        if (req.file) {
            image = `/uploads/blog/${req.file.filename}`;
        }

        if (!title || !excerpt || !content) {
            return res.status(400).json({ message: 'Title, excerpt, and content are required.' });
        }

        const newPost = await Blog.create({
            title,
            excerpt,
            content,
            author: author || 'Admin',
            category: category || 'INSIGHTS',
            image,
            readTime: readTime || '5 min read'
        });

        res.status(201).json({
            message: 'Blog post created successfully!',
            data: {
                ...newPost.get({ plain: true }),
                date: newPost.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            }
        });

        // Log Activity
        await logActivity(`New blog post "${title}" created`, 'Blog');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Error creating blog post' });
    }
};

// Get all blog posts
exports.getBlogPosts = async (req, res) => {
    try {
        const posts = await Blog.findAll({ order: [['createdAt', 'DESC']] });

        // Map to include formatted date
        const formattedPosts = posts.map(post => ({
            ...post.get({ plain: true }),
            date: post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }));

        res.status(200).json({
            message: 'Blog posts fetched successfully',
            data: formattedPosts
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
};

// Get single blog post
exports.getBlogPostById = async (req, res) => {
    try {
        const post = await Blog.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        res.status(200).json({
            message: 'Blog post details fetched successfully',
            data: {
                ...post.get({ plain: true }),
                date: post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            }
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Error fetching blog post' });
    }
};

// Update blog post
exports.updateBlogPost = async (req, res) => {
    try {
        const post = await Blog.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        let updateData = { ...req.body };

        // Handle new file upload
        if (req.file) {
            updateData.image = `/uploads/blog/${req.file.filename}`;
            // Optional: delete old image if it was a local file
        }

        await post.update(updateData);

        res.status(200).json({
            message: 'Blog post updated successfully!',
            data: {
                ...post.get({ plain: true }),
                date: post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            }
        });

        // Log Activity
        await logActivity(`Blog post "${post.title}" updated`, 'Blog');
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Error updating blog post' });
    }
};

// Delete blog post
exports.deleteBlogPost = async (req, res) => {
    try {
        const post = await Blog.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        const blogTitle = post.title;
        await post.destroy();
        res.status(200).json({ message: 'Blog post deleted successfully' });

        // Log Activity
        await logActivity(`Blog post "${blogTitle}" deleted`, 'Blog');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post' });
    }
};
