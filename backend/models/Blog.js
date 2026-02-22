const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Admin',
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'INSIGHTS',
    },
    readTime: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '5 min read',
    }
}, {
    timestamps: true,
});

module.exports = Blog;
