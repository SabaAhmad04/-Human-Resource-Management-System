import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState('jobs')
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const mockJobs = [
    { id: 1, title: 'Senior React Developer', department: 'Engineering', location: 'New York', type: 'Full-time', salary: '$120k - $150k', applications: 24, status: 'active' },
    { id: 2, title: 'Marketing Manager', department: 'Marketing', location: 'San Francisco', type: 'Full-time', salary: '$90k - $110k', applications: 18, status: 'active' },
    { id: 3, title: 'Sales Executive', department: 'Sales', location: 'Chicago', type: 'Full-time', salary: '$60k - $80k', applications: 32, status: 'closed' },
    { id: 4, title: 'UX Designer', department: 'Engineering', location: 'Remote', type: 'Contract', salary: '$100k - $120k', applications: 15, status: 'active' },
  ]

  const mockInterviews = [
    { id: 1, candidate: 'Alex Johnson', position: 'Senior React Developer', date: '2026-01-20', time: '10:00 AM', round: 'Technical', interviewer: 'John Doe', status: 'scheduled' },
    { id: 2, candidate: 'Maria Garcia', position: 'Marketing Manager', date: '2026-01-21', time: '2:00 PM', round: 'HR', interviewer: 'Sarah Smith', status: 'scheduled' },
    { id: 3, candidate: 'James Wilson', position: 'Sales Executive', date: '2026-01-18', time: '11:00 AM', round: 'Final', interviewer: 'Mike Johnson', status: 'completed' },
  ]

  const onJobSubmit = (data) => {
    console.log('Job data:', data)
    setIsJobModalOpen(false)
    reset()
  }

  const onInterviewSubmit = (data) => {
    console.log('Interview data:', data)
    setIsInterviewModalOpen(false)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Openings
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'interviews'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Interviews
          </button>
        </nav>
      </div>

      {activeTab === 'jobs' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setIsJobModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Job Opening
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {mockJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.department}</p>
                  </div>
                  <Badge variant={job.status === 'active' ? 'success' : 'danger'}>
                    {job.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={14} />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={14} />
                    {job.salary}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {job.applications} applications
                  </span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'interviews' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setIsInterviewModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Schedule Interview
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Candidate</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Round</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interviewer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInterviews.map((interview) => (
                    <tr key={interview.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 font-medium text-sm">
                              {interview.candidate.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{interview.candidate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{interview.position}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {format(new Date(interview.date), 'MMM dd, yyyy')} at {interview.time}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{interview.round}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{interview.interviewer}</td>
                      <td className="px-4 py-4">
                        <Badge variant={interview.status === 'scheduled' ? 'info' : 'success'}>
                          {interview.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title="Create Job Opening"
        size="lg"
      >
        <form onSubmit={handleSubmit(onJobSubmit)} className="space-y-4">
          <Input
            label="Job Title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Department"
              error={errors.department?.message}
              {...register('department', { required: 'Department is required' })}
            />
            <Input
              label="Location"
              error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Employment Type"
              error={errors.type?.message}
              {...register('type', { required: 'Type is required' })}
            />
            <Input
              label="Salary Range"
              error={errors.salary?.message}
              {...register('salary', { required: 'Salary is required' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsJobModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      {/* Interview Modal */}
      <Modal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        title="Schedule Interview"
      >
        <form onSubmit={handleSubmit(onInterviewSubmit)} className="space-y-4">
          <Input
            label="Candidate Name"
            error={errors.candidate?.message}
            {...register('candidate', { required: 'Candidate name is required' })}
          />
          <Input
            label="Position"
            error={errors.position?.message}
            {...register('position', { required: 'Position is required' })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              error={errors.date?.message}
              {...register('date', { required: 'Date is required' })}
            />
            <Input
              type="time"
              label="Time"
              error={errors.time?.message}
              {...register('time', { required: 'Time is required' })}
            />
          </div>
          <Input
            label="Interview Round"
            error={errors.round?.message}
            {...register('round', { required: 'Round is required' })}
          />
          <Input
            label="Interviewer"
            error={errors.interviewer?.message}
            {...register('interviewer', { required: 'Interviewer is required' })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Recruitment
