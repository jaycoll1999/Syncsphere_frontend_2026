import React from 'react'

const LoadingSpinner = ({ size = 'md', centered = true }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  const spinner = (
    <div className={`animate-spin rounded-full border-t-transparent border-indigo-600 ${sizes[size]}`}></div>
  )

  if (centered) {
    return (
      <div className="flex justify-center items-center h-full w-full min-h-[200px]">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
