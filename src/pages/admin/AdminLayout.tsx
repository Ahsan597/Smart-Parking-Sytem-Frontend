import { NavLink, Outlet } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-electric-400' : 'text-slate-300 hover:text-white'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader title="Admin">
        <nav className="flex gap-4 text-sm">
          <NavLink to="/admin/managers" className={linkClass}>
            Managers
          </NavLink>
          <NavLink to="/admin/locations" className={linkClass}>
            Locations
          </NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>
            Analytics
          </NavLink>
        </nav>
      </AppHeader>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
