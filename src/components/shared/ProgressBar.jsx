import React from 'react'

const ProgressBar = ({ value, color = 'blue', label }) => {
  const colors = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  }

  const bgColors = {
    green: 'bg-green-100 dark:bg-green-900/30',
    amber: 'bg-amber-100 dark:bg-amber-900/30',
    red: 'bg-red-100 dark:bg-red-900/30',
    blue: 'bg-blue-100 dark:bg-blue-900/30',
  }

  return (
    <div className="w-full">
      {(label || value !== undefined) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {value !== undefined && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}%</span>}
        </div>
      )}
      <div className={`w-full ${bgColors[color]} rounded-full h-2.5`}>
        <div
          className={`${colors[color]} h-2.5 rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
