const { pool } = require('../config/db');

const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, departmentId, userId, export: exportData } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        let query = `
            SELECT a.*, u.email, p.firstName, p.lastName, d.name as departmentName
            FROM attendance a
            JOIN users u ON a.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            LEFT JOIN departments d ON p.departmentId = d.id
            WHERE a.date BETWEEN ? AND ?
        `;
        const params = [startDate, endDate];

        if (departmentId) {
            query += ' AND p.departmentId = ?';
            params.push(departmentId);
        }

        if (userId) {
            query += ' AND a.userId = ?';
            params.push(userId);
        }

        query += ' ORDER BY a.date DESC, p.firstName ASC';

        const [records] = await pool.execute(query, params);

        const [summary] = await pool.execute(
            `SELECT
                status,
                COUNT(*) as count
             FROM attendance
             WHERE date BETWEEN ? AND ?
             GROUP BY status`,
            [startDate, endDate]
        );

        const [totalWorkingHours] = await pool.execute(
            `SELECT
                userId,
                SUM(workHours) as totalHours,
                AVG(workHours) as avgHours
             FROM attendance
             WHERE date BETWEEN ? AND ?
             GROUP BY userId`,
            [startDate, endDate]
        );

        res.status(200).json({
            records,
            summary,
            totalWorkingHours,
            dateRange: { startDate, endDate },
            totalRecords: records.length
        });
    } catch (error) {
        console.error('GetAttendanceReport error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getPayrollReport = async (req, res) => {
    try {
        const { month, year, departmentId } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        let query = `
            SELECT p.*, u.email, prof.firstName, prof.lastName, d.name as departmentName
            FROM payroll p
            JOIN users u ON p.userId = u.id
            LEFT JOIN profiles prof ON u.id = prof.userId
            LEFT JOIN departments d ON prof.departmentId = d.id
            WHERE p.month = ? AND p.year = ?
        `;
        const params = [month, year];

        if (departmentId) {
            query += ' AND prof.departmentId = ?';
            params.push(departmentId);
        }

        query += ' ORDER BY prof.firstName ASC';

        const [records] = await pool.execute(query, params);

        const [totals] = await pool.execute(
            `SELECT
                COUNT(*) as totalEmployees,
                SUM(basicSalary) as totalBasic,
                SUM(hra) as totalHRA,
                SUM(performanceBonus) as totalBonus,
                SUM(standardAllowance) as totalAllowance,
                SUM(lta) as totalLTA,
                SUM(deductions) as totalDeductions,
                SUM(netSalary) as totalNetSalary
             FROM payroll
             WHERE month = ? AND year = ?`,
            [month, year]
        );

        const [statusBreakdown] = await pool.execute(
            `SELECT status, COUNT(*) as count
             FROM payroll
             WHERE month = ? AND year = ?
             GROUP BY status`,
            [month, year]
        );

        res.status(200).json({
            records,
            totals: totals[0],
            statusBreakdown,
            period: { month: parseInt(month), year: parseInt(year) },
            totalRecords: records.length
        });
    } catch (error) {
        console.error('GetPayrollReport error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeReport = async (req, res) => {
    try {
        const { departmentId } = req.query;

        let query = `
            SELECT d.id as departmentId, d.name as departmentName,
                   COUNT(p.id) as employeeCount
            FROM departments d
            LEFT JOIN profiles p ON d.id = p.departmentId
        `;
        const params = [];

        if (departmentId) {
            query += ' WHERE d.id = ?';
            params.push(departmentId);
        }

        query += ' GROUP BY d.id, d.name ORDER BY d.name';

        const [departmentWise] = await pool.execute(query, params);

        const [roleWise] = await pool.execute(
            `SELECT role, COUNT(*) as count FROM users GROUP BY role`
        );

        const [genderWise] = await pool.execute(
            `SELECT gender, COUNT(*) as count FROM profiles WHERE gender IS NOT NULL GROUP BY gender`
        );

        const [recentJoinees] = await pool.execute(
            `SELECT p.firstName, p.lastName, p.joinDate, p.designation, d.name as departmentName
             FROM profiles p
             LEFT JOIN departments d ON p.departmentId = d.id
             ORDER BY p.joinDate DESC
             LIMIT 10`
        );

        const [totalEmployees] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ?', ['employee']
        );

        res.status(200).json({
            totalEmployees: totalEmployees[0].count,
            departmentWise,
            roleWise,
            genderWise,
            recentJoinees
        });
    } catch (error) {
        console.error('GetEmployeeReport error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getLeaveReport = async (req, res) => {
    try {
        const { startDate, endDate, departmentId, type } = req.query;

        let query = `
            SELECT lr.*, u.email, p.firstName, p.lastName, d.name as departmentName
            FROM leave_requests lr
            JOIN users u ON lr.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            LEFT JOIN departments d ON p.departmentId = d.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM leave_requests WHERE 1=1';
        const params = [];
        const countParams = [];

        if (startDate && endDate) {
            query += ' AND lr.startDate >= ? AND lr.endDate <= ?';
            countQuery += ' AND startDate >= ? AND endDate <= ?';
            params.push(startDate, endDate);
            countParams.push(startDate, endDate);
        }

        if (departmentId) {
            query += ' AND p.departmentId = ?';
            params.push(departmentId);
        }

        if (type) {
            query += ' AND lr.type = ?';
            countQuery += ' AND type = ?';
            params.push(type);
            countParams.push(type);
        }

        query += ' ORDER BY lr.startDate DESC';

        const [records] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const [typeWise] = await pool.execute(
            `SELECT type, status, COUNT(*) as count
             FROM leave_requests
             WHERE 1=1 ${type ? 'AND type = ?' : ''}
             GROUP BY type, status`,
            type ? [type] : []
        );

        const [totalDays] = await pool.execute(
            `SELECT type, SUM(DATEDIFF(endDate, startDate) + 1) as totalDays
             FROM leave_requests
             WHERE status = 'approved'
             ${type ? 'AND type = ?' : ''}
             GROUP BY type`,
            type ? [type] : []
        );

        res.status(200).json({
            records,
            totalRecords: countResult[0].total,
            typeWise,
            totalDays
        });
    } catch (error) {
        console.error('GetLeaveReport error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAttendanceReport,
    getPayrollReport,
    getEmployeeReport,
    getLeaveReport
};
