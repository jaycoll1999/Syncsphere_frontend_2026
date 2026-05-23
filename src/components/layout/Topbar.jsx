import React, { useState } from 'react'
import { Search, Moon, Sun, LogOut, User as UserIcon, Settings, Menu } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'
import NotificationBell from '../notifications/NotificationBell'
import Avatar from '../shared/Avatar'
import { Link, useNavigate } from 'react-router-dom'

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden mr-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">SyncSphere</h2>
        <div className="hidden lg:flex max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        >
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </button>

        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <Avatar user={user} size="md" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <UserIcon className="mr-3 h-4 w-4" />
                  Profile
                </Link>
                <Link
                  to="/settings/security"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Topbar
