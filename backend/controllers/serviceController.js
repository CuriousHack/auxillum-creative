const Service = require('../models/Service');
const { logActivity } = require('../utils/activityLogger');

// Create new service
exports.createService = async (req, res) => {
    try {
        const { icon, title, subtitle, description, features } = req.body;
        if (!icon || !title || !subtitle || !description) {
            return res.status(400).json({ message: 'Icon, title, subtitle, and description are required.' });
        }
        const newService = await Service.create({ icon, title, subtitle, description, features });
        res.status(201).json({
            message: 'Service created successfully!',
            data: newService
        });

        // Log Activity
        await logActivity(`New service "${title}" added`, 'Service');
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Error creating service' });
    }
};

// Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.findAll({ order: [['createdAt', 'ASC']] });
        res.status(200).json({
            message: 'Services fetched successfully',
            data: services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
};

// Get single service
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        res.status(200).json({
            message: 'Service details fetched successfully',
            data: service
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Error fetching service' });
    }
};

// Update service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        await service.update(req.body);
        res.status(200).json({
            message: 'Service updated successfully!',
            data: service
        });

        // Log Activity
        await logActivity(`Service "${service.title}" updated`, 'Service');
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
};

// Delete service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        const serviceTitle = service.title;
        await service.destroy();
        res.status(200).json({ message: 'Service deleted successfully' });

        // Log Activity
        await logActivity(`Service "${serviceTitle}" deleted`, 'Service');
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error deleting service' });
    }
};
