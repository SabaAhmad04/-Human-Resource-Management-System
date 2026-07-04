import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Trash2,
  Megaphone,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'

const Announcements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const mockAnnouncements = [
    {
      id: 1,
      title: 'Company Annual Meeting',
      content: 'We are pleased to announce our annual company meeting scheduled for January 20th, 2024. All employees are required to attend.',
      priority: 'high',
      author: 'HR Department',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'New Remote Work Policy',
      content: 'Starting February 1st, employees can work from home up to 3 days per week. Please review the updated policy document.',
      priority: 'medium',
      author: 'HR Department',
      createdAt: '2024-01-12',
    },
    {
      id: 3,
      title: 'Team Building Event',
      content: 'Join us for a team building event on January 25th! Activities include outdoor games, lunch, and networking opportunities.',
      priority: 'low',
      author: 'Events Team',
      createdAt: '2024-01-10',
    },
    {
      id: 4,
      title: 'System Maintenance',
      content: 'The HRMS system will be under maintenance on January 18th from 10 PM to 2 AM. Please plan accordingly.',
      priority: 'medium',
      author: 'IT Department',
      createdAt: '2024-01-08',
    },
  ]

  const onSubmit = (data) => {
    console.log('Announcement:', data)
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id) => {
    console.log('Delete announcement:', id)
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={18} className="text-danger-500" />
      case 'medium': return <AlertTriangle size={18} className="text-warning-500" />
      default: return <Info size={18} className="text-primary-500" />
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      default: return 'info'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Megaphone size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <Badge variant={getPriorityVariant(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {announcement.author}</span>
                    <span>{format(new Date(announcement.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(announcement.id)}
                className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="text-danger-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Announcement"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Write your announcement..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-danger-600">{errors.content.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-danger-600">{errors.priority.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Announcements
