const { pool } = require('../config/db');

const createReview = async (req, res) => {
    try {
        const { userId, period, rating, strengths, improvements, comments } = req.body;
        const reviewerId = req.user.id;

        if (!userId || !period || !rating) {
            return res.status(400).json({ message: 'UserId, period, and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const [existingUser] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [result] = await pool.execute(
            `INSERT INTO performance_reviews (userId, reviewerId, period, rating, strengths, improvements, comments)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, reviewerId, period, rating, strengths || null, improvements || null, comments || null]
        );

        await pool.execute(
            `INSERT INTO notifications (userId, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [userId, 'Performance Review', `You have received a new performance review for ${period}`, 'performance']
        );

        res.status(201).json({
            message: 'Performance review created successfully',
            review: {
                id: result.insertId,
                userId,
                reviewerId,
                period,
                rating,
                strengths,
                improvements,
                comments
            }
        });
    } catch (error) {
        console.error('CreateReview error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period } = req.query;

        let query = `
            SELECT pr.*, CONCAT(p.firstName, ' ', p.lastName) as reviewerName
            FROM performance_reviews pr
            LEFT JOIN profiles p ON pr.reviewerId = p.userId
            WHERE pr.userId = ?
        `;
        const params = [userId];

        if (period) {
            query += ' AND pr.period = ?';
            params.push(period);
        }

        query += ' ORDER BY pr.createdAt DESC';

        const [reviews] = await pool.execute(query, params);

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('GetMyReviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const { userId, period, departmentId, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT pr.*,
                   CONCAT(u.firstName, ' ', u.lastName) as employeeName,
                   CONCAT(rev.firstName, ' ', rev.lastName) as reviewerName,
                   d.name as departmentName
            FROM performance_reviews pr
            LEFT JOIN profiles u ON pr.userId = u.userId
            LEFT JOIN profiles rev ON pr.reviewerId = rev.userId
            LEFT JOIN departments d ON u.departmentId = d.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM performance_reviews WHERE 1=1';
        const params = [];
        const countParams = [];

        if (userId) {
            query += ' AND pr.userId = ?';
            countQuery += ' AND userId = ?';
            params.push(userId);
            countParams.push(userId);
        }

        if (period) {
            query += ' AND pr.period = ?';
            countQuery += ' AND period = ?';
            params.push(period);
            countParams.push(period);
        }

        if (departmentId) {
            query += ' AND u.departmentId = ?';
            params.push(departmentId);
        }

        query += ' ORDER BY pr.createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [reviews] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllReviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, strengths, improvements, comments } = req.body;

        const [existing] = await pool.execute('SELECT id FROM performance_reviews WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        await pool.execute(
            `UPDATE performance_reviews SET
                rating = COALESCE(?, rating),
                strengths = COALESCE(?, strengths),
                improvements = COALESCE(?, improvements),
                comments = COALESCE(?, comments)
             WHERE id = ?`,
            [rating, strengths, improvements, comments, id]
        );

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('UpdateReview error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createReview,
    getMyReviews,
    getAllReviews,
    updateReview
};
