import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
            error ? 'border-danger-500' : 'border-gray-300',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
