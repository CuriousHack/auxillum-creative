const Visitor = require('../models/Visitor');
const { Op } = require('sequelize');

const countVisitors = async (req, res, next) => {
    try {
        // Get IP address (handle proxy headers if needed, otherwise req.ip)
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Define "today" based on server time
        const today = new Date();

        // Check if this IP has already visited today
        const existingVisit = await Visitor.findOne({
            where: {
                ip: ip,
                visitDate: today
            }
        });

        if (!existingVisit) {
            await Visitor.create({
                ip: ip,
                userAgent: userAgent,
                visitDate: today
            });
            console.log(`New visitor recorded: ${ip}`);
        }

    } catch (error) {
        console.error('Error counting visitor:', error);
        // Do not block the request even if tracking fails
    }

    next();
};

module.exports = countVisitors;
