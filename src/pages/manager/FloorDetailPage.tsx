import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { useSlotUpdates } from '../../hooks/useSlotUpdates'
import { floorService } from '../../services/floorService'
import { slotService } from '../../services/slotService'
import FormField from '../../components/FormField'
import SelectField from '../../components/SelectField'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import type { SlotType, SlotStatus } from '../../types/slot.types'

const SLOT_TYPES: SlotType[] = ['NORMAL', 'VIP', 'EV', 'DISABLED']
const SLOT_STATUSES: SlotStatus[] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE']

function FloorDetailPage() {
  const { floorId } = useParams<{ floorId: string }>()
  const { data: floor, isLoading, error, refetch } = useFetch(() => floorService.getById(floorId!), [floorId])

  // Joining happens at the location level; only refetch when the update is for this floor.
  useSlotUpdates(floor?.parkingLocationId, (payload) => {
    if (payload.floorId === floorId) {
      refetch()
    }
  })

  const [slotCode, setSlotCode] = useState('')
  const [slotType, setSlotType] = useState<SlotType>('NORMAL')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)

  async function handleAddSlot(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await slotService.create(floorId!, { slotCode, slotType })
      setSlotCode('')
      setSlotType('NORMAL')
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleStatusChange(slotId: string, status: SlotStatus) {
    setStatusUpdatingId(slotId)
    try {
      await slotService.updateStatus(slotId, { status })
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setStatusUpdatingId(null)
    }
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm('Delete this slot?')) return
    try {
      await slotService.remove(slotId)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    }
  }

  if (isLoading) return <p className="text-slate-400">Loading floor...</p>
  if (error) return <ErrorAlert message={error} />
  if (!floor) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to={`/manager/locations/${floor.parkingLocationId}`} className="text-sm text-electric-400 hover:text-electric-300">
          ← Back to Location
        </Link>
        <h2 className="mt-2 text-xl font-semibold text-white">{floor.name}</h2>
        <p className="text-sm text-slate-400">Floor {floor.floorNumber}</p>
      </div>

      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-400">Add Slot</h3>
        <form onSubmit={handleAddSlot} className="grid grid-cols-2 gap-4">
          <FormField
            id="slotCode"
            label="Slot Code"
            value={slotCode}
            onChange={(e) => setSlotCode(e.target.value)}
            required
          />
          <SelectField
            id="slotType"
            label="Slot Type"
            value={slotType}
            onChange={(e) => setSlotType(e.target.value as SlotType)}
          >
            {SLOT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>
          <div className="col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Slots</h3>
        {floor.slots.length === 0 ? (
          <p className="text-slate-400">No slots yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {floor.slots.map((slot) => (
                  <tr key={slot.id} className="border-t border-navy-700">
                    <td className="px-4 py-3 font-mono text-white">{slot.slotCode}</td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{slot.slotType}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge label={slot.status} />
                        <select
                          value={slot.status}
                          disabled={statusUpdatingId === slot.id}
                          onChange={(e) => handleStatusChange(slot.id, e.target.value as SlotStatus)}
                          className="rounded-md border border-navy-600 bg-navy-800 px-2 py-1 text-xs text-white outline-none focus:border-electric-500 disabled:opacity-60"
                        >
                          {SLOT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FloorDetailPage
