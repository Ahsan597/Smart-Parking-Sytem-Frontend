import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import ErrorAlert from '../components/ErrorAlert'

function Dashboard() {
  const { user, logout } = useAuth()
  const { vehicles, isLoading, error } = useVehicles()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <header className="flex items-center justify-between border-b border-navy-700 bg-navy-900 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Parking Management System</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-navy-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-navy-500 hover:text-white"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 rounded-lg border border-navy-700 bg-navy-900 p-4">
          <p className="text-sm text-slate-400">Logged in as</p>
          <p className="text-lg font-semibold text-white">{user?.fullName}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <span className="mt-2 inline-block rounded-full bg-electric-500/15 px-2 py-1 text-xs font-medium text-electric-400 ring-1 ring-electric-500/30">
            {user?.role}
          </span>
        </div>

        <h2 className="mb-3 text-sm font-medium text-slate-400">Your Vehicles</h2>

        <ErrorAlert message={error} />

        {isLoading ? (
          <p className="text-slate-400">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-400">No vehicles added yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Number</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Brand / Model</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-navy-700">
                    <td className="px-4 py-3 font-mono text-white">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{vehicle.vehicleType}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {[vehicle.vehicleBrand, vehicle.vehicleModel].filter(Boolean).join(' ') || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
