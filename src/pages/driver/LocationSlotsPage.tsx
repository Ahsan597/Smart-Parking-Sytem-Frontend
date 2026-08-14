import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { useFavorites } from '../../hooks/useFavorites'
import { useSlotUpdates } from '../../hooks/useSlotUpdates'
import { locationService } from '../../services/locationService'
import { pricingService } from '../../services/pricingService'
import { vehicleService } from '../../services/vehicleService'
import { bookingService } from '../../services/bookingService'
import ErrorAlert from '../../components/ErrorAlert'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import SelectField from '../../components/SelectField'
import FavoriteButton from '../../components/FavoriteButton'
import type { AvailableSlot } from '../../types/booking.types'

function LocationSlotsPage() {
  const { locationId } = useParams<{ locationId: string }>()

  const { data: location, isLoading: isLoadingLocation, error: locationError } = useFetch(
    () => locationService.getById(locationId!),
    [locationId],
  )
  const {
    data: slots,
    isLoading: isLoadingSlots,
    error: slotsError,
    refetch: refetchSlots,
  } = useFetch(() => locationService.getAvailableSlots(locationId!), [locationId])
  const { data: pricing } = useFetch(() => pricingService.getPricing(locationId!), [locationId])
  const { data: vehicles } = useFetch(() => vehicleService.getAll(), [])
  const { favoriteLocationIds, toggleFavorite } = useFavorites()

  // A slot changing status anywhere in this location can affect the available list either way.
  useSlotUpdates(locationId, () => refetchSlots())

  const [reservingSlot, setReservingSlot] = useState<AvailableSlot | null>(null)
  const [vehicleId, setVehicleId] = useState('')
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState('60')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openReserveModal(slot: AvailableSlot) {
    setReservingSlot(slot)
    setVehicleId(vehicles?.[0]?.id ?? '')
    setExpectedDurationMinutes('60')
  }

  async function handleReserve(event: FormEvent) {
    event.preventDefault()
    if (!reservingSlot) return
    setIsSubmitting(true)
    try {
      await bookingService.create({
        slotId: reservingSlot.id,
        vehicleId,
        expectedDurationMinutes: Number(expectedDurationMinutes),
      })
      setReservingSlot(null)
      await refetchSlots()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  const slotsByFloor = new Map<string, { name: string; floorNumber: number; slots: AvailableSlot[] }>()
  for (const slot of slots ?? []) {
    const existing = slotsByFloor.get(slot.floor.id)
    if (existing) {
      existing.slots.push(slot)
    } else {
      slotsByFloor.set(slot.floor.id, {
        name: slot.floor.name,
        floorNumber: slot.floor.floorNumber,
        slots: [slot],
      })
    }
  }

  if (isLoadingLocation) return <p className="text-slate-400">Loading location...</p>
  if (locationError) return <ErrorAlert message={locationError} />
  if (!location) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to="/search" className="text-sm text-electric-400 hover:text-electric-300">
          ← Find Parking
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">{location.name}</h2>
          <FavoriteButton
            isFavorite={favoriteLocationIds.has(location.id)}
            onToggle={() => toggleFavorite(location.id)}
          />
        </div>
        <p className="text-sm text-slate-400">
          {location.address}, {location.city}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {pricing ? `Rs ${pricing.hourlyRate}/hr` : 'Pricing not set for this location yet'}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Available Slots</h3>
        <ErrorAlert message={slotsError} />
        {isLoadingSlots ? (
          <p className="text-slate-400">Loading slots...</p>
        ) : slotsByFloor.size === 0 ? (
          <p className="text-slate-400">No available slots right now.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {Array.from(slotsByFloor.values()).map((floor) => (
              <div key={floor.name + floor.floorNumber}>
                <p className="mb-2 text-sm font-medium text-slate-300">
                  {floor.name} · Floor {floor.floorNumber}
                </p>
                <div className="flex flex-wrap gap-3">
                  {floor.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex w-40 flex-col gap-2 rounded-lg border border-navy-700 bg-navy-900 p-3"
                    >
                      <p className="font-mono text-white">{slot.slotCode}</p>
                      <p className="text-xs text-slate-400 capitalize">{slot.slotType}</p>
                      <button
                        onClick={() => openReserveModal(slot)}
                        className="rounded-md bg-electric-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-electric-600"
                      >
                        Reserve
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reservingSlot && (
        <Modal title={`Reserve Slot ${reservingSlot.slotCode}`} onClose={() => setReservingSlot(null)}>
          {!vehicles || vehicles.length === 0 ? (
            <p className="text-slate-400">
              You need a vehicle before you can reserve a slot.{' '}
              <Link to="/" className="text-electric-400 hover:text-electric-300">
                Add one from your dashboard
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleReserve} className="flex flex-col gap-4">
              <SelectField
                id="vehicleId"
                label="Vehicle"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} ({vehicle.vehicleType})
                  </option>
                ))}
              </SelectField>
              <FormField
                id="expectedDurationMinutes"
                label="Expected Duration (minutes, 15–1440)"
                type="number"
                min={15}
                max={1440}
                step={15}
                value={expectedDurationMinutes}
                onChange={(e) => setExpectedDurationMinutes(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
              >
                {isSubmitting ? 'Reserving...' : 'Reserve'}
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  )
}

export default LocationSlotsPage
