import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * ProtectedRoute guards routes based on authentication status and user role.
 * - If not authenticated: redirects to /login?redirect=<path>
 * - If authenticated but role not in allowedRoles:
 *   - TRAVELER is redirected to /plan (Traveler Home)
 *   - OPERATOR is redirected to /operator (Operator Command Center)
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  // 1. Not Authenticated -> Redirect to Login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} 
        replace 
      />
    )
  }

  // 2. Role Check
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If Traveler attempted to access Operator route, redirect to Traveler home
    if (role === 'TRAVELER') {
      return <Navigate to="/plan" replace />
    }
    // If Operator attempted to access Traveler route, redirect to Operator dashboard
    if (role === 'OPERATOR') {
      return <Navigate to="/operator" replace />
    }
    return <Navigate to="/" replace />
  }

  // Render children or allowed route
  return children
}

export default ProtectedRoute
