import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, FileText, User, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const MobileNav = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN'

  const links = [
    isAdmin
      ? { icon: Shield, label: 'Admin', path: '/admin' }
      : { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
    { icon: FileText, label: 'Leave', path: '/leave' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 flex items-center justify-around z-30">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`
          }
        >
          <link.icon className="h-6 w-6 mb-1" />
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}

export default MobileNav
