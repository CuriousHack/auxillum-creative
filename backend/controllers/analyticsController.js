const { Op } = require('sequelize');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const Activity = require('../models/Activity');
const sequelize = require('../config/database');

exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Total Projects & New Projects this month
        const totalProjects = await Project.count();
        const newProjectsMonth = await Project.count({
            where: {
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        // 2. Active Services
        const activeServices = await Service.count();

        // 3. New Messages (Unread)
        const newMessages = await Contact.count({
            where: {
                isRead: false
            }
        });

        // 4. Total Visits & Growth
        const totalVisits = await Visitor.count();
        const visitsThisMonth = await Visitor.count({
            where: {
                visitDate: {
                    [Op.gte]: startOfMonth
                }
            }
        });
        const visitsLastMonth = await Visitor.count({
            where: {
                visitDate: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        // Calculate percentage change for visits
        let visitChange = '0% vs last month';
        if (visitsLastMonth > 0) {
            const change = ((visitsThisMonth - visitsLastMonth) / visitsLastMonth) * 100;
            const sign = change >= 0 ? '+' : '';
            visitChange = `${sign}${change.toFixed(0)}% vs last month`;
        } else if (visitsThisMonth > 0) {
            visitChange = '+100% vs last month'; // Infinite growth from 0
        }

        // 5. Recent Activity
        const recentActivities = await Activity.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        // Format activities for frontend
        const formattedActivity = recentActivities.map(activity => ({
            id: activity.id,
            description: activity.description,
            timestamp: activity.createdAt.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        // Construct response object matching frontend expectation
        const stats = {
            totalProjects: totalProjects,
            totalProjectsChange: `+${newProjectsMonth} this month`,

            activeServices: activeServices,
            activeServicesChange: 'All active', // Static for now as requested

            newMessages: newMessages,
            newMessagesChange: `+${newMessages} unread`, // Assuming all unread are "new" context

            totalVisits: totalVisits,
            totalVisitsChange: visitChange,
            recentActivity: formattedActivity
        };

        res.status(200).json({
            message: 'Dashboard statistics fetched successfully',
            data: stats
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
};
