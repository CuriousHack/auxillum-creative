const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    icon: {
        type: DataTypes.STRING, // Store icon name (e.g., 'Tv', 'Users') to be rendered by Lucide on frontend
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    features: {
        type: DataTypes.JSON, // Store features as a JSON array of strings
        allowNull: false,
        defaultValue: [],
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'services',
    timestamps: true,
});

module.exports = Service;
