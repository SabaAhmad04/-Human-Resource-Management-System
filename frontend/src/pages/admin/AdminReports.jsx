import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  Calendar,
  Wallet,
  Download,
  TrendingUp
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import DateRangePicker from '../../components/common/DateRangePicker'

const AdminReports = () => {
  const [reportType, setReportType] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const companyMetrics = [
    { name: 'Jan', revenue: 400000, expenses: 320000, profit: 80000 },
    { name: 'Feb', revenue: 420000, expenses: 330000, profit: 90000 },
    { name: 'Mar', revenue: 450000, expenses: 340000, profit: 110000 },
    { name: 'Apr', revenue: 480000, expenses: 350000, profit: 130000 },
    { name: 'May', revenue: 500000, expenses: 360000, profit: 140000 },
    { name: 'Jun', revenue: 520000, expenses: 370000, profit: 150000 },
  ]

  const employeeGrowth = [
    { name: 'Jan', count: 220 },
    { name: 'Feb', count: 225 },
    { name: 'Mar', count: 230 },
    { name: 'Apr', count: 238 },
    { name: 'May', count: 242 },
    { name: 'Jun', count: 248 },
  ]

  const departmentDistribution = [
    { name: 'Engineering', value: 85, color: '#3b82f6' },
    { name: 'Marketing', value: 42, color: '#22c55e' },
    { name: 'Sales', value: 38, color: '#f59e0b' },
    { name: 'HR', value: 25, color: '#ef4444' },
    { name: 'Finance', value: 32, color: '#8b5cf6' },
    { name: 'Operations', value: 26, color: '#06b6d4' },
  ]

  const reportTypes = [
    { value: 'overview', label: 'Company Overview' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'employee', label: 'Employee Report' },
    { value: 'department', label: 'Department Report' },
  ]

  const renderChart = () => {
    switch (reportType) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={companyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'financial':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={companyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Bar dataKey="profit" fill="#22c55e" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'employee':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={employeeGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Employees" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'department':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Company Reports</h1>
        <Button>
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Select
              label="Report Type"
              options={reportTypes}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <DateRangePicker
              label="Date Range"
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">248</p>
              <p className="text-xs text-success-600">+12% from last month</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">$520K</p>
              <p className="text-xs text-success-600">+4% from last month</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Wallet size={20} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payroll</p>
              <p className="text-xl font-bold text-gray-900">$370K</p>
              <p className="text-xs text-warning-600">+2% from last month</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-xl font-bold text-gray-900">29%</p>
              <p className="text-xs text-success-600">+3% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card title={
        reportType === 'overview' ? 'Company Overview' :
        reportType === 'financial' ? 'Financial Report' :
        reportType === 'employee' ? 'Employee Growth' : 'Department Distribution'
      }>
        {renderChart()}
      </Card>

      {/* Department Summary */}
      <Card title="Department Summary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Employees</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Spent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Engineering', employees: 85, budget: 2500000, spent: 2100000 },
                { name: 'Marketing', employees: 42, budget: 1200000, spent: 980000 },
                { name: 'Sales', employees: 38, budget: 1800000, spent: 1650000 },
                { name: 'HR', employees: 25, budget: 800000, spent: 650000 },
                { name: 'Finance', employees: 32, budget: 1000000, spent: 820000 },
                { name: 'Operations', employees: 26, budget: 900000, spent: 750000 },
              ].map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{dept.employees}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">${(dept.budget / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-4 text-sm text-gray-700">${(dept.spent / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(dept.spent / dept.budget) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">
                        {Math.round((dept.spent / dept.budget) * 100)}%
                      </span>
                    </div>
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

export default AdminReports
