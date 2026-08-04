import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { locationService } from '../../services/locationService'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'

function MyLocationsPage() {
  const { data: locations, isLoading, error } = useFetch(() => locationService.getMine(), [])

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-slate-400">My Locations</h2>
      <ErrorAlert message={error} />
      {isLoading ? (
        <p className="text-slate-400">Loading locations...</p>
      ) : !locations || locations.length === 0 ? (
        <p className="text-slate-400">No locations assigned to you yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              to={`/manager/locations/${location.id}`}
              className="block rounded-lg border border-navy-700 bg-navy-900 p-4 transition hover:border-navy-500"
            >
              <p className="font-medium text-white">
                {location.name} <Badge label={location.status} />
              </p>
              <p className="text-sm text-slate-400">
                {location.address}, {location.city}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLocationsPage
