import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const HRAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const mockAttendance = [
    { id: 1, employee: 'John Doe', department: 'Engineering', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9, status: 'present' },
    { id: 2, employee: 'Sarah Smith', department: 'Marketing', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: 9.25, status: 'present' },
    { id: 3, employee: 'Mike Johnson', department: 'Sales', checkIn: '10:00 AM', checkOut: '06:00 PM', hours: 8, status: 'late' },
    { id: 4, employee: 'Emily Davis', department: 'HR', checkIn: null, checkOut: null, hours: 0, status: 'absent' },
    { id: 5, employee: 'David Wilson', department: 'Finance', checkIn: '08:55 AM', checkOut: '05:55 PM', hours: 9, status: 'present' },
    { id: 6, employee: 'Lisa Brown', department: 'Engineering', checkIn: '09:30 AM', checkOut: '07:00 PM', hours: 9.5, status: 'late' },
  ]

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
  ]

  const filteredAttendance = mockAttendance.filter((record) => {
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    return matchesDepartment && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} className="text-success-500" />
      case 'late': return <AlertCircle size={16} className="text-warning-500" />
      case 'absent': return <XCircle size={16} className="text-danger-500" />
      default: return null
    }
  }

  const presentCount = filteredAttendance.filter(r => r.status === 'present').length
  const absentCount = filteredAttendance.filter(r => r.status === 'absent').length
  const lateCount = filteredAttendance.filter(r => r.status === 'late').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <Button>
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{filteredAttendance.length}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-success-500" />
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-success-600">{presentCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-warning-500" />
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-warning-600">{lateCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <XCircle size={20} className="text-danger-500" />
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-danger-600">{absentCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={departmentOptions}
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{record.employee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.department}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.checkIn || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.checkOut || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.hours ? `${record.hours}h` : '-'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <Badge
                        variant={
                          record.status === 'present' ? 'success' :
                          record.status === 'late' ? 'warning' : 'danger'
                        }
                      >
                        {record.status}
                      </Badge>
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

export default HRAttendance
