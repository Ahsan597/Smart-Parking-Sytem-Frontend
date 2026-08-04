import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-400">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
