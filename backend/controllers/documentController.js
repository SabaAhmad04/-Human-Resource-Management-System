const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const uploadDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, type } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Document name is required' });
        }

        const fileUrl = `uploads/${uuidv4()}_${req.file.originalname}`;
        const fileType = type || req.file.mimetype.split('/')[1];

        const [result] = await pool.execute(
            'INSERT INTO documents (userId, name, fileUrl, type) VALUES (?, ?, ?, ?)',
            [userId, name, fileUrl, fileType]
        );

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: {
                id: result.insertId,
                name,
                fileUrl,
                type: fileType
            }
        });
    } catch (error) {
        console.error('UploadDocument error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.query;

        let query = 'SELECT * FROM documents WHERE userId = ?';
        const params = [userId];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY createdAt DESC';

        const [documents] = await pool.execute(query, params);

        res.status(200).json({ documents });
    } catch (error) {
        console.error('GetMyDocuments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [existing] = await pool.execute(
            'SELECT id, fileUrl FROM documents WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        await pool.execute('DELETE FROM documents WHERE id = ?', [id]);

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('DeleteDocument error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    deleteDocument
};
