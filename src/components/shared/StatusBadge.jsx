import React from 'react'

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.INACTIVE}`}>
      {status}
    </span>
  )
}

export default StatusBadge
