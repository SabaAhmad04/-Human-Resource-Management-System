import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  PartyPopper
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'

const Holidays = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  const mockHolidays = [
    { id: 1, name: 'New Year\'s Day', date: '2026-01-01', type: 'National Holiday' },
    { id: 2, name: 'Republic Day', date: '2026-01-26', type: 'National Holiday' },
    { id: 3, name: 'Holi', date: '2026-03-25', type: 'Festival' },
    { id: 4, name: 'Good Friday', date: '2026-03-29', type: 'Optional Holiday' },
    { id: 5, name: 'Independence Day', date: '2026-08-15', type: 'National Holiday' },
    { id: 6, name: 'Gandhi Jayanti', date: '2026-10-02', type: 'National Holiday' },
    { id: 7, name: 'Diwali', date: '2026-11-01', type: 'Festival' },
    { id: 8, name: 'Christmas', date: '2026-12-25', type: 'Optional Holiday' },
  ]

  const onSubmit = (data) => {
    console.log('Holiday data:', data)
    setIsModalOpen(false)
    setEditingHoliday(null)
    reset()
  }

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday)
    setValue('name', holiday.name)
    setValue('date', holiday.date)
    setValue('type', holiday.type)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    console.log('Delete holiday:', id)
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'National Holiday': return 'bg-primary-100 text-primary-700'
      case 'Festival': return 'bg-success-100 text-success-700'
      case 'Optional Holiday': return 'bg-warning-100 text-warning-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Holiday
        </Button>
      </div>

      {/* Holiday Calendar View */}
      <Card title="Holiday Calendar 2026">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockHolidays.map((holiday) => (
            <motion.div
              key={holiday.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <PartyPopper size={18} className="text-primary-600" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-danger-600" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{holiday.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {format(new Date(holiday.date), 'EEEE, MMMM dd, yyyy')}
              </p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                {holiday.type}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Holiday List */}
      <Card title="Holiday List">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockHolidays.map((holiday) => (
                <tr key={holiday.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{holiday.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(holiday.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {format(new Date(holiday.date), 'EEEE')}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                      {holiday.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(holiday)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(holiday.id)}
                        className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-danger-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Holiday Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingHoliday(null)
          reset()
        }}
        title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Holiday Name"
            error={errors.name?.message}
            {...register('name', { required: 'Holiday name is required' })}
          />
          <Input
            type="date"
            label="Date"
            error={errors.date?.message}
            {...register('date', { required: 'Date is required' })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              {...register('type', { required: 'Type is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select type</option>
              <option value="National Holiday">National Holiday</option>
              <option value="Festival">Festival</option>
              <option value="Optional Holiday">Optional Holiday</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-danger-600">{errors.type.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingHoliday(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingHoliday ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Holidays
