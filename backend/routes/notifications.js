const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticate);

router.get('/', getMyNotifications);

router.put('/:id/read', markAsRead);

router.put('/read-all', markAllAsRead);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('userId').isInt().withMessage('Valid user ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required')
], validate, createNotification);

module.exports = router;
