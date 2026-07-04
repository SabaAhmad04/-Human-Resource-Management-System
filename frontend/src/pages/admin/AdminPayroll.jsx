import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Filter,
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const AdminPayroll = () => {
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')

  const mockPayrolls = [
    { id: 1, employee: 'John Doe', department: 'Engineering', month: 'January 2026', gross: 7500, deductions: 2500, net: 5000, status: 'paid' },
    { id: 2, employee: 'Sarah Smith', department: 'Marketing', month: 'January 2026', gross: 6500, deductions: 2000, net: 4500, status: 'paid' },
    { id: 3, employee: 'Mike Johnson', department: 'Sales', month: 'January 2026', gross: 5500, deductions: 1500, net: 4000, status: 'processed' },
    { id: 4, employee: 'Emily Davis', department: 'HR', month: 'January 2026', gross: 6000, deductions: 1800, net: 4200, status: 'processed' },
    { id: 5, employee: 'David Wilson', department: 'Finance', month: 'January 2026', gross: 8000, deductions: 2800, net: 5200, status: 'paid' },
    { id: 6, employee: 'Lisa Brown', department: 'Engineering', month: 'December 2023', gross: 7000, deductions: 2200, net: 4800, status: 'paid' },
  ]

  const payrollByDepartment = [
    { name: 'Engineering', amount: 45000 },
    { name: 'Marketing', amount: 28000 },
    { name: 'Sales', amount: 22000 },
    { name: 'HR', amount: 18000 },
    { name: 'Finance', amount: 32000 },
  ]

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: 'January 2026', label: 'January 2026' },
    { value: 'December 2023', label: 'December 2023' },
  ]

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
  ]

  const filteredPayrolls = mockPayrolls.filter((payroll) => {
    const matchesMonth = filterMonth === 'all' || payroll.month === filterMonth
    const matchesDepartment = filterDepartment === 'all' || payroll.department === filterDepartment
    return matchesMonth && matchesDepartment
  })

  const totalGross = filteredPayrolls.reduce((sum, p) => sum + p.gross, 0)
  const totalDeductions = filteredPayrolls.reduce((sum, p) => sum + p.deductions, 0)
  const totalNet = filteredPayrolls.reduce((sum, p) => sum + p.net, 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Overview</h1>
        <Button>
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Wallet size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gross</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGross)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <TrendingDown size={24} className="text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalDeductions)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Net Pay</p>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(totalNet)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card title="Payroll by Department">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={payrollByDepartment}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="amount" fill="#3b82f6" name="Total Payroll" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          options={monthOptions}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={departmentOptions}
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Payroll Table */}
      <Card title="All Payrolls">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gross</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deductions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Net Pay</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map((payroll) => (
                <tr key={payroll.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {payroll.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{payroll.employee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{payroll.department}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{payroll.month}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(payroll.gross)}</td>
                  <td className="px-4 py-4 text-sm text-danger-600">{formatCurrency(payroll.deductions)}</td>
                  <td className="px-4 py-4 text-sm font-medium text-success-600">{formatCurrency(payroll.net)}</td>
                  <td className="px-4 py-4">
                    <Badge variant={payroll.status === 'paid' ? 'success' : 'warning'}>
                      {payroll.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AdminPayroll
