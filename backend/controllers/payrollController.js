const { pool } = require('../config/db');

const generatePayroll = async (req, res) => {
    try {
        const { userId, month, year, basicSalary, hra, performanceBonus, standardAllowance, lta, deductions } = req.body;

        if (!userId || !month || !year || !basicSalary) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const [existing] = await pool.execute(
            'SELECT id FROM payroll WHERE userId = ? AND month = ? AND year = ?',
            [userId, month, year]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Payroll already exists for this month and year' });
        }

        const hraAmount = hra || basicSalary * 0.4;
        const performanceBonusAmount = performanceBonus || 0;
        const standardAllowanceAmount = standardAllowance || basicSalary * 0.1;
        const ltaAmount = lta || 0;
        const deductionsAmount = deductions || 0;

        const netSalary = (basicSalary + hraAmount + performanceBonusAmount + standardAllowanceAmount + ltaAmount) - deductionsAmount;

        const [result] = await pool.execute(
            `INSERT INTO payroll (userId, month, year, basicSalary, hra, performanceBonus, standardAllowance, lta, deductions, netSalary, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [userId, month, year, basicSalary, hraAmount, performanceBonusAmount, standardAllowanceAmount, ltaAmount, deductionsAmount, netSalary]
        );

        res.status(201).json({
            message: 'Payroll generated successfully',
            payroll: {
                id: result.insertId,
                userId,
                month,
                year,
                basicSalary,
                hra: hraAmount,
                performanceBonus: performanceBonusAmount,
                standardAllowance: standardAllowanceAmount,
                lta: ltaAmount,
                deductions: deductionsAmount,
                netSalary,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('GeneratePayroll error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyPayslips = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year } = req.query;

        let query = 'SELECT * FROM payroll WHERE userId = ?';
        const params = [userId];

        if (year) {
            query += ' AND year = ?';
            params.push(year);
        }

        query += ' ORDER BY year DESC, month DESC';

        const [payslips] = await pool.execute(query, params);

        res.status(200).json({ payslips });
    } catch (error) {
        console.error('GetMyPayslips error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPayrolls = async (req, res) => {
    try {
        const { month, year, status, departmentId, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, u.email, prof.firstName, prof.lastName, d.name as departmentName
            FROM payroll p
            JOIN users u ON p.userId = u.id
            LEFT JOIN profiles prof ON u.id = prof.userId
            LEFT JOIN departments d ON prof.departmentId = d.id
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) as total FROM payroll WHERE 1=1`;
        const params = [];
        const countParams = [];

        if (month) {
            query += ' AND p.month = ?';
            countQuery += ' AND month = ?';
            params.push(month);
            countParams.push(month);
        }

        if (year) {
            query += ' AND p.year = ?';
            countQuery += ' AND year = ?';
            params.push(year);
            countParams.push(year);
        }

        if (status) {
            query += ' AND p.status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
            countParams.push(status);
        }

        if (departmentId) {
            query += ' AND prof.departmentId = ?';
            params.push(departmentId);
        }

        query += ' ORDER BY p.year DESC, p.month DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [payrolls] = await pool.execute(query, params);
        const [countResult] = await pool.execute(countQuery, countParams);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            payrolls,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('GetAllPayrolls error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const { basicSalary, hra, performanceBonus, standardAllowance, lta, deductions, status } = req.body;

        const [existing] = await pool.execute('SELECT * FROM payroll WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Payroll not found' });
        }

        const currentPayroll = existing[0];
        const newBasicSalary = basicSalary || currentPayroll.basicSalary;
        const newHra = hra !== undefined ? hra : currentPayroll.hra;
        const newPerformanceBonus = performanceBonus !== undefined ? performanceBonus : currentPayroll.performanceBonus;
        const newStandardAllowance = standardAllowance !== undefined ? standardAllowance : currentPayroll.standardAllowance;
        const newLta = lta !== undefined ? lta : currentPayroll.lta;
        const newDeductions = deductions !== undefined ? deductions : currentPayroll.deductions;

        const netSalary = (newBasicSalary + newHra + newPerformanceBonus + newStandardAllowance + newLta) - newDeductions;

        await pool.execute(
            `UPDATE payroll SET
                basicSalary = ?, hra = ?, performanceBonus = ?,
                standardAllowance = ?, lta = ?, deductions = ?,
                netSalary = ?, status = COALESCE(?, status)
             WHERE id = ?`,
            [newBasicSalary, newHra, newPerformanceBonus, newStandardAllowance, newLta, newDeductions, netSalary, status, id]
        );

        res.status(200).json({ message: 'Payroll updated successfully' });
    } catch (error) {
        console.error('UpdatePayroll error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const processPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: 'Please provide month and year' });
        }

        const [pendingPayrolls] = await pool.execute(
            'SELECT id, userId FROM payroll WHERE month = ? AND year = ? AND status = ?',
            [month, year, 'pending']
        );

        if (pendingPayrolls.length === 0) {
            return res.status(400).json({ message: 'No pending payrolls found for this period' });
        }

        await pool.execute(
            'UPDATE payroll SET status = ? WHERE month = ? AND year = ? AND status = ?',
            ['processed', month, year, 'pending']
        );

        for (const payroll of pendingPayrolls) {
            await pool.execute(
                `INSERT INTO notifications (userId, title, message, type)
                 VALUES (?, ?, ?, ?)`,
                [
                    payroll.userId,
                    'Payroll Processed',
                    `Your salary for ${month}/${year} has been processed`,
                    'payroll'
                ]
            );
        }

        res.status(200).json({
            message: `${pendingPayrolls.length} payrolls processed successfully`,
            processedCount: pendingPayrolls.length
        });
    } catch (error) {
        console.error('ProcessPayroll error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generatePayroll,
    getMyPayslips,
    getAllPayrolls,
    updatePayroll,
    processPayroll
};
