const Activity = require('../models/Activity');

/**
 * Logs an activity to the database
 * @param {string} description - The text description of the activity
 * @param {string} type - Optional type category (e.g. 'Project', 'Message')
 */
const logActivity = async (description, type = 'System') => {
    try {
        await Activity.create({ description, type });
        console.log(`Activity logged: ${description}`);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = { logActivity };
