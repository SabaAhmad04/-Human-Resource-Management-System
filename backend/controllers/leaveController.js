const { pool } = require('../config/db');

const LEAVE_LIMITS = {
    sick: 12,
    casual: 12,
    paid: 15,
    maternity: 180,
    paternity: 15,
    unpaid: 0
};

const applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const [existingLeaves] = await pool.execute(
            `SELECT id FROM leave_requests
             WHERE userId = ? AND status IN ('pending', 'approved')
             AND ((startDate <= ? AND endDate >= ?) OR (startDate <= ? AND endDate >= ?) OR (startDate >= ? AND endDate <= ?))`,
            [userId, startDate, startDate, endDate, endDate, startDate, endDate]
        );

        if (existingLeaves.length > 0) {
            return res.status(400).json({ message: 'Leave request overlaps with existing leave' });
        }

        const [result] = await pool.execute(
            'INSERT INTO leave_requests (userId, type, startDate, endDate, reason) VALUES (?, ?, ?, ?, ?)',
            [userId, type, startDate, endDate, reason]
        );

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leave: {
                id: result.insertId,
                type,
                startDate,
                endDate,
                reason,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('ApplyLeave error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, year } = req.query;

        let query = 'SELECT * FROM leave_requests WHERE userId = ?';
        const params = [userId];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (year) {
            query += ' AND YEAR(startDate) = ?';
            params.push(year);
        }

        query += ' ORDER BY createdAt DESC';

        const [leaves] = await pool.execute(query, params);

        res.status(200).json({ leaves });
    } catch (error) {
        console.error('GetMyLeaves error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllLeaves = async (req, res) => {
    try {
        const { status, userId, type, startDate, endDate, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT lr.*, u.email, p.firstName, p.lastName, d.name as departmentName,
                   CONCAT(approver.firstName, ' ', approver.lastName) as approvedByName
            FROM leave_requests lr
            JOIN users u ON lr.userId = u.id
            LEFT JOIN profiles p ON u.id = p.userId
            LEFT JOIN departments d ON p.departmentId = d.id
            LEFT JOIN profiles approver ON lr.approvedBy = approver.userId
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) as total FROM leave_requests lr WHERE 1=1`;
        const params = [];
        const countParams = [];

        if (status) {
            query += ' AND lr.status = ?';
            countQuery += ' AND lr.status = ?';
            params.push(status);
            countParams.push(status);
        }

        if (userId) {
            query += ' AND lr.userId = ?';
            countQuery += ' AND lr.userId = ?';
            params.push(userId);
            countParams.push(userId);
        }

        if (type) {
            query += ' AND lr.type = ?';
            countQuery += ' AND lr.type = ?';
            params.push(type);
            countParams.push(type);
        }

        if (startDate && endDate) {
            query += ' AND lr.startDate >= ? AND lr.endDate <= ?';
            countQuery += ' AND lr.startDate >= ? AND lr.endDate <= ?';
            params.push(startDate, endDate);
            countParams.push(startDate, endDate);
        }

        query += ' ORDER BY lr.createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [leaves] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            leaves,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllLeaves error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const approvedBy = req.user.id;

        const [existing] = await pool.execute('SELECT * FROM leave_requests WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (existing[0].status !== 'pending') {
            return res.status(400).json({ message: 'Leave request is not pending' });
        }

        await pool.execute(
            'UPDATE leave_requests SET status = ?, approvedBy = ? WHERE id = ?',
            ['approved', approvedBy, id]
        );

        await pool.execute(
            `INSERT INTO notifications (userId, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [
                existing[0].userId,
                'Leave Approved',
                `Your ${existing[0].type} leave request has been approved`,
                'leave'
            ]
        );

        res.status(200).json({ message: 'Leave request approved' });
    } catch (error) {
        console.error('ApproveLeave error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const rejectLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const approvedBy = req.user.id;

        const [existing] = await pool.execute('SELECT * FROM leave_requests WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (existing[0].status !== 'pending') {
            return res.status(400).json({ message: 'Leave request is not pending' });
        }

        await pool.execute(
            'UPDATE leave_requests SET status = ?, approvedBy = ? WHERE id = ?',
            ['rejected', approvedBy, id]
        );

        await pool.execute(
            `INSERT INTO notifications (userId, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [
                existing[0].userId,
                'Leave Rejected',
                `Your ${existing[0].type} leave request has been rejected${reason ? ': ' + reason : ''}`,
                'leave'
            ]
        );

        res.status(200).json({ message: 'Leave request rejected' });
    } catch (error) {
        console.error('RejectLeave error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getLeaveBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentYear = new Date().getFullYear();

        const [approvedLeaves] = await pool.execute(
            `SELECT type, COUNT(*) as count,
                    SUM(DATEDIFF(endDate, startDate) + 1) as days
             FROM leave_requests
             WHERE userId = ? AND status = 'approved' AND YEAR(startDate) = ?
             GROUP BY type`,
            [userId, currentYear]
        );

        const usedLeaves = {};
        approvedLeaves.forEach(leave => {
            usedLeaves[leave.type] = parseInt(leave.days);
        });

        const balance = {};
        for (const [type, limit] of Object.entries(LEAVE_LIMITS)) {
            balance[type] = {
                total: limit,
                used: usedLeaves[type] || 0,
                remaining: Math.max(0, limit - (usedLeaves[type] || 0))
            };
        }

        res.status(200).json({ balance });
    } catch (error) {
        console.error('GetLeaveBalance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    getLeaveBalance
};
