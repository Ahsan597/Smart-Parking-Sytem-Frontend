import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import NotificationBell from './NotificationBell'

function AppHeader({ title, children }: { title: string; children?: ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex flex-col gap-3 border-b border-navy-700 bg-navy-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <h1 className="text-base font-semibold text-white sm:text-lg">{title}</h1>
        {children}
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="rounded-md border border-navy-600 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-navy-500 hover:text-white sm:px-4"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default AppHeader
