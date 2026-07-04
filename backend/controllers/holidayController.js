const { pool } = require('../config/db');

const createHoliday = async (req, res) => {
    try {
        const { name, date, description } = req.body;

        if (!name || !date) {
            return res.status(400).json({ message: 'Holiday name and date are required' });
        }

        const [existing] = await pool.execute('SELECT id FROM holidays WHERE date = ?', [date]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Holiday already exists for this date' });
        }

        const [result] = await pool.execute(
            'INSERT INTO holidays (name, date, description) VALUES (?, ?, ?)',
            [name, date, description || null]
        );

        res.status(201).json({
            message: 'Holiday created successfully',
            holiday: {
                id: result.insertId,
                name,
                date,
                description
            }
        });
    } catch (error) {
        console.error('CreateHoliday error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllHolidays = async (req, res) => {
    try {
        const { year } = req.query;

        let query = 'SELECT * FROM holidays';
        const params = [];

        if (year) {
            query += ' WHERE YEAR(date) = ?';
            params.push(year);
        }

        query += ' ORDER BY date ASC';

        const [holidays] = await pool.execute(query, params);

        res.status(200).json({ holidays });
    } catch (error) {
        console.error('GetAllHolidays error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, description } = req.body;

        const [existing] = await pool.execute('SELECT id FROM holidays WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Holiday not found' });
        }

        if (date) {
            const [dateExists] = await pool.execute(
                'SELECT id FROM holidays WHERE date = ? AND id != ?',
                [date, id]
            );
            if (dateExists.length > 0) {
                return res.status(400).json({ message: 'Holiday already exists for this date' });
            }
        }

        await pool.execute(
            `UPDATE holidays SET
                name = COALESCE(?, name),
                date = COALESCE(?, date),
                description = COALESCE(?, description)
             WHERE id = ?`,
            [name, date, description, id]
        );

        res.status(200).json({ message: 'Holiday updated successfully' });
    } catch (error) {
        console.error('UpdateHoliday error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute('SELECT id FROM holidays WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Holiday not found' });
        }

        await pool.execute('DELETE FROM holidays WHERE id = ?', [id]);

        res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        console.error('DeleteHoliday error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createHoliday,
    getAllHolidays,
    updateHoliday,
    deleteHoliday
};
