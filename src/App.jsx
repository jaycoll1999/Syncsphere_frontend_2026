import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
    </BrowserRouter>
  )
}

export default App
