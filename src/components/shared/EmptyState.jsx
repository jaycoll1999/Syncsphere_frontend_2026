import React from 'react'

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
      {Icon && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState
