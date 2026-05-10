import React from 'react'

const SlideOver = ({ isOpen, onClose, title, children }) => {
  return (
    <div className={`absolute inset-y-0 right-0 max-w-full flex transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-40`}>
      <div className="w-screen max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col border-l border-gray-200 dark:border-gray-700">
        <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              {title && <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>}
            </div>
            <div className="h-7 flex items-center">
              <button
                type="button"
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex-1 py-6 px-4 sm:px-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SlideOver
