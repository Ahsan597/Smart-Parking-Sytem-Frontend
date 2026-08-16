import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { locationService } from '../../services/locationService'
import { floorService } from '../../services/floorService'
import { pricingService } from '../../services/pricingService'
import FormField from '../../components/FormField'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import LocationBookingsPanel from '../../components/LocationBookingsPanel'

function LocationDetailPage() {
  const { locationId } = useParams<{ locationId: string }>()
  const { data: location, isLoading, error, refetch } = useFetch(
    () => locationService.getById(locationId!),
    [locationId],
  )
  const { data: pricing, refetch: refetchPricing } = useFetch(
    () => pricingService.getPricing(locationId!),
    [locationId],
  )

  const [name, setName] = useState('')
  const [floorNumber, setFloorNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [hourlyRate, setHourlyRate] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [monthlyRate, setMonthlyRate] = useState('')
  const [isSavingPricing, setIsSavingPricing] = useState(false)

  useEffect(() => {
    setHourlyRate(pricing?.hourlyRate ?? '')
    setDailyRate(pricing?.dailyRate ?? '')
    setMonthlyRate(pricing?.monthlyRate ?? '')
  }, [pricing])

  async function handleAddFloor(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await floorService.create(locationId!, { name, floorNumber: Number(floorNumber) })
      setName('')
      setFloorNumber('')
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSavePricing(event: FormEvent) {
    event.preventDefault()
    setIsSavingPricing(true)
    try {
      await pricingService.setPricing(locationId!, {
        hourlyRate: Number(hourlyRate),
        dailyRate: dailyRate ? Number(dailyRate) : undefined,
        monthlyRate: monthlyRate ? Number(monthlyRate) : undefined,
      })
      await refetchPricing()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSavingPricing(false)
    }
  }

  async function handleDeleteFloor(floorId: string) {
    if (!confirm('Delete this floor and all its slots?')) return
    try {
      await floorService.remove(floorId)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    }
  }

  if (isLoading) return <p className="text-slate-400">Loading location...</p>
  if (error) return <ErrorAlert message={error} />
  if (!location) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to="/manager" className="text-sm text-electric-400 hover:text-electric-300">
          ← My Locations
        </Link>
        <h2 className="mt-2 text-xl font-semibold text-white">
          {location.name} <Badge label={location.status} />
        </h2>
        <p className="text-sm text-slate-400">
          {location.address}, {location.city}
        </p>
      </div>

      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-400">
          Pricing {!pricing && <span className="text-amber-400">(not set — checkout will fail until this is set)</span>}
        </h3>
        <form onSubmit={handleSavePricing} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            id="hourlyRate"
            label="Hourly Rate"
            type="number"
            step="any"
            min={0}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
          <FormField
            id="dailyRate"
            label="Daily Rate (optional)"
            type="number"
            step="any"
            min={0}
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
          />
          <FormField
            id="monthlyRate"
            label="Monthly Rate (optional)"
            type="number"
            step="any"
            min={0}
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
          />
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSavingPricing}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSavingPricing ? 'Saving...' : 'Save Pricing'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-400">Add Floor</h3>
        <form onSubmit={handleAddFloor} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormField
            id="floorNumber"
            label="Floor Number"
            type="number"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            required
          />
          <div className="flex items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Floor'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Floors</h3>
        {location.floors.length === 0 ? (
          <p className="text-slate-400">No floors yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {location.floors.map((floor) => (
              <div
                key={floor.id}
                className="flex flex-col gap-3 rounded-lg border border-navy-700 bg-navy-900 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white">{floor.name}</p>
                  <p className="text-sm text-slate-400">
                    Floor {floor.floorNumber} · {floor.slots.length} slot{floor.slots.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <Link
                    to={`/manager/floors/${floor.id}`}
                    className="rounded-md border border-navy-600 px-3 py-1.5 text-sm text-slate-300 hover:border-navy-500 hover:text-white"
                  >
                    Manage Slots
                  </Link>
                  <button
                    onClick={() => handleDeleteFloor(floor.id)}
                    className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LocationBookingsPanel locationId={locationId!} />
    </div>
  )
}

export default LocationDetailPage
