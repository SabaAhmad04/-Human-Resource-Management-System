const { pool } = require('../config/db');

const createAnnouncement = async (req, res) => {
    try {
        const { title, content, priority } = req.body;
        const createdBy = req.user.id;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO announcements (title, content, createdBy, priority) VALUES (?, ?, ?, ?)',
            [title, content, createdBy, priority || 'medium']
        );

        const [employees] = await pool.execute('SELECT id FROM users WHERE role = ?', ['employee']);

        for (const employee of employees) {
            await pool.execute(
                `INSERT INTO notifications (userId, title, message, type)
                 VALUES (?, ?, ?, ?)`,
                [employee.id, 'New Announcement', `New ${priority || 'medium'} priority announcement: ${title}`, 'announcement']
            );
        }

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement: {
                id: result.insertId,
                title,
                content,
                priority: priority || 'medium'
            }
        });
    } catch (error) {
        console.error('CreateAnnouncement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllAnnouncements = async (req, res) => {
    try {
        const { priority, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, CONCAT(p.firstName, ' ', p.lastName) as createdByName
            FROM announcements a
            LEFT JOIN profiles p ON a.createdBy = p.userId
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM announcements WHERE 1=1';
        const params = [];
        const countParams = [];

        if (priority) {
            query += ' AND a.priority = ?';
            countQuery += ' AND priority = ?';
            params.push(priority);
            countParams.push(priority);
        }

        query += ' ORDER BY a.createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [announcements] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            announcements,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllAnnouncements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, priority } = req.body;

        const [existing] = await pool.execute('SELECT id FROM announcements WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await pool.execute(
            `UPDATE announcements SET
                title = COALESCE(?, title),
                content = COALESCE(?, content),
                priority = COALESCE(?, priority)
             WHERE id = ?`,
            [title, content, priority, id]
        );

        res.status(200).json({ message: 'Announcement updated successfully' });
    } catch (error) {
        console.error('UpdateAnnouncement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute('SELECT id FROM announcements WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('DeleteAnnouncement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};
