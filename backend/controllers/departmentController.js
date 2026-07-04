const { pool } = require('../config/db');

const createDepartment = async (req, res) => {
    try {
        const { name, description, headId } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Department name is required' });
        }

        const [existing] = await pool.execute('SELECT id FROM departments WHERE name = ?', [name]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Department with this name already exists' });
        }

        const [result] = await pool.execute(
            'INSERT INTO departments (name, description, headId) VALUES (?, ?, ?)',
            [name, description || null, headId || null]
        );

        res.status(201).json({
            message: 'Department created successfully',
            department: {
                id: result.insertId,
                name,
                description,
                headId
            }
        });
    } catch (error) {
        console.error('CreateDepartment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const [departments] = await pool.execute(
            `SELECT d.*, CONCAT(p.firstName, ' ', p.lastName) as headName,
                    (SELECT COUNT(*) FROM profiles WHERE departmentId = d.id) as employeeCount
             FROM departments d
             LEFT JOIN profiles p ON d.headId = p.userId
             ORDER BY d.name`
        );

        res.status(200).json({ departments });
    } catch (error) {
        console.error('GetAllDepartments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const [departments] = await pool.execute(
            `SELECT d.*, CONCAT(p.firstName, ' ', p.lastName) as headName
             FROM departments d
             LEFT JOIN profiles p ON d.headId = p.userId
             WHERE d.id = ?`,
            [id]
        );

        if (departments.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const [employees] = await pool.execute(
            `SELECT u.id, u.email, p.firstName, p.lastName, p.designation, p.employeeId
             FROM profiles p
             JOIN users u ON p.userId = u.id
             WHERE p.departmentId = ?`,
            [id]
        );

        res.status(200).json({
            department: departments[0],
            employees
        });
    } catch (error) {
        console.error('GetDepartmentById error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, headId } = req.body;

        const [existing] = await pool.execute('SELECT id FROM departments WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        if (name) {
            const [nameExists] = await pool.execute(
                'SELECT id FROM departments WHERE name = ? AND id != ?',
                [name, id]
            );
            if (nameExists.length > 0) {
                return res.status(400).json({ message: 'Department name already in use' });
            }
        }

        await pool.execute(
            `UPDATE departments SET
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                headId = COALESCE(?, headId)
             WHERE id = ?`,
            [name, description, headId, id]
        );

        res.status(200).json({ message: 'Department updated successfully' });
    } catch (error) {
        console.error('UpdateDepartment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute('SELECT id FROM departments WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const [employees] = await pool.execute(
            'SELECT COUNT(*) as count FROM profiles WHERE departmentId = ?',
            [id]
        );

        if (employees[0].count > 0) {
            return res.status(400).json({
                message: 'Cannot delete department with assigned employees'
            });
        }

        await pool.execute('DELETE FROM departments WHERE id = ?', [id]);

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('DeleteDepartment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
