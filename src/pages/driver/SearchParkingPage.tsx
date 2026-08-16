import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { useFavorites } from '../../hooks/useFavorites'
import { locationService } from '../../services/locationService'
import FormField from '../../components/FormField'
import ErrorAlert from '../../components/ErrorAlert'
import FavoriteButton from '../../components/FavoriteButton'
import type { SearchLocationsParams } from '../../types/location.types'

function SearchParkingPage() {
  const navigate = useNavigate()
  const [cityInput, setCityInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [onlyAvailableInput, setOnlyAvailableInput] = useState(false)
  const [filters, setFilters] = useState<SearchLocationsParams>({})

  const { data: locations, isLoading, error } = useFetch(
    () => locationService.getAll(filters),
    [filters.city, filters.name, filters.onlyAvailable],
  )
  const { favoriteLocationIds, toggleFavorite } = useFavorites()

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setFilters({
      city: cityInput || undefined,
      name: nameInput || undefined,
      onlyAvailable: onlyAvailableInput || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <h2 className="mb-4 text-sm font-medium text-slate-400">Find Parking</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="city" label="City" value={cityInput} onChange={(e) => setCityInput(e.target.value)} />
          <FormField id="name" label="Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={onlyAvailableInput}
              onChange={(e) => setOnlyAvailableInput(e.target.checked)}
              className="h-4 w-4 rounded border-navy-600 bg-navy-800"
            />
            Only show locations with available slots
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div>
        <ErrorAlert message={error} />
        {isLoading ? (
          <p className="text-slate-400">Searching...</p>
        ) : !locations || locations.length === 0 ? (
          <p className="text-slate-400">No parking locations found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => navigate(`/locations/${location.id}`)}
                className="flex cursor-pointer flex-col gap-3 rounded-lg border border-navy-700 bg-navy-900 p-4 transition hover:border-navy-500 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="font-medium text-white">{location.name}</p>
                  <p className="text-sm text-slate-400">
                    {location.address}, {location.city}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {location.pricing ? `Rs ${location.pricing.hourlyRate}/hr` : 'Pricing not set'}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:shrink-0">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      location.availableSlots > 0
                        ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                        : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30'
                    }`}
                  >
                    {location.availableSlots} available
                  </span>
                  <FavoriteButton
                    isFavorite={favoriteLocationIds.has(location.id)}
                    onToggle={() => toggleFavorite(location.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchParkingPage
