import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const Performance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterEmployee, setFilterEmployee] = useState('all')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const mockReviews = [
    { id: 1, employee: 'John Doe', period: 'Q4 2023', rating: 4.5, strengths: 'Strong technical skills, great team player', improvements: 'Could improve on documentation', reviewer: 'Sarah Smith', status: 'completed' },
    { id: 2, employee: 'Sarah Smith', period: 'Q4 2023', rating: 4.8, strengths: 'Excellent leadership, strategic thinking', improvements: 'Needs to delegate more', reviewer: 'Mike Johnson', status: 'completed' },
    { id: 3, employee: 'Mike Johnson', period: 'Q4 2023', rating: 4.2, strengths: 'Great client relationships, consistent performer', improvements: 'Time management could be better', reviewer: 'Emily Davis', status: 'completed' },
    { id: 4, employee: 'Emily Davis', period: 'Q1 2026', rating: null, strengths: '', improvements: '', reviewer: 'David Wilson', status: 'pending' },
  ]

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Sarah Smith', label: 'Sarah Smith' },
    { value: 'Mike Johnson', label: 'Mike Johnson' },
    { value: 'Emily Davis', label: 'Emily Davis' },
  ]

  const filteredReviews = filterEmployee === 'all'
    ? mockReviews
    : mockReviews.filter(r => r.employee === filterEmployee)

  const onSubmit = (data) => {
    console.log('Review data:', data)
    setIsModalOpen(false)
    reset()
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'text-warning-400 fill-warning-400' : 'text-gray-300'}
        />
      )
    }
    return stars
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Review
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Reviews</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Star size={24} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="w-full sm:w-64">
        <Select
          options={employeeOptions}
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        />
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {review.employee.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{review.employee}</h3>
                  <p className="text-sm text-gray-600">{review.period}</p>
                </div>
              </div>
              <Badge variant={review.status === 'completed' ? 'success' : 'warning'}>
                {review.status}
              </Badge>
            </div>

            {review.rating && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="font-medium text-gray-900">{review.rating}</span>
                </div>
              </div>
            )}

            {review.strengths && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Strengths</p>
                <p className="text-sm text-gray-600">{review.strengths}</p>
              </div>
            )}

            {review.improvements && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Areas for Improvement</p>
                <p className="text-sm text-gray-600">{review.improvements}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 text-sm text-gray-600">
              Reviewed by {review.reviewer}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Performance Review"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Employee"
            options={employeeOptions.slice(1)}
            error={errors.employee?.message}
            {...register('employee', { required: 'Employee is required' })}
          />
          <Input
            label="Review Period"
            placeholder="e.g., Q1 2026"
            error={errors.period?.message}
            {...register('period', { required: 'Period is required' })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              {...register('rating', { required: 'Rating is required', min: 1, max: 5 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-danger-600">{errors.rating.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strengths</label>
            <textarea
              {...register('strengths', { required: 'Strengths are required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.strengths && (
              <p className="mt-1 text-sm text-danger-600">{errors.strengths.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Areas for Improvement</label>
            <textarea
              {...register('improvements', { required: 'Areas for improvement are required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.improvements && (
              <p className="mt-1 text-sm text-danger-600">{errors.improvements.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Performance
