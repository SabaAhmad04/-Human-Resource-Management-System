import React from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <Loader2
        size={sizes[size]}
        className="animate-spin text-primary-600"
      />
    </div>
  )
}

export const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

export const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
    <LoadingSpinner size="lg" />
  </div>
)

export default LoadingSpinner
