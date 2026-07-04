const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('super_admin', 'hr_manager'), getAllEmployees);

router.get('/stats', authorize('super_admin', 'hr_manager'), getEmployeeStats);

router.get('/:id', getEmployeeById);

router.put('/:id', [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email')
], validate, updateEmployee);

router.delete('/:id', authorize('super_admin'), deleteEmployee);

module.exports = router;
