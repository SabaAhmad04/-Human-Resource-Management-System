import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  LogIn,
  LogOut,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInTime(new Date())
  }

  const handleCheckOut = () => {
    setIsCheckedIn(false)
    setCheckInTime(null)
  }

  const mockAttendance = [
    { date: '2024-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9, status: 'present' },
    { date: '2024-01-14', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: 9.25, status: 'present' },
    { date: '2024-01-13', checkIn: '10:00 AM', checkOut: '06:00 PM', hours: 8, status: 'late' },
    { date: '2024-01-12', checkIn: null, checkOut: null, hours: 0, status: 'absent' },
    { date: '2024-01-11', checkIn: '08:55 AM', checkOut: '05:55 PM', hours: 9, status: 'present' },
    { date: '2024-01-10', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9, status: 'present' },
    { date: '2024-01-09', checkIn: '08:50 AM', checkOut: '05:50 PM', hours: 9, status: 'present' },
  ]

  const monthlyStats = {
    present: 18,
    absent: 2,
    late: 3,
    total: 23,
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} className="text-success-500" />
      case 'late': return <AlertCircle size={16} className="text-warning-500" />
      case 'absent': return <XCircle size={16} className="text-danger-500" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Check In/Out Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-primary-200 flex items-center justify-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {format(currentTime, 'hh:mm')}
                </p>
                <p className="text-sm text-gray-600">{format(currentTime, 'a')}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              {format(currentTime, 'EEEE, MMMM do, yyyy')}
            </p>
            
            {!isCheckedIn ? (
              <Button onClick={handleCheckIn} className="w-full" size="lg">
                <LogIn size={20} className="mr-2" />
                Check In
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-success-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-success-700">
                    <CheckCircle size={20} />
                    <span className="font-medium">Checked In</span>
                  </div>
                  <p className="text-sm text-success-600 mt-1">
                    at {format(checkInTime, 'hh:mm a')}
                  </p>
                </div>
                <Button onClick={handleCheckOut} variant="danger" className="w-full" size="lg">
                  <LogOut size={20} className="mr-2" />
                  Check Out
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Monthly Stats */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-success-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-success-700">{monthlyStats.present}</p>
              <p className="text-sm text-success-600">Present</p>
            </div>
            <div className="p-4 bg-danger-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-danger-700">{monthlyStats.absent}</p>
              <p className="text-sm text-danger-600">Absent</p>
            </div>
            <div className="p-4 bg-warning-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-warning-700">{monthlyStats.late}</p>
              <p className="text-sm text-warning-600">Late</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary-700">{monthlyStats.total}</p>
              <p className="text-sm text-primary-600">Total Days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance History */}
      <Card title="Attendance History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.checkIn || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.checkOut || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{record.hours}h</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <Badge
                        variant={
                          record.status === 'present' ? 'success' :
                          record.status === 'late' ? 'warning' : 'danger'
                        }
                        size="sm"
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

export default Attendance
