const { pool } = require('../config/db');

const checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0];

        const [existing] = await pool.execute(
            'SELECT id FROM attendance WHERE userId = ? AND date = ?',
            [userId, today]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const workStart = '09:00:00';
        let status = 'present';
        if (currentTime > workStart) {
            status = 'late';
        }

        const [result] = await pool.execute(
            'INSERT INTO attendance (userId, date, checkIn, status) VALUES (?, ?, ?, ?)',
            [userId, today, currentTime, status]
        );

        res.status(201).json({
            message: 'Checked in successfully',
            attendance: {
                id: result.insertId,
                date: today,
                checkIn: currentTime,
                status
            }
        });
    } catch (error) {
        console.error('CheckIn error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0];

        const [existing] = await pool.execute(
            'SELECT * FROM attendance WHERE userId = ? AND date = ?',
            [userId, today]
        );

        if (existing.length === 0) {
            return res.status(400).json({ message: 'No check-in record found for today' });
        }

        if (existing[0].checkOut) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        const checkInTime = new Date(`2000-01-01T${existing[0].checkIn}`);
        const checkOutTime = new Date(`2000-01-01T${currentTime}`);
        const workHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);

        await pool.execute(
            'UPDATE attendance SET checkOut = ?, workHours = ? WHERE userId = ? AND date = ?',
            [currentTime, workHours, userId, today]
        );

        res.status(200).json({
            message: 'Checked out successfully',
            attendance: {
                checkIn: existing[0].checkIn,
                checkOut: currentTime,
                workHours
            }
        });
    } catch (error) {
        console.error('CheckOut error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate, month, year } = req.query;

        let query = 'SELECT * FROM attendance WHERE userId = ?';
        const params = [userId];

        if (startDate && endDate) {
            query += ' AND date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (month && year) {
            query += ' AND MONTH(date) = ? AND YEAR(date) = ?';
            params.push(month, year);
        }

        query += ' ORDER BY date DESC';

        const [attendance] = await pool.execute(query, params);

        res.status(200).json({ attendance });
    } catch (error) {
        console.error('GetMyAttendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const { date, userId, departmentId, startDate, endDate, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, u.email, p.firstName, p.lastName, d.name as departmentName
            FROM attendance a
            JOIN users u ON a.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            LEFT JOIN departments d ON p.departmentId = d.id
            WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) as total
            FROM attendance a
            JOIN users u ON a.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            WHERE 1=1
        `;
        const params = [];
        const countParams = [];

        if (date) {
            query += ' AND a.date = ?';
            countQuery += ' AND a.date = ?';
            params.push(date);
            countParams.push(date);
        }

        if (userId) {
            query += ' AND a.userId = ?';
            countQuery += ' AND a.userId = ?';
            params.push(userId);
            countParams.push(userId);
        }

        if (departmentId) {
            query += ' AND p.departmentId = ?';
            countQuery += ' AND p.departmentId = ?';
            params.push(departmentId);
            countParams.push(departmentId);
        }

        if (startDate && endDate) {
            query += ' AND a.date BETWEEN ? AND ?';
            countQuery += ' AND a.date BETWEEN ? AND ?';
            params.push(startDate, endDate);
            countParams.push(startDate, endDate);
        }

        query += ' ORDER BY a.date DESC, a.checkIn DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [attendance] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            attendance,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllAttendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAttendanceStats = async (req, res) => {
    try {
        const { startDate, endDate, departmentId } = req.query;

        let query = `
            SELECT
                a.status,
                COUNT(*) as count
            FROM attendance a
            JOIN users u ON a.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            WHERE 1=1
        `;
        const params = [];

        if (startDate && endDate) {
            query += ' AND a.date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        if (departmentId) {
            query += ' AND p.departmentId = ?';
            params.push(departmentId);
        }

        query += ' GROUP BY a.status';

        const [stats] = await pool.execute(query, params);

        const [totalPresent] = await pool.execute(
            `SELECT COUNT(DISTINCT userId) as count FROM attendance
             WHERE status IN ('present', 'late') AND date = CURDATE()`
        );

        const [totalAbsent] = await pool.execute(
            `SELECT COUNT(*) as count FROM users u
             WHERE u.role = 'employee'
             AND u.id NOT IN (SELECT userId FROM attendance WHERE date = CURDATE())`
        );

        res.status(200).json({
            statusBreakdown: stats,
            todayPresent: totalPresent[0].count,
            todayAbsent: totalAbsent[0].count
        });
    } catch (error) {
        console.error('GetAttendanceStats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    getAttendanceStats
};
