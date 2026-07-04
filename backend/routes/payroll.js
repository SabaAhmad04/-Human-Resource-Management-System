const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    generatePayroll,
    getMyPayslips,
    getAllPayrolls,
    updatePayroll,
    processPayroll
} = require('../controllers/payrollController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('userId').isInt().withMessage('Valid user ID is required'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
    body('year').isInt().withMessage('Valid year is required'),
    body('basicSalary').isNumeric().withMessage('Basic salary must be a number')
], validate, generatePayroll);

router.get('/my', getMyPayslips);

router.get('/all', authorize('super_admin', 'hr_manager'), getAllPayrolls);

router.put('/:id', authorize('super_admin', 'hr_manager'), updatePayroll);

router.post('/process', authorize('super_admin', 'hr_manager'), [
    body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
    body('year').isInt().withMessage('Valid year is required')
], validate, processPayroll);

module.exports = router;
