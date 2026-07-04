const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const {
    getAdminDashboard,
    getHRDashboard,
    getEmployeeDashboard
} = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);

router.get('/admin', authorize('super_admin'), getAdminDashboard);

router.get('/hr', authorize('super_admin', 'hr_manager'), getHRDashboard);

router.get('/employee', getEmployeeDashboard);

module.exports = router;
