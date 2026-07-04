const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createAnnouncement,
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], validate, createAnnouncement);

router.get('/', getAllAnnouncements);

router.put('/:id', authorize('super_admin', 'hr_manager'), updateAnnouncement);

router.delete('/:id', authorize('super_admin'), deleteAnnouncement);

module.exports = router;
