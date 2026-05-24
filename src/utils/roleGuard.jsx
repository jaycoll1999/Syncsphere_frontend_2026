import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const checkAuthSynchronously = () => {
  if (useAuthStore.getState().isAuthenticated) return true
  if (localStorage.getItem('token')) return true
  const storedAuth = localStorage.getItem('auth-storage')
  if (storedAuth) {
    try {
      const state = JSON.parse(storedAuth)?.state
      if (state?.isAuthenticated || state?.token) return true
    } catch (e) {}
  }
  return false
}

const getRoleSynchronously = () => {
  const user = useAuthStore.getState().user
  if (user?.role) return user.role
  const storedAuth = localStorage.getItem('auth-storage')
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth)?.state?.user?.role
    } catch (e) {}
  }
  return null
}

export const ProtectedRoute = ({ children }) => {
  const isAuth = checkAuthSynchronously()
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  return children
}

export const PublicRoute = ({ children }) => {
  const isAuth = checkAuthSynchronously()
  if (isAuth) {
    const role = getRoleSynchronously()
    const isRoleAdmin = role?.toUpperCase() === 'ADMIN'
    return <Navigate to={isRoleAdmin ? '/admin' : '/dashboard'} replace />
  }
  return children
}

export const RoleBasedRedirect = () => {
  const isAuth = checkAuthSynchronously()
  if (!isAuth) return <Navigate to="/login" replace />
  const role = getRoleSynchronously()
  const isRoleAdmin = role?.toUpperCase() === 'ADMIN'
  return <Navigate to={isRoleAdmin ? '/admin' : '/dashboard'} replace />
}

export const AdminRoute = ({ children }) => {
  const isAuth = checkAuthSynchronously()
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  const role = getRoleSynchronously()
  const isRoleAdmin = role?.toUpperCase() === 'ADMIN'
  if (!isRoleAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
