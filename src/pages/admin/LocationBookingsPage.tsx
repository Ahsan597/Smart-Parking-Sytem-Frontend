import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { locationService } from '../../services/locationService'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import LocationBookingsPanel from '../../components/LocationBookingsPanel'

function LocationBookingsPage() {
  const { locationId } = useParams<{ locationId: string }>()
  const { data: location, isLoading, error } = useFetch(() => locationService.getById(locationId!), [locationId])

  if (isLoading) return <p className="text-slate-400">Loading location...</p>
  if (error) return <ErrorAlert message={error} />
  if (!location) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to="/admin/locations" className="text-sm text-electric-400 hover:text-electric-300">
          ← Locations
        </Link>
        <h2 className="mt-2 text-xl font-semibold text-white">
          {location.name} <Badge label={location.status} />
        </h2>
        <p className="text-sm text-slate-400">
          {location.address}, {location.city}
        </p>
      </div>

      <LocationBookingsPanel locationId={locationId!} />
    </div>
  )
}

export default LocationBookingsPage
