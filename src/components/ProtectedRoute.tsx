import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getHomeRouteForRole } from '../utils/roleRoutes'
import type { UserRole } from '../types/auth.types'

function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { user, isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-400">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
