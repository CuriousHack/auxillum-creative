const Project = require('../models/Project');
const { logActivity } = require('../utils/activityLogger');

// Create new project
exports.createProject = async (req, res) => {
    try {
        let { title, category, year, image, link } = req.body;

        // Handle file upload
        if (req.file) {
            // Assuming server is running on localhost/domain, construct full URL or relative path
            // Here we store the relative path which can be prefixed by frontend
            image = `/uploads/projects/${req.file.filename}`;
        }

        if (!title || !category || !year || !image) {
            return res.status(400).json({ message: 'Title, category, year, and image are required.' });
        }
        const newProject = await Project.create({ title, category, year, image, link });
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

        // Handle new file upload
        if (req.file) {
            updateData.image = `/uploads/projects/${req.file.filename}`;
            // TODO: Optionally delete old image file here
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
