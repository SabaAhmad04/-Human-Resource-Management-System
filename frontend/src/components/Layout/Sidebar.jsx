import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Wallet,
  FileText,
  Building2,
  PartyPopper,
  Megaphone,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  X,
  User
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getMenuItems = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'Payroll', path: '/admin/payroll', icon: Wallet },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        ]
      case 'hr_manager':
        return [
          { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
          { name: 'Employees', path: '/hr/employees', icon: Users },
          { name: 'Attendance', path: '/hr/attendance', icon: Clock },
          { name: 'Leaves', path: '/hr/leaves', icon: Calendar },
          { name: 'Payroll', path: '/hr/payroll', icon: Wallet },
          { name: 'Departments', path: '/hr/departments', icon: Building2 },
          { name: 'Holidays', path: '/hr/holidays', icon: PartyPopper },
          { name: 'Announcements', path: '/hr/announcements', icon: Megaphone },
          { name: 'Recruitment', path: '/hr/recruitment', icon: Briefcase },
          { name: 'Performance', path: '/hr/performance', icon: BarChart3 },
          { name: 'Reports', path: '/hr/reports', icon: FileText },
        ]
      default:
        return [
          { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
          { name: 'Profile', path: '/employee/profile', icon: User },
          { name: 'Attendance', path: '/employee/attendance', icon: Clock },
          { name: 'Leaves', path: '/employee/leaves', icon: Calendar },
          { name: 'Payroll', path: '/employee/payroll', icon: Wallet },
          { name: 'Documents', path: '/employee/documents', icon: FileText },
        ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 w-64',
          'lg:translate-x-0 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HRMS</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-danger-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
