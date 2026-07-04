const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('super_admin', 'hr_manager'), [
    body('name').notEmpty().withMessage('Department name is required')
], validate, createDepartment);

router.get('/', getAllDepartments);

router.get('/:id', getDepartmentById);

router.put('/:id', authorize('super_admin', 'hr_manager'), updateDepartment);

router.delete('/:id', authorize('super_admin'), deleteDepartment);

module.exports = router;
