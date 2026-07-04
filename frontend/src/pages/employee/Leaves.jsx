import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'

const Leaves = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const leaveBalances = [
    { type: 'Sick Leave', total: 12, used: 3, remaining: 9 },
    { type: 'Casual Leave', total: 15, used: 5, remaining: 10 },
    { type: 'Paid Leave', total: 10, used: 2, remaining: 8 },
  ]

  const mockLeaves = [
    { id: 1, type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-22', days: 3, reason: 'Feeling unwell', status: 'pending' },
    { id: 2, type: 'Casual Leave', startDate: '2024-01-15', endDate: '2024-01-15', days: 1, reason: 'Personal work', status: 'approved' },
    { id: 3, type: 'Paid Leave', startDate: '2024-01-10', endDate: '2024-01-12', days: 3, reason: 'Family vacation', status: 'approved' },
    { id: 4, type: 'Sick Leave', startDate: '2024-01-05', endDate: '2024-01-06', days: 2, reason: 'Medical appointment', status: 'rejected' },
  ]

  const leaveTypeOptions = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'paid', label: 'Paid Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ]

  const filteredLeaves = filterStatus === 'all'
    ? mockLeaves
    : mockLeaves.filter(leave => leave.status === filterStatus)

  const onSubmit = (data) => {
    console.log('Leave request:', data)
    setIsModalOpen(false)
    reset()
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leaves</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Apply Leave
        </Button>
      </div>

      {/* Leave Balances */}
      <div className="grid md:grid-cols-3 gap-4">
        {leaveBalances.map((leave, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{leave.type}</h3>
              <Badge variant={leave.remaining > 5 ? 'success' : 'warning'}>
                {leave.remaining} remaining
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{leave.total} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">{leave.used} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(leave.used / leave.total) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaves Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">End Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Days</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{leave.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(leave.startDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{leave.days}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{leave.reason}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Leave Type"
            options={leaveTypeOptions}
            error={errors.leaveType?.message}
            {...register('leaveType', { required: 'Leave type is required' })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Start date is required' })}
            />
            <Input
              type="date"
              label="End Date"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'End date is required' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              {...register('reason', { required: 'Reason is required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter reason for leave"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-danger-600">{errors.reason.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Leaves
