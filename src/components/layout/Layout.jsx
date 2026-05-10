import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileNav from './MobileNav'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  )
}

export default Layout
