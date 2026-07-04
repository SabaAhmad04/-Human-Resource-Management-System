import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  Calendar,
  Wallet,
  Download,
  Filter
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import DateRangePicker from '../../components/common/DateRangePicker'

const Reports = () => {
  const [reportType, setReportType] = useState('attendance')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')

  const attendanceData = [
    { name: 'Jan', present: 180, absent: 20, late: 15 },
    { name: 'Feb', present: 185, absent: 15, late: 18 },
    { name: 'Mar', present: 190, absent: 12, late: 12 },
    { name: 'Apr', present: 178, absent: 22, late: 20 },
    { name: 'May', present: 195, absent: 10, late: 8 },
    { name: 'Jun', present: 188, absent: 18, late: 14 },
  ]

  const payrollData = [
    { name: 'Jan', gross: 150000, deductions: 45000, net: 105000 },
    { name: 'Feb', gross: 155000, deductions: 46000, net: 109000 },
    { name: 'Mar', gross: 148000, deductions: 44000, net: 104000 },
    { name: 'Apr', gross: 160000, deductions: 48000, net: 112000 },
    { name: 'May', gross: 158000, deductions: 47000, net: 111000 },
    { name: 'Jun', gross: 162000, deductions: 49000, net: 113000 },
  ]

  const departmentData = [
    { name: 'Engineering', value: 85, color: '#3b82f6' },
    { name: 'Marketing', value: 42, color: '#22c55e' },
    { name: 'Sales', value: 38, color: '#f59e0b' },
    { name: 'HR', value: 25, color: '#ef4444' },
    { name: 'Finance', value: 32, color: '#8b5cf6' },
  ]

  const leaveData = [
    { name: 'Jan', sick: 15, casual: 20, paid: 8 },
    { name: 'Feb', sick: 12, casual: 18, paid: 10 },
    { name: 'Mar', sick: 18, casual: 22, paid: 12 },
    { name: 'Apr', sick: 14, casual: 16, paid: 9 },
    { name: 'May', sick: 10, casual: 14, paid: 7 },
    { name: 'Jun', sick: 16, casual: 19, paid: 11 },
  ]

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'payroll', label: 'Payroll Report' },
    { value: 'employee', label: 'Employee Report' },
    { value: 'leave', label: 'Leave Report' },
  ]

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
  ]

  const renderChart = () => {
    switch (reportType) {
      case 'attendance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#22c55e" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'payroll':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gross" fill="#3b82f6" name="Gross" />
              <Bar dataKey="deductions" fill="#ef4444" name="Deductions" />
              <Bar dataKey="net" fill="#22c55e" name="Net Pay" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'employee':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'leave':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sick" fill="#ef4444" name="Sick Leave" />
              <Bar dataKey="casual" fill="#f59e0b" name="Casual Leave" />
              <Bar dataKey="paid" fill="#3b82f6" name="Paid Leave" />
            </BarChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
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
          <div className="w-full md:w-64">
            <Select
              label="Department"
              options={departmentOptions}
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
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

      {/* Report Chart */}
      <Card title={
        reportType === 'attendance' ? 'Attendance Report' :
        reportType === 'payroll' ? 'Payroll Report' :
        reportType === 'employee' ? 'Employee Distribution' : 'Leave Report'
      }>
        {renderChart()}
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">248</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Leave Utilization</p>
              <p className="text-xl font-bold text-gray-900">68%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <Wallet size={20} className="text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-xl font-bold text-gray-900">$1.2M</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports
