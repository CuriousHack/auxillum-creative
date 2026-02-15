const Project = require('../models/Project');

// Create new project
exports.createProject = async (req, res) => {
    try {
        const { title, category, year, image, link } = req.body;
        if (!title || !category || !year || !image) {
            return res.status(400).json({ message: 'Title, category, year, and image are required.' });
        }
        const newProject = await Project.create({ title, category, year, image, link });
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
};

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(projects);
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
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
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
        await project.update(req.body);
        res.status(200).json(project);
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
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};
