import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import AppHeader from '../components/AppHeader'
import ErrorAlert from '../components/ErrorAlert'
import Badge from '../components/Badge'

function Dashboard() {
  const { user } = useAuth()
  const { vehicles, isLoading, error } = useVehicles()

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader title="Parking Management System" />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 rounded-lg border border-navy-700 bg-navy-900 p-4">
          <p className="text-sm text-slate-400">Logged in as</p>
          <p className="text-lg font-semibold text-white">{user?.fullName}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <div className="mt-2">
            <Badge label={user?.role ?? ''} />
          </div>
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
