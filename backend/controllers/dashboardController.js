const { pool } = require('../config/db');

const getAdminDashboard = async (req, res) => {
    try {
        const [totalEmployees] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ?', ['employee']
        );

        const [totalDepartments] = await pool.execute(
            'SELECT COUNT(*) as count FROM departments'
        );

        const [pendingLeaves] = await pool.execute(
            'SELECT COUNT(*) as count FROM leave_requests WHERE status = ?', ['pending']
        );

        const [recentActivity] = await pool.execute(
            `SELECT 'attendance' as type, u.email, a.date as activityDate, a.status as detail
             FROM attendance a JOIN users u ON a.userId = u.id
             WHERE a.date = CURDATE()
             UNION ALL
             SELECT 'leave' as type, u.email, lr.createdAt as activityDate, lr.status as detail
             FROM leave_requests lr JOIN users u ON lr.userId = u.id
             WHERE DATE(lr.createdAt) = CURDATE()
             ORDER BY activityDate DESC
             LIMIT 10`
        );

        const [departmentStats] = await pool.execute(
            `SELECT d.name, COUNT(p.id) as employeeCount
             FROM departments d
             LEFT JOIN profiles p ON d.id = p.departmentId
             GROUP BY d.id, d.name`
        );

        const [attendanceToday] = await pool.execute(
            `SELECT
                SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
             FROM attendance WHERE date = CURDATE()`
        );

        res.status(200).json({
            totalEmployees: totalEmployees[0].count,
            totalDepartments: totalDepartments[0].count,
            pendingLeaves: pendingLeaves[0].count,
            recentActivity,
            departmentStats,
            attendanceToday: attendanceToday[0]
        });
    } catch (error) {
        console.error('GetAdminDashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getHRDashboard = async (req, res) => {
    try {
        const [employeeCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ?', ['employee']
        );

        const [attendanceToday] = await pool.execute(
            `SELECT COUNT(DISTINCT userId) as present
             FROM attendance
             WHERE date = CURDATE() AND status IN ('present', 'late')`
        );

        const [pendingLeaves] = await pool.execute(
            `SELECT lr.*, u.email, p.firstName, p.lastName
             FROM leave_requests lr
             JOIN users u ON lr.userId = u.id
             LEFT JOIN profiles p ON u.id = p.userId
             WHERE lr.status = 'pending'
             ORDER BY lr.createdAt DESC
             LIMIT 5`
        );

        const [payrollStatus] = await pool.execute(
            `SELECT
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as processed,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid
             FROM payroll
             WHERE month = MONTH(CURDATE()) AND year = YEAR(CURDATE())`
        );

        const [upcomingLeaves] = await pool.execute(
            `SELECT lr.*, u.email, p.firstName, p.lastName
             FROM leave_requests lr
             JOIN users u ON lr.userId = u.id
             LEFT JOIN profiles p ON u.id = p.userId
             WHERE lr.status = 'approved' AND lr.startDate >= CURDATE()
             ORDER BY lr.startDate ASC
             LIMIT 5`
        );

        res.status(200).json({
            employeeCount: employeeCount[0].count,
            attendanceToday: attendanceToday[0].present,
            pendingLeaves,
            payrollStatus: payrollStatus[0],
            upcomingLeaves
        });
    } catch (error) {
        console.error('GetHRDashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const [todayAttendance] = await pool.execute(
            'SELECT * FROM attendance WHERE userId = ? AND date = CURDATE()',
            [userId]
        );

        const [myLeaves] = await pool.execute(
            `SELECT
                SUM(CASE WHEN status = 'approved' THEN DATEDIFF(endDate, startDate) + 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
             FROM leave_requests
             WHERE userId = ? AND YEAR(startDate) = YEAR(CURDATE())`,
            [userId]
        );

        const [upcomingHolidays] = await pool.execute(
            'SELECT * FROM holidays WHERE date >= CURDATE() ORDER BY date ASC LIMIT 5'
        );

        const [recentNotifications] = await pool.execute(
            'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 5',
            [userId]
        );

        const [unreadNotifications] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = FALSE',
            [userId]
        );

        const [recentPayslips] = await pool.execute(
            'SELECT * FROM payroll WHERE userId = ? ORDER BY year DESC, month DESC LIMIT 3',
            [userId]
        );

        res.status(200).json({
            todayAttendance: todayAttendance[0] || null,
            leaveSummary: myLeaves[0],
            upcomingHolidays,
            recentNotifications,
            unreadNotifications: unreadNotifications[0].count,
            recentPayslips
        });
    } catch (error) {
        console.error('GetEmployeeDashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAdminDashboard,
    getHRDashboard,
    getEmployeeDashboard
};
