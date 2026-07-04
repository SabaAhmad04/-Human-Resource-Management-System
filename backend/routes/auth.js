const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    refreshToken
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
], validate, register);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.post('/logout', authenticate, logout);

router.get('/me', authenticate, getMe);

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please provide a valid email')
], validate, forgotPassword);

router.put('/reset-password/:token', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, resetPassword);

router.post('/refresh-token', refreshToken);

module.exports = router;
