import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Download,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const HRPayroll = () => {
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const mockPayrolls = [
    { id: 1, employee: 'John Doe', department: 'Engineering', month: 'January 2024', gross: 7500, deductions: 2500, net: 5000, status: 'processed' },
    { id: 2, employee: 'Sarah Smith', department: 'Marketing', month: 'January 2024', gross: 6500, deductions: 2000, net: 4500, status: 'processed' },
    { id: 3, employee: 'Mike Johnson', department: 'Sales', month: 'January 2024', gross: 5500, deductions: 1500, net: 4000, status: 'pending' },
    { id: 4, employee: 'Emily Davis', department: 'HR', month: 'January 2024', gross: 6000, deductions: 1800, net: 4200, status: 'pending' },
    { id: 5, employee: 'David Wilson', department: 'Finance', month: 'December 2023', gross: 7000, deductions: 2200, net: 4800, status: 'paid' },
  ]

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: 'January 2024', label: 'January 2024' },
    { value: 'December 2023', label: 'December 2023' },
    { value: 'November 2023', label: 'November 2023' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processed', label: 'Processed' },
    { value: 'paid', label: 'Paid' },
  ]

  const filteredPayrolls = mockPayrolls.filter((payroll) => {
    const matchesMonth = filterMonth === 'all' || payroll.month === filterMonth
    const matchesStatus = filterStatus === 'all' || payroll.status === filterStatus
    return matchesMonth && matchesStatus
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

  const handleGeneratePayroll = () => {
    console.log('Generate bulk payroll')
  }

  const handleProcessPayroll = (id) => {
    console.log('Process payroll:', id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <div className="flex gap-3">
          <Button onClick={handleGeneratePayroll}>
            <Plus size={16} className="mr-2" />
            Generate Payroll
          </Button>
          <Button variant="secondary">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Total Gross</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGross)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Deductions</p>
          <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalDeductions)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Net Pay</p>
          <p className="text-2xl font-bold text-success-600">{formatCurrency(totalNet)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          options={monthOptions}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Payroll Table */}
      <Card>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
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
                    <Badge variant={
                      payroll.status === 'paid' ? 'success' :
                      payroll.status === 'processed' ? 'info' : 'warning'
                    }>
                      {payroll.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {payroll.status === 'pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleProcessPayroll(payroll.id)}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Process
                      </Button>
                    )}
                    {payroll.status !== 'pending' && (
                      <Button variant="ghost" size="sm">
                        <Download size={14} />
                      </Button>
                    )}
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

export default HRPayroll
