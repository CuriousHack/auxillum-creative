const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mission: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    vision: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    founder: {
        type: DataTypes.JSON, // Use JSON to store the founder object
        allowNull: true,
        defaultValue: {
            name: '',
            role: '',
            about: '',
            image: '',
            features: []
        }
    },
    hero: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            title: '',
            subtitle: '',
            backgroundImage: ''
        }
    },
    aboutImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stats: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    clientRoster: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    logo: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            url: '',
            showDesktop: false,
            showMobile: false
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'settings',
    timestamps: true,
});

module.exports = Setting;
