import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Users
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'

const AdminDepartments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  const mockDepartments = [
    { id: 1, name: 'Engineering', head: 'John Doe', employees: 85, budget: '$2.5M', description: 'Software development and technical operations' },
    { id: 2, name: 'Marketing', head: 'Sarah Smith', employees: 42, budget: '$1.2M', description: 'Brand management and marketing campaigns' },
    { id: 3, name: 'Sales', head: 'Mike Johnson', employees: 38, budget: '$1.8M', description: 'Sales operations and client relations' },
    { id: 4, name: 'HR', head: 'Emily Davis', employees: 25, budget: '$800K', description: 'Human resources and talent management' },
    { id: 5, name: 'Finance', head: 'David Wilson', employees: 32, budget: '$1M', description: 'Financial planning and accounting' },
    { id: 6, name: 'Operations', head: 'Lisa Brown', employees: 26, budget: '$900K', description: 'Business operations and logistics' },
  ]

  const onSubmit = (data) => {
    console.log('Department data:', data)
    setIsModalOpen(false)
    setEditingDepartment(null)
    reset()
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setValue('name', department.name)
    setValue('head', department.head)
    setValue('budget', department.budget)
    setValue('description', department.description)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    console.log('Delete department:', id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Department
        </Button>
      </div>

      {/* Department Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDepartments.map((department) => (
          <motion.div
            key={department.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-primary-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(department)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-danger-600" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{department.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{department.description}</p>
            
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Head</span>
                <span className="font-medium text-gray-900">{department.head}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Employees</span>
                <span className="font-medium text-gray-900">{department.employees}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Budget</span>
                <span className="font-medium text-gray-900">{department.budget}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
          reset()
        }}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Department Name"
            error={errors.name?.message}
            {...register('name', { required: 'Department name is required' })}
          />
          <Input
            label="Department Head"
            error={errors.head?.message}
            {...register('head', { required: 'Department head is required' })}
          />
          <Input
            label="Budget"
            error={errors.budget?.message}
            {...register('budget', { required: 'Budget is required' })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingDepartment(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingDepartment ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminDepartments
