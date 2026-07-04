const { pool } = require('../config/db');

const createJobOpening = async (req, res) => {
    try {
        const { title, departmentId, description, requirements, salary } = req.body;
        const createdBy = req.user.id;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const [result] = await pool.execute(
            `INSERT INTO job_openings (title, departmentId, description, requirements, salary, createdBy)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, departmentId || null, description, requirements || null, salary || null, createdBy]
        );

        res.status(201).json({
            message: 'Job opening created successfully',
            job: {
                id: result.insertId,
                title,
                departmentId,
                description,
                requirements,
                salary,
                status: 'open'
            }
        });
    } catch (error) {
        console.error('CreateJobOpening error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllJobOpenings = async (req, res) => {
    try {
        const { status, departmentId, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT j.*, d.name as departmentName,
                   CONCAT(p.firstName, ' ', p.lastName) as createdByName
            FROM job_openings j
            LEFT JOIN departments d ON j.departmentId = d.id
            LEFT JOIN profiles p ON j.createdBy = p.userId
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM job_openings WHERE 1=1';
        const params = [];
        const countParams = [];

        if (status) {
            query += ' AND j.status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
            countParams.push(status);
        }

        if (departmentId) {
            query += ' AND j.departmentId = ?';
            countQuery += ' AND departmentId = ?';
            params.push(departmentId);
            countParams.push(departmentId);
        }

        query += ' ORDER BY j.createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [jobs] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            jobs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllJobOpenings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateJobOpening = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, departmentId, description, requirements, salary, status } = req.body;

        const [existing] = await pool.execute('SELECT id FROM job_openings WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Job opening not found' });
        }

        await pool.execute(
            `UPDATE job_openings SET
                title = COALESCE(?, title),
                departmentId = COALESCE(?, departmentId),
                description = COALESCE(?, description),
                requirements = COALESCE(?, requirements),
                salary = COALESCE(?, salary),
                status = COALESCE(?, status)
             WHERE id = ?`,
            [title, departmentId, description, requirements, salary, status, id]
        );

        res.status(200).json({ message: 'Job opening updated successfully' });
    } catch (error) {
        console.error('UpdateJobOpening error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const closeJob = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute('SELECT id, status FROM job_openings WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Job opening not found' });
        }

        if (existing[0].status === 'closed') {
            return res.status(400).json({ message: 'Job opening is already closed' });
        }

        await pool.execute('UPDATE job_openings SET status = ? WHERE id = ?', ['closed', id]);

        res.status(200).json({ message: 'Job opening closed successfully' });
    } catch (error) {
        console.error('CloseJob error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const scheduleInterview = async (req, res) => {
    try {
        const { jobId, candidateName, candidateEmail, scheduledAt, interviewerId } = req.body;

        if (!jobId || !candidateName || !candidateEmail || !scheduledAt) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const [job] = await pool.execute('SELECT id FROM job_openings WHERE id = ?', [jobId]);
        if (job.length === 0) {
            return res.status(404).json({ message: 'Job opening not found' });
        }

        const [result] = await pool.execute(
            `INSERT INTO interview_schedules (jobId, candidateName, candidateEmail, scheduledAt, interviewerId)
             VALUES (?, ?, ?, ?, ?)`,
            [jobId, candidateName, candidateEmail, scheduledAt, interviewerId || null]
        );

        if (interviewerId) {
            await pool.execute(
                `INSERT INTO notifications (userId, title, message, type)
                 VALUES (?, ?, ?, ?)`,
                [
                    interviewerId,
                    'Interview Scheduled',
                    `Interview scheduled with ${candidateName} for job #${jobId}`,
                    'interview'
                ]
            );
        }

        res.status(201).json({
            message: 'Interview scheduled successfully',
            interview: {
                id: result.insertId,
                jobId,
                candidateName,
                candidateEmail,
                scheduledAt,
                interviewerId,
                status: 'scheduled'
            }
        });
    } catch (error) {
        console.error('ScheduleInterview error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getInterviews = async (req, res) => {
    try {
        const { jobId, interviewerId, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT i.*, j.title as jobTitle,
                   CONCAT(p.firstName, ' ', p.lastName) as interviewerName
            FROM interview_schedules i
            LEFT JOIN job_openings j ON i.jobId = j.id
            LEFT JOIN profiles p ON i.interviewerId = p.userId
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM interview_schedules WHERE 1=1';
        const params = [];
        const countParams = [];

        if (jobId) {
            query += ' AND i.jobId = ?';
            countQuery += ' AND jobId = ?';
            params.push(jobId);
            countParams.push(jobId);
        }

        if (interviewerId) {
            query += ' AND i.interviewerId = ?';
            countQuery += ' AND interviewerId = ?';
            params.push(interviewerId);
            countParams.push(interviewerId);
        }

        if (status) {
            query += ' AND i.status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
            countParams.push(status);
        }

        query += ' ORDER BY i.scheduledAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [interviews] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            interviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetInterviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateInterviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;

        const [existing] = await pool.execute('SELECT id FROM interview_schedules WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        await pool.execute(
            'UPDATE interview_schedules SET status = ?, feedback = COALESCE(?, feedback) WHERE id = ?',
            [status, feedback, id]
        );

        res.status(200).json({ message: 'Interview status updated successfully' });
    } catch (error) {
        console.error('UpdateInterviewStatus error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createJobOpening,
    getAllJobOpenings,
    updateJobOpening,
    closeJob,
    scheduleInterview,
    getInterviews,
    updateInterviewStatus
};
