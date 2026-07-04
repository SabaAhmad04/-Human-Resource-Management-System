const { pool } = require('../config/db');

const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { isRead, type, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM notifications WHERE userId = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE userId = ?';
        const params = [userId];
        const countParams = [userId];

        if (isRead !== undefined) {
            query += ' AND isRead = ?';
            countQuery += ' AND isRead = ?';
            params.push(isRead === 'true' ? 1 : 0);
            countParams.push(isRead === 'true' ? 1 : 0);
        }

        if (type) {
            query += ' AND type = ?';
            countQuery += ' AND type = ?';
            params.push(type);
            countParams.push(type);
        }

        query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [notifications] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const [unreadCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = FALSE',
            [userId]
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            notifications,
            unreadCount: unreadCount[0].count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetMyNotifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [existing] = await pool.execute(
            'SELECT id FROM notifications WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await pool.execute('UPDATE notifications SET isRead = TRUE WHERE id = ?', [id]);

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('MarkAsRead error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.execute(
            'UPDATE notifications SET isRead = TRUE WHERE userId = ? AND isRead = FALSE',
            [userId]
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('MarkAllAsRead error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({ message: 'UserId, title, and message are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO notifications (userId, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, title, message, type || 'general']
        );

        res.status(201).json({
            message: 'Notification created successfully',
            notification: {
                id: result.insertId,
                userId,
                title,
                message,
                type: type || 'general'
            }
        });
    } catch (error) {
        console.error('CreateNotification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
