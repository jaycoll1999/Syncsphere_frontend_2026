import React from 'react'

const Timeline = ({ items }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${item.color || 'bg-gray-400'}`}>
                    {item.icon && <item.icon className="w-5 h-5 text-white" aria-hidden="true" />}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{item.label}</p>
                    {item.subtext && (
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.subtext}</p>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    <time>{item.timestamp}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Timeline
