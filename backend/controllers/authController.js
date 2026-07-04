const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [userResult] = await pool.execute(
            'INSERT INTO users (email, password, role, isVerified) VALUES (?, ?, ?, TRUE)',
            [email, hashedPassword, role || 'employee']
        );

        const userId = userResult.insertId;

        const employeeId = 'EMP' + String(userId).padStart(5, '0');

        await pool.execute(
            'INSERT INTO profiles (userId, firstName, lastName, phone, employeeId, joinDate) VALUES (?, ?, ?, ?, ?, CURDATE())',
            [userId, firstName, lastName, phone || null, employeeId]
        );

        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        await pool.execute('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, userId]);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: userId,
                email,
                role: role || 'employee'
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await pool.execute('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, user.id]);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const logout = async (req, res) => {
    try {
        await pool.execute('UPDATE users SET refreshToken = NULL WHERE id = ?', [req.user.id]);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await pool.execute(
            `SELECT u.id, u.email, u.role, u.isVerified, u.createdAt,
                    p.firstName, p.lastName, p.phone, p.avatar, p.dateOfBirth,
                    p.gender, p.nationality, p.maritalStatus, p.address,
                    p.departmentId, p.designation, p.managerId, p.joinDate,
                    p.employeeId, p.bankAccountNumber, p.bankName, p.ifscCode,
                    d.name as departmentName
             FROM users u
             LEFT JOIN profiles p ON u.id = p.userId
             LEFT JOIN departments d ON p.departmentId = d.id
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: users[0] });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'No user found with this email' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await pool.execute(
            'UPDATE users SET refreshToken = ? WHERE id = ?',
            [JSON.stringify({ resetToken, resetPasswordExpire }), users[0].id]
        );

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const html = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await sendEmail({
            email,
            subject: 'HRMS Password Reset',
            html
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('ForgotPassword error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const [users] = await pool.execute('SELECT id, refreshToken FROM users WHERE id IS NOT NULL');

        let validUser = null;
        for (const user of users) {
            try {
                const tokenData = JSON.parse(user.refreshToken);
                if (tokenData.resetToken === token && tokenData.resetPasswordExpire > Date.now()) {
                    validUser = user;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!validUser) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.execute('UPDATE users SET password = ?, refreshToken = NULL WHERE id = ?', [hashedPassword, validUser.id]);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('ResetPassword error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const [users] = await pool.execute('SELECT id FROM users WHERE refreshToken = ?', [token]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = generateAccessToken(decoded.id);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('RefreshToken error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    refreshToken
};
