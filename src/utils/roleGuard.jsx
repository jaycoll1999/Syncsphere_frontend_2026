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
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
