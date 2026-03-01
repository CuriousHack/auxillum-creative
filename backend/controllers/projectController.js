const Project = require('../models/Project');
const { logActivity } = require('../utils/activityLogger');

// Create new project
exports.createProject = async (req, res) => {
    try {
        let { title, category, year, image, link } = req.body;
        let fileUrl = null;

        // Handle file uploads
        if (req.files) {
            if (req.files['image']) {
                image = `/uploads/projects/${req.files['image'][0].filename}`;
            }
            if (req.files['projectDocument']) {
                fileUrl = `/uploads/projects/${req.files['projectDocument'][0].filename}`;
            }
        }

        if (!title || !category || !year || !image) {
            console.log('Project creation failed validation. req.body:', req.body);
            console.log('req.files:', req.files);
            return res.status(400).json({
                message: 'Title, category, year, and image are required.',
                received: { title, category, year, image: image ? 'Present' : 'Missing' }
            });
        }
        const newProject = await Project.create({ title, category, year, image, link, fileUrl });
        res.status(201).json({
            message: 'Project created successfully!',
            data: newProject
        });

        // Log Activity
        await logActivity(`New project "${title}" added`, 'Project');
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
};

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({
            message: 'Projects fetched successfully',
            data: projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

// Get single project
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json({
            message: 'Project details fetched successfully',
            data: project
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project' });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        let updateData = { ...req.body };

        // Handle new file uploads
        if (req.files) {
            if (req.files['image']) {
                updateData.image = `/uploads/projects/${req.files['image'][0].filename}`;
                // TODO: Optionally delete old image file here
            }
            if (req.files['projectDocument']) {
                updateData.fileUrl = `/uploads/projects/${req.files['projectDocument'][0].filename}`;
                updateData.link = null; // Clear link if attaching file, according to frontend logic
            }
        }

        await project.update(updateData);
        res.status(200).json({
            message: 'Project updated successfully!',
            data: project
        });

        // Log Activity
        await logActivity(`Project "${project.title}" updated`, 'Project');
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const projectTitle = project.title; // Keep for logging
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });

        // Log Activity
        await logActivity(`Project "${projectTitle}" deleted`, 'Project');
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};
