import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AppHeader({ title, children }: { title: string; children?: ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex items-center justify-between border-b border-navy-700 bg-navy-900 px-6 py-4">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {children}
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md border border-navy-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-navy-500 hover:text-white"
      >
        Logout
      </button>
    </header>
  )
}

export default AppHeader
