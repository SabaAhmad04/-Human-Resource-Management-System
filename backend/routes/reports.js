const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const {
    getAttendanceReport,
    getPayrollReport,
    getEmployeeReport,
    getLeaveReport
} = require('../controllers/reportController');

const router = express.Router();

router.use(authenticate);
router.use(authorize('super_admin', 'hr_manager'));

router.get('/attendance', getAttendanceReport);

router.get('/payroll', getPayrollReport);

router.get('/employees', getEmployeeReport);

router.get('/leaves', getLeaveReport);

module.exports = router;
