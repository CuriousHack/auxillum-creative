const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        // predefined categories: EVENT, RADIO, CONTENT, ATL, BTL, etc. but kept as STRING for flexibility
    },
    year: {
        type: DataTypes.STRING, // Using STRING to allow "2023" or ranges like "2022-2023"
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING, // URL to the image
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING, // Optional external link to project
        allowNull: true,
    },
    fileUrl: {
        type: DataTypes.STRING, // Optional uploaded project document
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'projects',
    timestamps: true,
});

module.exports = Project;
