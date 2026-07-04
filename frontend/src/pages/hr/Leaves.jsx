import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const HRLeaves = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEmployee, setFilterEmployee] = useState('all')

  const mockLeaves = [
    { id: 1, employee: 'John Doe', department: 'Engineering', type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-22', days: 3, reason: 'Feeling unwell', status: 'pending' },
    { id: 2, employee: 'Sarah Smith', department: 'Marketing', type: 'Casual Leave', startDate: '2024-01-15', endDate: '2024-01-15', days: 1, reason: 'Personal work', status: 'pending' },
    { id: 3, employee: 'Mike Johnson', department: 'Sales', type: 'Paid Leave', startDate: '2024-01-10', endDate: '2024-01-12', days: 3, reason: 'Family vacation', status: 'approved' },
    { id: 4, employee: 'Emily Davis', department: 'HR', type: 'Sick Leave', startDate: '2024-01-05', endDate: '2024-01-06', days: 2, reason: 'Medical appointment', status: 'rejected' },
    { id: 5, employee: 'David Wilson', department: 'Finance', type: 'Casual Leave', startDate: '2024-01-25', endDate: '2024-01-26', days: 2, reason: 'Personal commitment', status: 'pending' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ]

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Sarah Smith', label: 'Sarah Smith' },
    { value: 'Mike Johnson', label: 'Mike Johnson' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'David Wilson', label: 'David Wilson' },
  ]

  const filteredLeaves = mockLeaves.filter((leave) => {
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus
    const matchesEmployee = filterEmployee === 'all' || leave.employee === filterEmployee
    return matchesStatus && matchesEmployee
  })

  const pendingCount = mockLeaves.filter(l => l.status === 'pending').length

  const handleApprove = (id) => {
    console.log('Approve leave:', id)
  }

  const handleReject = (id) => {
    console.log('Reject leave:', id)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-success-500" />
      case 'rejected': return <XCircle size={16} className="text-danger-500" />
      default: return <AlertCircle size={16} className="text-warning-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">{pendingCount} pending leave requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={employeeOptions}
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Leave Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Days</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {leave.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{leave.employee}</p>
                        <p className="text-sm text-gray-600">{leave.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{leave.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{leave.days}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(leave.status)}
                      <Badge
                        variant={
                          leave.status === 'approved' ? 'success' :
                          leave.status === 'rejected' ? 'danger' : 'warning'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {leave.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(leave.id)}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(leave.id)}
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
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

export default HRLeaves
