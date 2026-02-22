const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, username, email } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
            role: role || 'editor'
        });

        res.status(201).json({
            message: 'User created successfully',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'role', 'profileImage'],
            order: [['createdAt', 'DESC']]
        });
        res.json({
            message: 'Users fetched successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
