const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    getAttendanceStats
} = require('../controllers/attendanceController');

const router = express.Router();

router.use(authenticate);

router.post('/check-in', checkIn);

router.post('/check-out', checkOut);

router.get('/my', getMyAttendance);

router.get('/all', authorize('super_admin', 'hr_manager'), getAllAttendance);

router.get('/stats', authorize('super_admin', 'hr_manager'), getAttendanceStats);

module.exports = router;
