const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createReview,
    getMyReviews,
    getAllReviews,
    updateReview
} = require('../controllers/performanceController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('userId').isInt().withMessage('Valid user ID is required'),
    body('period').notEmpty().withMessage('Period is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], validate, createReview);

router.get('/my', getMyReviews);

router.get('/all', authorize('super_admin', 'hr_manager'), getAllReviews);

router.put('/:id', authorize('super_admin', 'hr_manager'), [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], validate, updateReview);

module.exports = router;
