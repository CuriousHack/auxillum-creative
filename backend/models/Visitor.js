const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visitor = sequelize.define('Visitor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    visitDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'visitors',
    timestamps: true,
});

module.exports = Visitor;
