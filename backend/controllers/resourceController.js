const Resource = require('../models/Resource');
const { logActivity } = require('../utils/activityLogger');
const fs = require('fs');
const path = require('path');

// Update or create a resource by key
exports.upsertResource = async (req, res) => {
    try {
        const { key, name } = req.body;

        if (!key || !name) {
            return res.status(400).json({ message: 'Key and name are required.' });
        }

        if (!req.file && !req.body.path) {
            return res.status(400).json({ message: 'A file or path is required.' });
        }

        const filePath = req.file ? `/uploads/resources/${req.file.filename}` : req.body.path;
        const fileType = req.file ? req.file.mimetype : 'external';

        let resource = await Resource.findOne({ where: { key } });

        if (resource) {
            // Delete old file if it exists and is local
            if (req.file && resource.path.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', resource.path);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            await resource.update({ name, path: filePath, type: fileType });
            res.status(200).json({ message: 'Resource updated successfully!', data: resource });
            await logActivity(`Resource "${name}" (${key}) updated`, 'Resource');
        } else {
            resource = await Resource.create({ key, name, path: filePath, type: fileType });
            res.status(201).json({ message: 'Resource created successfully!', data: resource });
            await logActivity(`Resource "${name}" (${key}) created`, 'Resource');
        }
    } catch (error) {
        console.error('Error upserting resource:', error);
        res.status(500).json({ message: 'Error saving resource' });
    }
};

// Get resource by key
exports.getResourceByKey = async (req, res) => {
    try {
        const resource = await Resource.findOne({ where: { key: req.params.key } });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        res.status(200).json({ data: resource });
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ message: 'Error fetching resource' });
    }
};

// Get all resources (for admin list if needed)
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.status(200).json({ data: resources });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Error fetching resources' });
    }
};
