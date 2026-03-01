const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const { getOTPTemplate } = require('../utils/emailTemplates');
const { Op } = require('sequelize');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d',
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user && (await user.comparePassword(password))) {
            res.json({
                message: 'Login successful',
                data: {
                    token: generateToken(user.id),
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        profileImage: user.profileImage
                    }
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        user.otpType = 'reset';
        // Retrieve logo for OTP template
        const Setting = require('../models/Setting');
        const setting = await Setting.findOne();
        const logoUrl = setting?.logo?.url || null;

        const emailHtml = getOTPTemplate(otp, logoUrl);
        await sendEmail(user.email, 'Password Reset OTP - Auxilium Tech', emailHtml);

        res.json({ message: 'Security code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            where: {
                email,
                otpCode: otp,
                otpType: 'reset',
                otpExpiry: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired security code' });
        }

        res.json({ message: 'Code verified. You can now reset your password' });
    } catch (error) {
        res.status(500).json({ message: 'Verification error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({
            where: {
                email,
                otpCode: otp,
                otpType: 'reset',
                otpExpiry: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Action expired. Please start over' });
        }

        user.password = newPassword;
        user.otpCode = null;
        user.otpExpiry = null;
        user.otpType = null;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const otp = generateOTP();
        const bcrypt = require('bcryptjs');
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.otpCode = otp;
        user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        user.otpType = 'change';
        user.pendingPassword = hashedNewPassword;
        await user.save();

        await sendEmail(user.email, 'Security Code - Password Change', getOTPTemplate(otp));


        res.json({ message: 'Verification code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error initiating password change' });
    }
};

exports.verifyChangePassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body; // Frontend should send newPassword again or we store it
        const user = await User.findOne({
            where: {
                id: req.user.id,
                otpCode: otp,
                otpType: 'change',
                otpExpiry: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.password = user.pendingPassword;
        user.otpCode = null;
        user.otpType = null;
        user.otpExpiry = null;
        user.pendingPassword = null;

        await user.save();
        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error verifying change' });
    }
};

exports.setupInitialAdmin = async (req, res) => {
    try {
        const { secret, firstName, lastName, username, email, password } = req.body;
        if (secret !== 'AUXILIUM_SECRET_2026') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const existingAdmin = await User.findOne({ where: { role: 'admin' } });
        if (existingAdmin && req.body.force !== true) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
            role: 'admin'
        });

        // Return a clean object, not the full Sequelize instance to avoid circular refs or weird stuff
        const responseData = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        };

        res.status(201).json({ message: 'Initial admin created successfully', data: responseData });
    } catch (error) {
        console.error('Setup Initial Admin Error:', error);
        res.status(500).json({ message: 'Error creating admin', details: error.message });
    }
};

