import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Clock,
  Calendar,
  Bell,
  LogIn,
  LogOut,
  FileText,
  PartyPopper,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const EmployeeDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const mockAttendance = [
    { date: '2024-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9, status: 'present' },
    { date: '2024-01-14', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: 9.25, status: 'present' },
    { date: '2024-01-13', checkIn: '10:00 AM', checkOut: '06:00 PM', hours: 8, status: 'late' },
    { date: '2024-01-12', checkIn: null, checkOut: null, hours: 0, status: 'absent' },
    { date: '2024-01-11', checkIn: '08:55 AM', checkOut: '05:55 PM', hours: 9, status: 'present' },
  ]

  const mockHolidays = [
    { name: 'Republic Day', date: '2024-01-26', type: 'National Holiday' },
    { name: 'Holi', date: '2024-03-25', type: 'Festival' },
    { name: 'Good Friday', date: '2024-03-29', type: 'Optional Holiday' },
  ]

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
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-primary-100">
              {format(currentTime, 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'hh:mm:ss a')}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/employee/attendance"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogIn size={18} />
              Check In
            </Link>
            <Link
              to="/employee/leaves"
              className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText size={18} />
              Apply Leave
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Clock}
          value="09:00 AM"
          label="Today's Check-in"
          color="primary"
        />
        <StatsCard
          icon={Calendar}
          value="2"
          label="Pending Leaves"
          color="warning"
        />
        <StatsCard
          icon={Bell}
          value="3"
          label="Unread Notifications"
          color="danger"
        />
        <StatsCard
          icon={PartyPopper}
          value="1"
          label="Upcoming Holiday"
          color="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Attendance */}
        <div className="lg:col-span-2">
          <Card title="Recent Attendance">
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
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.checkIn || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.checkOut || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.hours}h</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="capitalize text-sm">{record.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Upcoming Holidays */}
        <Card title="Upcoming Holidays">
          <div className="space-y-4">
            {mockHolidays.map((holiday, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <PartyPopper size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{holiday.name}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(holiday.date), 'MMM dd, yyyy')}
                  </p>
                  <Badge variant="info" size="sm">{holiday.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeDashboard
