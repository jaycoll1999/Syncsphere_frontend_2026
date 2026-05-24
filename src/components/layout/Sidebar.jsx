import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart2,
  Users,
  CalendarDays,
  ListChecks,
  FileText,
  Wallet,
  Palmtree,
  Bell,
  User,
  Lock,
  Activity,
  Shield,
  UsersRound,
  Mail,
  MessageSquare,
  ShieldCheck,
  Settings,
  FileBarChart,
  ChevronDown,
  Layout as LayoutIcon,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const { user } = useAuthStore()
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
  const [expandedLinks, setExpandedLinks] = useState({})

  const toggleExpand = (label) => {
    setExpandedLinks((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const links = isAdmin
    ? [
        { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
        { icon: ListChecks, label: 'Events', path: '/events' },
        { icon: Palmtree, label: 'Holidays', path: '/holidays' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: UsersRound, label: 'Users', path: '/admin/users' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'System settings', path: '/admin/settings' },
        { icon: FileText, label: 'Leave', path: '/leave' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
        { icon: ListChecks, label: 'Events', path: '/events' },
        {
          icon: FileText,
          label: 'Leave',
          path: '/leave',
          subLinks: [
            { icon: Wallet, label: 'Leave Balance', path: '/leave/balance' },
          ],
        },
        {
          icon: Palmtree,
          label: 'Holidays',
          path: '/holidays',
          subLinks: [
            { icon: CalendarDays, label: 'Calendar View', path: '/holidays/calendar' },
          ],
        },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        {
          icon: User,
          label: 'Profile',
          path: '/profile',
          subLinks: [
            { icon: Lock, label: 'Security', path: '/settings/security' },
            { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
            { icon: Activity, label: 'Activity log', path: '/profile/activity' },
          ],
        },
      ]

  const renderLink = (link) => {
    const isExpanded = expandedLinks[link.label]
    const hasSubLinks = link.subLinks && link.subLinks.length > 0

    return (
      <div key={link.path}>
        {hasSubLinks ? (
          <button
            onClick={() => toggleExpand(link.label)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
            <ChevronDown className={`ml-auto h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <NavLink
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </NavLink>
        )}

        {hasSubLinks && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {link.subLinks.map((subLink) => (
              <NavLink
                key={subLink.path}
                to={subLink.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <subLink.icon className="mr-3 h-4 w-4" />
                {subLink.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with Close Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SyncSphere</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => renderLink(link))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
