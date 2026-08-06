import { NavLink, Outlet } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-electric-400' : 'text-slate-300 hover:text-white'

function DriverLayout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader title="Parking Management System">
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            Find Parking
          </NavLink>
          <NavLink to="/bookings" className={linkClass}>
            My Bookings
          </NavLink>
        </nav>
      </AppHeader>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default DriverLayout
