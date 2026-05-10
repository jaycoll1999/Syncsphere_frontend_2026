import React, { useState } from 'react'
import { Bell, Mail, Calendar, FileText, Shield } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import { Link } from 'react-router-dom'

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)

  const lastTen = notifications.slice(0, 10)

  const getIcon = (type) => {
    switch (type) {
      case 'LEAVE': return FileText
      case 'EVENT': return Calendar
      case 'SYSTEM': return Shield
      default: return Bell
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 focus:outline-none"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {lastTen.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              lastTen.map((n) => {
                const Icon = getIcon(n.type)
                return (
                  <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 flex items-start space-x-3 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full flex-shrink-0">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.timeAgo}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link to="/notifications" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400" onClick={() => setIsOpen(false)}>
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
