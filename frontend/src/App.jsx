import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth pages
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))

// Employee pages
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'))
const Profile = lazy(() => import('./pages/employee/Profile'))
const Attendance = lazy(() => import('./pages/employee/Attendance'))
const Leaves = lazy(() => import('./pages/employee/Leaves'))
const Payroll = lazy(() => import('./pages/employee/Payroll'))
const Documents = lazy(() => import('./pages/employee/Documents'))

// HR pages
const HRDashboard = lazy(() => import('./pages/hr/Dashboard'))
const HREmployees = lazy(() => import('./pages/hr/Employees'))
const HRAttendance = lazy(() => import('./pages/hr/Attendance'))
const HRLeaves = lazy(() => import('./pages/hr/Leaves'))
const HRPayroll = lazy(() => import('./pages/hr/Payroll'))
const Departments = lazy(() => import('./pages/hr/Departments'))
const Holidays = lazy(() => import('./pages/hr/Holidays'))
const Announcements = lazy(() => import('./pages/hr/Announcements'))
const Recruitment = lazy(() => import('./pages/hr/Recruitment'))
const Performance = lazy(() => import('./pages/hr/Performance'))
const Reports = lazy(() => import('./pages/hr/Reports'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/Users'))
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'))
const AdminPayroll = lazy(() => import('./pages/admin/AdminPayroll'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))

// Landing page
const Landing = lazy(() => import('./pages/Landing'))

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useSelector((state) => state.auth)
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Layout Route
const DashboardRoute = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
)

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={
            <DashboardRoute>
              <EmployeeDashboard />
            </DashboardRoute>
          } />
          <Route path="/employee/profile" element={
            <DashboardRoute>
              <Profile />
            </DashboardRoute>
          } />
          <Route path="/employee/attendance" element={
            <DashboardRoute>
              <Attendance />
            </DashboardRoute>
          } />
          <Route path="/employee/leaves" element={
            <DashboardRoute>
              <Leaves />
            </DashboardRoute>
          } />
          <Route path="/employee/payroll" element={
            <DashboardRoute>
              <Payroll />
            </DashboardRoute>
          } />
          <Route path="/employee/documents" element={
            <DashboardRoute>
              <Documents />
            </DashboardRoute>
          } />
          
          {/* HR Routes */}
          <Route path="/hr/dashboard" element={
            <DashboardRoute>
              <HRDashboard />
            </DashboardRoute>
          } />
          <Route path="/hr/employees" element={
            <DashboardRoute>
              <HREmployees />
            </DashboardRoute>
          } />
          <Route path="/hr/attendance" element={
            <DashboardRoute>
              <HRAttendance />
            </DashboardRoute>
          } />
          <Route path="/hr/leaves" element={
            <DashboardRoute>
              <HRLeaves />
            </DashboardRoute>
          } />
          <Route path="/hr/payroll" element={
            <DashboardRoute>
              <HRPayroll />
            </DashboardRoute>
          } />
          <Route path="/hr/departments" element={
            <DashboardRoute>
              <Departments />
            </DashboardRoute>
          } />
          <Route path="/hr/holidays" element={
            <DashboardRoute>
              <Holidays />
            </DashboardRoute>
          } />
          <Route path="/hr/announcements" element={
            <DashboardRoute>
              <Announcements />
            </DashboardRoute>
          } />
          <Route path="/hr/recruitment" element={
            <DashboardRoute>
              <Recruitment />
            </DashboardRoute>
          } />
          <Route path="/hr/performance" element={
            <DashboardRoute>
              <Performance />
            </DashboardRoute>
          } />
          <Route path="/hr/reports" element={
            <DashboardRoute>
              <Reports />
            </DashboardRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardRoute>
                <AdminDashboard />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardRoute>
                <UserManagement />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardRoute>
                <AdminDepartments />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/payroll" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardRoute>
                <AdminPayroll />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardRoute>
                <AdminReports />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
