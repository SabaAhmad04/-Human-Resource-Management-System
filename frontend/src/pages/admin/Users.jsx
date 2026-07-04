import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', role: 'employee', department: 'Engineering', status: 'active', lastLogin: '2026-01-15 09:00 AM' },
    { id: 2, firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@company.com', role: 'hr_manager', department: 'HR', status: 'active', lastLogin: '2026-01-15 08:45 AM' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.j@company.com', role: 'employee', department: 'Sales', status: 'active', lastLogin: '2026-01-14 05:30 PM' },
    { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.d@company.com', role: 'employee', department: 'HR', status: 'active', lastLogin: '2026-01-15 09:15 AM' },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.w@company.com', role: 'super_admin', department: 'Administration', status: 'active', lastLogin: '2026-01-15 08:00 AM' },
    { id: 6, firstName: 'Lisa', lastName: 'Brown', email: 'lisa.b@company.com', role: 'employee', department: 'Engineering', status: 'inactive', lastLogin: '2026-01-10 04:00 PM' },
  ]

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'employee', label: 'Employee' },
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return <Badge variant="danger">Super Admin</Badge>
      case 'hr_manager': return <Badge variant="warning">HR Manager</Badge>
      default: return <Badge variant="info">Employee</Badge>
    }
  }

  const handleRoleChange = (userId, newRole) => {
    console.log('Change role:', userId, newRole)
  }

  const handleToggleStatus = (userId) => {
    console.log('Toggle status:', userId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{mockUsers.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-xl font-bold text-gray-900">
                {mockUsers.filter(u => u.role === 'super_admin').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">HR Managers</p>
              <p className="text-xl font-bold text-gray-900">
                {mockUsers.filter(u => u.role === 'hr_manager').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <UserX size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-gray-900">
                {mockUsers.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={roleOptions}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{user.department}</td>
                  <td className="px-4 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{user.lastLogin}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="employee">Employee</option>
                        <option value="hr_manager">HR Manager</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <Button
                        variant={user.status === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </Button>
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

export default UserManagement
