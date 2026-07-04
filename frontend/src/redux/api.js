import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

// Employees
export const getAllEmployees = createAsyncThunk(
  'api/getAllEmployees',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/employees', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees')
    }
  }
)

export const getEmployeeById = createAsyncThunk(
  'api/getEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/employees/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee')
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'api/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/employees/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee')
    }
  }
)

export const deleteEmployee = createAsyncThunk(
  'api/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee')
    }
  }
)

// Attendance
export const checkIn = createAsyncThunk(
  'api/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-in')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed')
    }
  }
)

export const checkOut = createAsyncThunk(
  'api/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-out')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed')
    }
  }
)

export const getMyAttendance = createAsyncThunk(
  'api/getMyAttendance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance')
    }
  }
)

export const getAllAttendance = createAsyncThunk(
  'api/getAllAttendance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance')
    }
  }
)

// Leave
export const applyLeave = createAsyncThunk(
  'api/applyLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await api.post('/leaves', leaveData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply leave')
    }
  }
)

export const getMyLeaves = createAsyncThunk(
  'api/getMyLeaves',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves')
    }
  }
)

export const getAllLeaves = createAsyncThunk(
  'api/getAllLeaves',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves')
    }
  }
)

export const approveLeave = createAsyncThunk(
  'api/approveLeave',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leaves/${id}/approve`, { comments })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve leave')
    }
  }
)

export const rejectLeave = createAsyncThunk(
  'api/rejectLeave',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leaves/${id}/reject`, { comments })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject leave')
    }
  }
)

// Payroll
export const generatePayroll = createAsyncThunk(
  'api/generatePayroll',
  async (payrollData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/generate', payrollData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate payroll')
    }
  }
)

export const getMyPayslips = createAsyncThunk(
  'api/getMyPayslips',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslips')
    }
  }
)

export const getAllPayrolls = createAsyncThunk(
  'api/getAllPayrolls',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payrolls')
    }
  }
)

export const processPayroll = createAsyncThunk(
  'api/processPayroll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payroll/${id}/process`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process payroll')
    }
  }
)

// Departments
export const createDepartment = createAsyncThunk(
  'api/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/departments', departmentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department')
    }
  }
)

export const getAllDepartments = createAsyncThunk(
  'api/getAllDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/departments')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments')
    }
  }
)

export const updateDepartment = createAsyncThunk(
  'api/updateDepartment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/departments/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department')
    }
  }
)

export const deleteDepartment = createAsyncThunk(
  'api/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/departments/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department')
    }
  }
)

// Holidays
export const createHoliday = createAsyncThunk(
  'api/createHoliday',
  async (holidayData, { rejectWithValue }) => {
    try {
      const response = await api.post('/holidays', holidayData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create holiday')
    }
  }
)

export const getAllHolidays = createAsyncThunk(
  'api/getAllHolidays',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/holidays')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch holidays')
    }
  }
)

export const updateHoliday = createAsyncThunk(
  'api/updateHoliday',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/holidays/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update holiday')
    }
  }
)

export const deleteHoliday = createAsyncThunk(
  'api/deleteHoliday',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/holidays/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete holiday')
    }
  }
)

// Announcements
export const createAnnouncement = createAsyncThunk(
  'api/createAnnouncement',
  async (announcementData, { rejectWithValue }) => {
    try {
      const response = await api.post('/announcements', announcementData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create announcement')
    }
  }
)

export const getAllAnnouncements = createAsyncThunk(
  'api/getAllAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/announcements')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements')
    }
  }
)

export const deleteAnnouncement = createAsyncThunk(
  'api/deleteAnnouncement',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/announcements/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete announcement')
    }
  }
)

// Notifications
export const getMyNotifications = createAsyncThunk(
  'api/getMyNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'api/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/${id}/read`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'api/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put('/notifications/read-all')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

// Documents
export const uploadDocument = createAsyncThunk(
  'api/uploadDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document')
    }
  }
)

export const getMyDocuments = createAsyncThunk(
  'api/getMyDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents/my')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents')
    }
  }
)

export const deleteDocument = createAsyncThunk(
  'api/deleteDocument',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document')
    }
  }
)

// Performance
export const createReview = createAsyncThunk(
  'api/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/performance', reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review')
    }
  }
)

export const getMyReviews = createAsyncThunk(
  'api/getMyReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/performance/my')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

export const getAllReviews = createAsyncThunk(
  'api/getAllReviews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/performance', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

// Recruitment
export const createJobOpening = createAsyncThunk(
  'api/createJobOpening',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recruitment/jobs', jobData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job opening')
    }
  }
)

export const getAllJobOpenings = createAsyncThunk(
  'api/getAllJobOpenings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recruitment/jobs')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job openings')
    }
  }
)

export const scheduleInterview = createAsyncThunk(
  'api/scheduleInterview',
  async (interviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recruitment/interviews', interviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule interview')
    }
  }
)

export const getInterviews = createAsyncThunk(
  'api/getInterviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recruitment/interviews')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews')
    }
  }
)

// Dashboard
export const getAdminDashboard = createAsyncThunk(
  'api/getAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/admin')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard')
    }
  }
)

export const getHRDashboard = createAsyncThunk(
  'api/getHRDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/hr')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard')
    }
  }
)

export const getEmployeeDashboard = createAsyncThunk(
  'api/getEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/employee')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard')
    }
  }
)

// Reports
export const getAttendanceReport = createAsyncThunk(
  'api/getAttendanceReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/attendance', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report')
    }
  }
)

export const getPayrollReport = createAsyncThunk(
  'api/getPayrollReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/payroll', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report')
    }
  }
)

export const getEmployeeReport = createAsyncThunk(
  'api/getEmployeeReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/employee', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report')
    }
  }
)

export const getLeaveReport = createAsyncThunk(
  'api/getLeaveReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/leave', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report')
    }
  }
)
