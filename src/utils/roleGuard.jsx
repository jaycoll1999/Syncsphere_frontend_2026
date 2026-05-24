import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()
  if (isAuthenticated) {
    const isRoleAdmin = user?.role?.toUpperCase() === 'ADMIN'
    return <Navigate to={isRoleAdmin ? '/admin' : '/dashboard'} replace />
  }
  return children
}

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const isRoleAdmin = user?.role?.toUpperCase() === 'ADMIN'
  return <Navigate to={isRoleAdmin ? '/admin' : '/dashboard'} replace />
}

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  const isRoleAdmin = user?.role?.toUpperCase() === 'ADMIN'
  if (!isRoleAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
