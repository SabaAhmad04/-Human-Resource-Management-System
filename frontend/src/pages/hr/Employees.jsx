import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Mail,
  Phone,
  Building2
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'

const HREmployees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const mockEmployees = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', phone: '+1 555-1234', department: 'Engineering', position: 'Senior Developer', status: 'active' },
    { id: 2, firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@company.com', phone: '+1 555-5678', department: 'Marketing', position: 'Marketing Manager', status: 'active' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.j@company.com', phone: '+1 555-9012', department: 'Sales', position: 'Sales Executive', status: 'active' },
    { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.d@company.com', phone: '+1 555-3456', department: 'HR', position: 'HR Specialist', status: 'active' },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.w@company.com', phone: '+1 555-7890', department: 'Finance', position: 'Financial Analyst', status: 'inactive' },
  ]

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
  ]

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'hr_manager', label: 'HR Manager' },
  ]

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const onSubmit = (data) => {
    console.log('New employee:', data)
    setIsModalOpen(false)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={[{ value: 'all', label: 'All Departments' }, ...departmentOptions]}
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          />
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </div>
              </div>
              <Badge variant={employee.status === 'active' ? 'success' : 'danger'}>
                {employee.status}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                {employee.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={14} />
                {employee.department}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button variant="ghost" size="sm">
                <Eye size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50">
                <Trash2 size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Employee"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last Name"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Phone"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone is required' })}
          />
          <Select
            label="Department"
            options={departmentOptions}
            error={errors.department?.message}
            {...register('department', { required: 'Department is required' })}
          />
          <Input
            label="Position"
            error={errors.position?.message}
            {...register('position', { required: 'Position is required' })}
          />
          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role', { required: 'Role is required' })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default HREmployees
