import { NavLink, Outlet } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-electric-400' : 'text-slate-300 hover:text-white'

function ManagerLayout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader title="Parking Manager">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <NavLink to="/manager" end className={linkClass}>
            My Locations
          </NavLink>
          <NavLink to="/manager/analytics" className={linkClass}>
            Analytics
          </NavLink>
        </nav>
      </AppHeader>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default ManagerLayout
