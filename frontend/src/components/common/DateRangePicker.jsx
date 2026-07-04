import React from 'react'
import Input from './Input'

const DateRangePicker = ({ startDate, endDate, onStartChange, onEndChange, label }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          type="date"
          label={label ? `${label} (From)` : 'From Date'}
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Input
          type="date"
          label={label ? `${label} (To)` : 'To Date'}
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default DateRangePicker
