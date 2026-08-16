import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { locationService } from '../../services/locationService'
import { userService } from '../../services/userService'
import { pricingService } from '../../services/pricingService'
import FormField from '../../components/FormField'
import SelectField from '../../components/SelectField'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import type { ParkingLocation, ParkingLocationStatus } from '../../types/location.types'
import type { Pricing } from '../../types/pricing.types'

function LocationsPage() {
  const { data: locations, isLoading, error, refetch } = useFetch(() => locationService.getAll(), [])
  const { data: managers } = useFetch(() => userService.getManagers(), [])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [managerId, setManagerId] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editManagerId, setEditManagerId] = useState('')
  const [editStatus, setEditStatus] = useState<ParkingLocationStatus>('ACTIVE')
  const [editHourlyRate, setEditHourlyRate] = useState('')
  const [editDailyRate, setEditDailyRate] = useState('')
  const [editMonthlyRate, setEditMonthlyRate] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  function managerName(id: string | null) {
    if (!id) return '—'
    return managers?.find((m) => m.id === id)?.fullName ?? id
  }

  function openAddModal() {
    setName('')
    setAddress('')
    setCity('')
    setLatitude('')
    setLongitude('')
    setManagerId('')
    setIsAddModalOpen(true)
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    setIsCreating(true)
    try {
      const created = await locationService.create({
        name,
        address,
        city,
        latitude: Number(latitude),
        longitude: Number(longitude),
        managerId: managerId || undefined,
      })
      setIsAddModalOpen(false)
      await refetch()
      // Jump straight into the edit panel so pricing isn't a step that gets missed.
      startEdit(created)
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsCreating(false)
    }
  }

  function startEdit(location: ParkingLocation & { pricing?: Pricing | null }) {
    setEditingId(location.id)
    setEditName(location.name)
    setEditAddress(location.address)
    setEditCity(location.city)
    setEditManagerId(location.managerId ?? '')
    setEditStatus(location.status)
    setEditHourlyRate(location.pricing?.hourlyRate ?? '')
    setEditDailyRate(location.pricing?.dailyRate ?? '')
    setEditMonthlyRate(location.pricing?.monthlyRate ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    setIsSavingEdit(true)
    try {
      await locationService.update(editingId, {
        name: editName,
        address: editAddress,
        city: editCity,
        managerId: editManagerId || undefined,
        status: editStatus,
      })
      if (editHourlyRate) {
        await pricingService.setPricing(editingId, {
          hourlyRate: Number(editHourlyRate),
          dailyRate: editDailyRate ? Number(editDailyRate) : undefined,
          monthlyRate: editMonthlyRate ? Number(editMonthlyRate) : undefined,
        })
      }
      setEditingId(null)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSavingEdit(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this location? This cannot be undone.')) return
    try {
      await locationService.remove(id)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-400">Locations</h2>
          <button
            onClick={openAddModal}
            className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600"
          >
            Add Location
          </button>
        </div>
        <ErrorAlert message={error} />
        {isLoading ? (
          <p className="text-slate-400">Loading locations...</p>
        ) : !locations || locations.length === 0 ? (
          <p className="text-slate-400">No locations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {locations.map((location) =>
              editingId === location.id ? (
                <form
                  key={location.id}
                  onSubmit={handleSaveEdit}
                  className="rounded-lg border border-electric-500/50 bg-navy-900 p-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id={`edit-name-${location.id}`}
                      label="Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                    <FormField
                      id={`edit-city-${location.id}`}
                      label="City"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      required
                    />
                    <FormField
                      id={`edit-address-${location.id}`}
                      label="Address"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      required
                    />
                    <SelectField
                      id={`edit-manager-${location.id}`}
                      label="Manager"
                      value={editManagerId}
                      onChange={(e) => setEditManagerId(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {managers?.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.fullName}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      id={`edit-status-${location.id}`}
                      label="Status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ParkingLocationStatus)}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </SelectField>
                  </div>

                  <div className="mt-4 border-t border-navy-700 pt-4">
                    <p className="mb-3 text-sm font-medium text-slate-400">
                      Pricing {!location.pricing && <span className="text-amber-400">(not set yet)</span>}
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormField
                        id={`edit-hourly-${location.id}`}
                        label="Hourly Rate"
                        type="number"
                        step="any"
                        min={0}
                        value={editHourlyRate}
                        onChange={(e) => setEditHourlyRate(e.target.value)}
                        required
                      />
                      <FormField
                        id={`edit-daily-${location.id}`}
                        label="Daily Rate (optional)"
                        type="number"
                        step="any"
                        min={0}
                        value={editDailyRate}
                        onChange={(e) => setEditDailyRate(e.target.value)}
                      />
                      <FormField
                        id={`edit-monthly-${location.id}`}
                        label="Monthly Rate (optional)"
                        type="number"
                        step="any"
                        min={0}
                        value={editMonthlyRate}
                        onChange={(e) => setEditMonthlyRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
                    >
                      {isSavingEdit ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-md border border-navy-600 px-4 py-2 text-sm font-medium text-slate-300 hover:border-navy-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  key={location.id}
                  className="flex flex-col gap-3 rounded-lg border border-navy-700 bg-navy-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">
                      {location.name} <Badge label={location.status} />
                    </p>
                    <p className="text-sm text-slate-400">
                      {location.address}, {location.city}
                    </p>
                    <p className="text-sm text-slate-500">Manager: {managerName(location.managerId)}</p>
                    {location.pricing ? (
                      <p className="text-sm text-slate-500">Rs {location.pricing.hourlyRate}/hr</p>
                    ) : (
                      <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/30">
                        No pricing set
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Link
                      to={`/admin/locations/${location.id}/bookings`}
                      className="rounded-md border border-navy-600 px-3 py-1.5 text-sm text-slate-300 hover:border-navy-500 hover:text-white"
                    >
                      Bookings
                    </Link>
                    <button
                      onClick={() => startEdit(location)}
                      className="rounded-md border border-navy-600 px-3 py-1.5 text-sm text-slate-300 hover:border-navy-500 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <Modal title="Add Location" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <FormField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FormField id="city" label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <FormField
              id="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <SelectField
              id="managerId"
              label="Manager (optional)"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {managers?.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName}
                </option>
              ))}
            </SelectField>
            <FormField
              id="latitude"
              label="Latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <FormField
              id="longitude"
              label="Longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isCreating ? 'Creating...' : 'Create Location'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default LocationsPage
