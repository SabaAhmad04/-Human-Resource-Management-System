import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Clock,
  Calendar,
  Briefcase,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const HRDashboard = () => {
  const stats = [
    { icon: Users, value: '248', label: 'Total Employees', color: 'primary', trend: 'up', trendValue: '+12%' },
    { icon: UserCheck, value: '215', label: 'Present Today', color: 'success', trend: 'up', trendValue: '+5%' },
    { icon: Calendar, value: '18', label: 'Pending Leaves', color: 'warning' },
    { icon: Briefcase, value: '12', label: 'Open Positions', color: 'danger' },
  ]

  const attendanceData = [
    { name: 'Mon', present: 180, absent: 20, late: 15 },
    { name: 'Tue', present: 185, absent: 15, late: 18 },
    { name: 'Wed', present: 190, absent: 12, late: 12 },
    { name: 'Thu', present: 178, absent: 22, late: 20 },
    { name: 'Fri', present: 195, absent: 10, late: 8 },
  ]

  const departmentData = [
    { name: 'Engineering', value: 85, color: '#3b82f6' },
    { name: 'Marketing', value: 42, color: '#22c55e' },
    { name: 'Sales', value: 38, color: '#f59e0b' },
    { name: 'HR', value: 25, color: '#ef4444' },
    { name: 'Finance', value: 32, color: '#8b5cf6' },
  ]

  const recentLeaves = [
    { id: 1, employee: 'John Doe', type: 'Sick Leave', days: 3, status: 'pending' },
    { id: 2, employee: 'Sarah Smith', type: 'Casual Leave', days: 1, status: 'pending' },
    { id: 3, employee: 'Mike Johnson', type: 'Paid Leave', days: 5, status: 'approved' },
  ]

  const announcements = [
    { id: 1, title: 'Company Annual Meeting', date: '2026-01-20', priority: 'high' },
    { id: 2, title: 'New Policy Updates', date: '2026-01-18', priority: 'medium' },
    { id: 3, title: 'Team Building Event', date: '2026-01-25', priority: 'low' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
        <Button>Generate Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Overview Chart */}
        <Card title="Attendance Overview" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
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
        </Card>

        {/* Department Distribution */}
        <Card title="Department Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                <span className="text-sm text-gray-600">{dept.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card title="Recent Leave Requests">
          <div className="space-y-4">
            {recentLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {leave.employee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{leave.employee}</p>
                    <p className="text-sm text-gray-600">{leave.type} • {leave.days} day(s)</p>
                  </div>
                </div>
                <Badge variant={leave.status === 'pending' ? 'warning' : 'success'}>
                  {leave.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card title="Recent Announcements">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-sm text-gray-600">{announcement.date}</p>
                  </div>
                  <Badge variant={
                    announcement.priority === 'high' ? 'danger' :
                    announcement.priority === 'medium' ? 'warning' : 'info'
                  }>
                    {announcement.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default HRDashboard
