import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Image
import developerLogo from './assets/developer-logo.png'

// Guards
import { ProtectedRoute, PublicRoute, AdminRoute } from './utils/roleGuard.jsx'

// Layout
import Layout from './components/layout/Layout'

// Pages - Auth
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Pages - Core
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TeamOverviewPage from './pages/TeamOverviewPage'
import CalendarPage from './pages/CalendarPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import LeavePage from './pages/LeavePage'
import LeaveDetailPage from './pages/LeaveDetailPage'
import LeaveBalancePage from './pages/LeaveBalancePage'
import HolidaysPage from './pages/HolidaysPage'
import HolidayDetailPage from './pages/HolidayDetailPage'
import HolidayCalendarViewPage from './pages/HolidayCalendarViewPage'
import NotificationsPage from './pages/NotificationsPage'
import NotificationSettingsPage from './pages/NotificationSettingsPage'
import ProfilePage from './pages/ProfilePage'
import SecuritySettingsPage from './pages/SecuritySettingsPage'
import ActivityLogPage from './pages/ActivityLogPage'

// Pages - Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import UsersPage from './pages/admin/UsersPage'
import SmsLogsPage from './pages/admin/SmsLogsPage'
import EmailLogsPage from './pages/admin/EmailLogsPage'
import NotificationTemplatesPage from './pages/admin/NotificationTemplatesPage'
import RolesPermissionsPage from './pages/admin/RolesPermissionsPage'
import SystemSettingsPage from './pages/admin/SystemSettingsPage'
import ReportsExportPage from './pages/admin/ReportsExportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="team" element={<TeamOverviewPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/new" element={<EventsPage />} /> {/* Modal handled in page */}
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="leave/new" element={<LeavePage />} /> {/* Modal handled in page */}
          <Route path="leave/balance" element={<LeaveBalancePage />} />
          <Route path="leave/:id" element={<LeaveDetailPage />} />
          <Route path="holidays" element={<HolidaysPage />} />
          <Route path="holidays/calendar" element={<HolidayCalendarViewPage />} />
          <Route path="holidays/:id" element={<HolidayDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="settings/security" element={<SecuritySettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/activity" element={<ActivityLogPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sms-logs" element={<SmsLogsPage />} />
          <Route path="email-logs" element={<EmailLogsPage />} />
          <Route path="roles" element={<RolesPermissionsPage />} />
          <Route path="notification-templates" element={<NotificationTemplatesPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="reports" element={<ReportsExportPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* --- Developer Branding Badge --- */}
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md px-5 py-3 rounded-full border border-gray-200 dark:border-white/10 shadow-2xl transition-transform duration-300 hover:-translate-y-1 cursor-pointer group">
        {/* Text Section */}
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
            Developed By
          </span>
          <span className="text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Jasak Solutions
          </span>
        </div>

        {/* Logo Section */}
        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg flex-shrink-0">
          <img 
            src={developerLogo} 
            alt="Developer Logo" 
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </div>
      </div>
      {/* -------------------------------- */}

    </BrowserRouter>
  )
}

export default App
