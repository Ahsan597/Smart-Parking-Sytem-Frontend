import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { useSlotUpdates } from '../hooks/useSlotUpdates'
import { bookingService } from '../services/bookingService'
import ErrorAlert from './ErrorAlert'
import Badge from './Badge'
import Modal from './Modal'
import SelectField from './SelectField'
import { formatElapsed } from '../utils/bookingTime'
import type { BookingStatus, LocationBooking } from '../types/booking.types'
import type { PaymentMethod } from '../types/payment.types'

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: 'CHECKED_IN', label: 'Currently Parked' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: '', label: 'All' },
]

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'JAZZCASH', 'EASYPAISA', 'STRIPE']

function LocationBookingsPanel({ locationId }: { locationId: string }) {
  const [status, setStatus] = useState<BookingStatus | ''>('CHECKED_IN')
  const { data: bookings, isLoading, error, refetch } = useFetch(
    () => bookingService.getByLocation(locationId, status || undefined),
    [locationId, status],
  )

  // Reserve/check-in/check-out/force-check-out all move a slot at this location — keep the list fresh.
  useSlotUpdates(locationId, () => refetch())

  const [checkingOut, setCheckingOut] = useState<LocationBooking | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openCheckoutModal(booking: LocationBooking) {
    setCheckingOut(booking)
    setPaymentMethod('CASH')
  }

  async function handleForceCheckOut(event: FormEvent) {
    event.preventDefault()
    if (!checkingOut) return
    setIsSubmitting(true)
    try {
      const result = await bookingService.forceCheckOut(checkingOut.id, { paymentMethod })
      if (result.payment) {
        toast.success(`Charged Rs ${result.payment.amount} via ${result.payment.paymentMethod}`)
      }
      setCheckingOut(null)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-sm font-medium text-slate-400">Bookings at this location</h3>
        <div className="w-full sm:w-56">
          <SelectField
            id="bookingStatus"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | '')}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <ErrorAlert message={error} />

      {isLoading ? (
        <p className="text-slate-400">Loading bookings...</p>
      ) : !bookings || bookings.length === 0 ? (
        <p className="text-slate-400">No bookings found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-lg border border-navy-700 bg-navy-900 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-white">
                  {booking.user.fullName} <span className="text-slate-400">· {booking.vehicle.vehicleNumber}</span>
                </p>
                <p className="text-sm text-slate-400">
                  Slot {booking.slot.slotCode} · {booking.slot.floor.name}
                </p>
                <p className="text-sm text-slate-500">{booking.user.phone ?? booking.user.email}</p>
                {booking.status === 'CHECKED_IN' && booking.actualCheckinTime && (
                  <p className="mt-1 text-sm text-slate-500">Parked for {formatElapsed(booking.actualCheckinTime)}</p>
                )}
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                <Badge label={booking.status} />
                {booking.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => openCheckoutModal(booking)}
                    className="rounded-md bg-electric-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-electric-600"
                  >
                    Force Check-Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {checkingOut && (
        <Modal title="Force Check-Out" onClose={() => setCheckingOut(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-400">
              This checks out <span className="text-white">{checkingOut.user.fullName}</span> from slot{' '}
              {checkingOut.slot.slotCode} and charges them for their time parked. This can't be undone.
            </p>
            <form onSubmit={handleForceCheckOut} className="flex flex-col gap-4">
              <SelectField
                id="forceCheckoutMethod"
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </SelectField>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
              >
                {isSubmitting ? 'Checking out...' : 'Confirm Check-Out'}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default LocationBookingsPanel
