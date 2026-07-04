const { pool } = require('../config/db');

const getAllEmployees = async (req, res) => {
    try {
        const { search, departmentId, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT u.id, u.email, u.role, u.createdAt,
                   p.firstName, p.lastName, p.phone, p.avatar, p.departmentId,
                   p.designation, p.joinDate, p.employeeId,
                   d.name as departmentName
            FROM users u
            LEFT JOIN profiles p ON u.id = p.userId
            LEFT JOIN departments d ON p.departmentId = d.id
            WHERE u.role != 'super_admin'
        `;
        let countQuery = `SELECT COUNT(*) as total FROM users u LEFT JOIN profiles p ON u.id = p.userId WHERE u.role != 'super_admin'`;
        const params = [];
        const countParams = [];

        if (search) {
            query += ` AND (p.firstName LIKE ? OR p.lastName LIKE ? OR u.email LIKE ? OR p.employeeId LIKE ?)`;
            countQuery += ` AND (p.firstName LIKE ? OR p.lastName LIKE ? OR u.email LIKE ? OR p.employeeId LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (departmentId) {
            query += ` AND p.departmentId = ?`;
            countQuery += ` AND p.departmentId = ?`;
            params.push(departmentId);
            countParams.push(departmentId);
        }

        query += ` ORDER BY u.createdAt DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [employees] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            employees,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllEmployees error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await pool.execute(
            `SELECT u.id, u.email, u.role, u.isVerified, u.createdAt,
                    p.firstName, p.lastName, p.phone, p.avatar, p.dateOfBirth,
                    p.gender, p.nationality, p.maritalStatus, p.address,
                    p.departmentId, p.designation, p.managerId, p.joinDate,
                    p.employeeId, p.bankAccountNumber, p.bankName, p.ifscCode,
                    d.name as departmentName,
                    CONCAT(m.firstName, ' ', m.lastName) as managerName
             FROM users u
             LEFT JOIN profiles p ON u.id = p.userId
             LEFT JOIN departments d ON p.departmentId = d.id
             LEFT JOIN profiles m ON p.managerId = m.id
             WHERE u.id = ?`,
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ employee: employees[0] });
    } catch (error) {
        console.error('GetEmployeeById error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName, lastName, phone, dateOfBirth, gender,
            nationality, maritalStatus, address, departmentId,
            designation, managerId, bankAccountNumber, bankName, ifscCode
        } = req.body;

        const [existing] = await pool.execute('SELECT userId FROM profiles WHERE userId = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }

        await pool.execute(
            `UPDATE profiles SET
                firstName = COALESCE(?, firstName),
                lastName = COALESCE(?, lastName),
                phone = COALESCE(?, phone),
                dateOfBirth = COALESCE(?, dateOfBirth),
                gender = COALESCE(?, gender),
                nationality = COALESCE(?, nationality),
                maritalStatus = COALESCE(?, maritalStatus),
                address = COALESCE(?, address),
                departmentId = COALESCE(?, departmentId),
                designation = COALESCE(?, designation),
                managerId = COALESCE(?, managerId),
                bankAccountNumber = COALESCE(?, bankAccountNumber),
                bankName = COALESCE(?, bankName),
                ifscCode = COALESCE(?, ifscCode)
             WHERE userId = ?`,
            [firstName, lastName, phone, dateOfBirth, gender,
             nationality, maritalStatus, address, departmentId,
             designation, managerId, bankAccountNumber, bankName, ifscCode, id]
        );

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error('UpdateEmployee error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await pool.execute('DELETE FROM users WHERE id = ?', [id]);

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('DeleteEmployee error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeStats = async (req, res) => {
    try {
        const [totalResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM users WHERE role = ?', ['employee']
        );

        const [departmentStats] = await pool.execute(
            `SELECT d.name as department, COUNT(p.id) as count
             FROM departments d
             LEFT JOIN profiles p ON d.id = p.departmentId
             GROUP BY d.id, d.name`
        );

        const [roleStats] = await pool.execute(
            `SELECT role, COUNT(*) as count FROM users GROUP BY role`
        );

        const [recentJoinees] = await pool.execute(
            `SELECT p.firstName, p.lastName, p.joinDate, p.designation
             FROM profiles p
             ORDER BY p.joinDate DESC
             LIMIT 5`
        );

        res.status(200).json({
            totalEmployees: totalResult[0].total,
            byDepartment: departmentStats,
            byRole: roleStats,
            recentJoinees
        });
    } catch (error) {
        console.error('GetEmployeeStats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
};
