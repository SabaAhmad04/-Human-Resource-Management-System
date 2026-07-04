import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

const StatsCard = ({ icon: Icon, value, label, trend, trendValue, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div className={clsx('p-3 rounded-lg', colors[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              trend === 'up' ? 'text-success-600' : 'text-danger-600'
            )}
          >
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

export default StatsCard
