const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createHoliday,
    getAllHolidays,
    updateHoliday,
    deleteHoliday
} = require('../controllers/holidayController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('name').notEmpty().withMessage('Holiday name is required'),
    body('date').isISO8601().withMessage('Valid date is required')
], validate, createHoliday);

router.get('/', getAllHolidays);

router.put('/:id', authorize('super_admin', 'hr_manager'), updateHoliday);

router.delete('/:id', authorize('super_admin'), deleteHoliday);

module.exports = router;
