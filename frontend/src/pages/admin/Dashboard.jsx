import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Building2,
  Wallet,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Server
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'

const AdminDashboard = () => {
  const stats = [
    { icon: Users, value: '248', label: 'Total Employees', color: 'primary', trend: 'up', trendValue: '+12%' },
    { icon: Building2, value: '12', label: 'Departments', color: 'success' },
    { icon: Wallet, value: '$1.2M', label: 'Monthly Payroll', color: 'warning', trend: 'up', trendValue: '+8%' },
    { icon: Activity, value: '99.9%', label: 'System Uptime', color: 'success' },
  ]

  const revenueData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 5000, profit: 3800 },
    { name: 'Apr', revenue: 4500, profit: 3090 },
    { name: 'May', revenue: 6000, profit: 4300 },
    { name: 'Jun', revenue: 5500, profit: 3800 },
  ]

  const departmentData = [
    { name: 'Engineering', employees: 85 },
    { name: 'Marketing', employees: 42 },
    { name: 'Sales', employees: 38 },
    { name: 'HR', employees: 25 },
    { name: 'Finance', employees: 32 },
    { name: 'Operations', employees: 26 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card title="Revenue Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card title="Department Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card title="System Health">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Server size={20} className="text-success-600" />
                <span className="font-medium text-gray-900">API Server</span>
              </div>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-success-600" />
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-success-600" />
                <span className="font-medium text-gray-900">Cache</span>
              </div>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Server size={20} className="text-warning-600" />
                <span className="font-medium text-gray-900">Storage</span>
              </div>
              <span className="text-warning-600 font-medium">78% Used</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {[
              { action: 'New employee added', user: 'HR Admin', time: '2 minutes ago', type: 'user' },
              { action: 'Payroll processed', user: 'Finance', time: '15 minutes ago', type: 'payroll' },
              { action: 'Leave approved', user: 'HR Manager', time: '1 hour ago', type: 'leave' },
              { action: 'Department updated', user: 'Admin', time: '2 hours ago', type: 'department' },
              { action: 'System backup completed', user: 'System', time: '6 hours ago', type: 'system' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Activity size={14} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
