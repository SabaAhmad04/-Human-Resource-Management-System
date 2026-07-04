const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    getLeaveBalance
} = require('../controllers/leaveController');

const router = express.Router();

router.use(authenticate);

router.post('/', [
    body('type').isIn(['sick', 'casual', 'paid', 'maternity', 'paternity', 'unpaid'])
        .withMessage('Invalid leave type'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('reason').notEmpty().withMessage('Reason is required')
], validate, applyLeave);

router.get('/my', getMyLeaves);

router.get('/all', authorize('super_admin', 'hr_manager'), getAllLeaves);

router.put('/:id/approve', authorize('super_admin', 'hr_manager'), approveLeave);

router.put('/:id/reject', authorize('super_admin', 'hr_manager'), [
    body('reason').optional().notEmpty()
], validate, rejectLeave);

router.get('/balance', getLeaveBalance);

module.exports = router;
