import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Upload,
  FileText,
  Download,
  Trash2,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'

const Documents = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const mockDocuments = [
    { id: 1, name: 'Resume_2024.pdf', type: 'PDF', size: '245 KB', uploadedAt: '2024-01-15', category: 'Resume' },
    { id: 2, name: 'ID_Proof.pdf', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-01-10', category: 'Identity' },
    { id: 3, name: 'Experience_Letter.pdf', type: 'PDF', size: '320 KB', uploadedAt: '2024-01-05', category: 'Experience' },
    { id: 4, name: 'Photo.jpg', type: 'Image', size: '890 KB', uploadedAt: '2023-12-28', category: 'Photo' },
    { id: 5, name: 'Salary_Slip_Dec.xlsx', type: 'Excel', size: '156 KB', uploadedAt: '2023-12-25', category: 'Payroll' },
  ]

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={24} className="text-danger-500" />
      case 'Image': return <Image size={24} className="text-primary-500" />
      case 'Excel': return <FileSpreadsheet size={24} className="text-success-500" />
      default: return <File size={24} className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.category}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{doc.size}</span>
                  <span>{format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button variant="ghost" size="sm">
                <Download size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50">
                <Trash2 size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {mockDocuments.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No documents uploaded"
          description="Upload your important documents to keep them organized."
          actionLabel="Upload Document"
          onAction={() => setIsUploadModalOpen(true)}
        />
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter document name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select category</option>
              <option value="resume">Resume</option>
              <option value="identity">Identity</option>
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, XLSX up to 10MB</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUploadModalOpen(false)}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Documents
