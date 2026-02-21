const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/project');
const serviceRoutes = require('./routes/service');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const countVisitors = require('./middleware/countVisitors');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically
app.use(countVisitors); // Count visitors globally

// Routes

app.use('/api/contacts', contactRoutes); // Mounts to /api/contacts
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', (req, res) => {
    res.json({ message: 'Welcome to the Auxilum Creative Media API' });
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (alter: true to update tables without dropping data)
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
