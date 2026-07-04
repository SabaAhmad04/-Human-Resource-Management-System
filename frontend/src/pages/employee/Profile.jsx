import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  Edit,
  Plus,
  X
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('about')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [skills, setSkills] = useState(['React', 'JavaScript', 'Node.js', 'Python'])

  const profile = {
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    manager: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    location: 'New York, USA',
    about: 'Passionate software developer with 5+ years of experience in building scalable web applications.',
    interests: 'Coding, hiking, photography, and playing guitar.',
    dob: '1995-05-15',
    address: '123 Main Street, New York, NY 10001',
    nationality: 'American',
    gender: 'Male',
    maritalStatus: 'Single',
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'Chase Bank',
      ifsc: 'CHAS0001234'
    }
  }

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'Resume' },
    { id: 'private', label: 'Private Info' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 text-3xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    {profile.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={16} />
                    {profile.department}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {profile.location}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                  <p className="text-gray-600">{profile.about}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Manager</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profile.manager}</p>
                      <p className="text-sm text-gray-600">Department Head</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">What I love about my job</h3>
                  <p className="text-gray-600">Working with a talented team to build innovative solutions that make a difference.</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">My interests and hobbies</h3>
                  <p className="text-gray-600">{profile.interests}</p>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="text-center py-8">
                <p className="text-gray-600">No resume uploaded yet.</p>
                <Button className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Upload Resume
                </Button>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Date of Birth</h3>
                    <p className="text-gray-600">{profile.dob}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Nationality</h3>
                    <p className="text-gray-600">{profile.nationality}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Gender</h3>
                    <p className="text-gray-600">{profile.gender}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Marital Status</h3>
                    <p className="text-gray-600">{profile.maritalStatus}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Address</h3>
                  <p className="text-gray-600">{profile.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Bank Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="font-medium text-gray-900">{profile.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-900">{profile.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IFSC Code</p>
                        <p className="font-medium text-gray-900">{profile.bankDetails.ifsc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Skills */}
          <Card title="Skills">
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                  <span className="text-sm text-gray-700">{skill}</span>
                  <button
                    onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Plus size={14} className="mr-1" />
              Add Skill
            </Button>
          </Card>

          {/* Certifications */}
          <Card title="Certifications">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">AWS Certified Developer</p>
                <p className="text-sm text-gray-600">Amazon Web Services • 2023</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Google Cloud Professional</p>
                <p className="text-sm text-gray-600">Google • 2022</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                defaultValue={profile.firstName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                defaultValue={profile.lastName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              defaultValue={profile.phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              defaultValue={profile.address}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Profile
