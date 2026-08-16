import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useVehicles } from '../../hooks/useVehicles'
import { vehicleService } from '../../services/vehicleService'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import SelectField from '../../components/SelectField'
import type { VehicleType } from '../../types/vehicle.types'

const VEHICLE_TYPES: VehicleType[] = ['CAR', 'BIKE', 'SUV', 'TRUCK', 'VAN', 'EV']

function Dashboard() {
  const { user } = useAuth()
  const { vehicles, isLoading, error, refetch } = useVehicles()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('CAR')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openAddModal() {
    setVehicleNumber('')
    setVehicleType('CAR')
    setVehicleBrand('')
    setVehicleModel('')
    setIsAddModalOpen(true)
  }

  async function handleAddVehicle(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await vehicleService.create({
        vehicleNumber,
        vehicleType,
        vehicleBrand: vehicleBrand || undefined,
        vehicleModel: vehicleModel || undefined,
      })
      setIsAddModalOpen(false)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <p className="text-sm text-slate-400">Logged in as</p>
        <p className="text-lg font-semibold text-white">{user?.fullName}</p>
        <p className="text-sm text-slate-400">{user?.email}</p>
        <div className="mt-2">
          <Badge label={user?.role ?? ''} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-400">Your Vehicles</h2>
          <button
            onClick={openAddModal}
            className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600"
          >
            Add Vehicle
          </button>
        </div>

        <ErrorAlert message={error} />

        {isLoading ? (
          <p className="text-slate-400">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-400">No vehicles added yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-navy-700 bg-navy-900">
            <table className="w-full min-w-120 text-left text-sm">
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
      </div>

      {isAddModalOpen && (
        <Modal title="Add Vehicle" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
            <FormField
              id="vehicleNumber"
              label="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
            <SelectField
              id="vehicleType"
              label="Vehicle Type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            >
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectField>
            <FormField
              id="vehicleBrand"
              label="Brand (optional)"
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
            />
            <FormField
              id="vehicleModel"
              label="Model (optional)"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Dashboard
