import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { bookingService } from '../../services/bookingService'
import { pricingService } from '../../services/pricingService'
import ErrorAlert from '../../components/ErrorAlert'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import SelectField from '../../components/SelectField'
import CountdownBadge from '../../components/CountdownBadge'
import { getReservationExpiry, computeEstimatedCost, formatDateTime } from '../../utils/bookingTime'
import type { Booking, BookingStatus } from '../../types/booking.types'
import type { PaymentMethod } from '../../types/payment.types'

const STATUS_OPTIONS: BookingStatus[] = ['PENDING', 'RESERVED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'EXPIRED']
const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'JAZZCASH', 'EASYPAISA', 'STRIPE']

function CheckoutPanel({
  booking,
  onClose,
  onSuccess,
}: {
  booking: Booking
  onClose: () => void
  onSuccess: () => void
}) {
  const { data: pricing } = useFetch(
    () => pricingService.getPricing(booking.slot.floor.parkingLocation.id),
    [booking.id],
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const estimatedCost =
    pricing && booking.actualCheckinTime
      ? computeEstimatedCost(booking.actualCheckinTime, pricing.hourlyRate, now)
      : null

  async function handleCheckout(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await bookingService.checkOut(booking.id, { paymentMethod })
      onSuccess()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Check Out" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-400">
          Slot {booking.slot.slotCode} at {booking.slot.floor.parkingLocation.name}
        </p>
        {estimatedCost !== null && (
          <p className="text-sm text-slate-300">
            Estimated cost so far: <span className="font-semibold text-white">Rs {estimatedCost}</span> (rounds up
            to the next hour)
          </p>
        )}
        <form onSubmit={handleCheckout} className="flex flex-col gap-4">
          <SelectField
            id="paymentMethod"
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
            {isSubmitting ? 'Checking out...' : 'Confirm Check Out'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')
  const { data: bookings, isLoading, error, refetch } = useFetch(
    () => bookingService.getAll(statusFilter || undefined),
    [statusFilter],
  )

  const [checkingOutBooking, setCheckingOutBooking] = useState<Booking | null>(null)
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null)

  async function handleCancel(id: string) {
    if (!confirm('Cancel this reservation?')) return
    try {
      await bookingService.cancel(id)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    }
  }

  async function handleCheckIn(id: string) {
    try {
      await bookingService.checkIn(id)
      await refetch()
    } catch {
      // toast shown by the response interceptor
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <h2 className="text-sm font-medium text-slate-400">My Bookings</h2>
        <div className="w-48">
          <SelectField
            id="statusFilter"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <ErrorAlert message={error} />

      {isLoading ? (
        <p className="text-slate-400">Loading bookings...</p>
      ) : !bookings || bookings.length === 0 ? (
        <p className="text-slate-400">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg border border-navy-700 bg-navy-900 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">
                    {booking.slot.floor.parkingLocation.name} · Slot {booking.slot.slotCode}
                  </p>
                  <p className="text-sm text-slate-400">{booking.vehicle.vehicleNumber}</p>
                </div>
                <Badge label={booking.status} />
              </div>

              {booking.status === 'RESERVED' && (
                <div className="mt-2">
                  <CountdownBadge expiresAt={getReservationExpiry(booking.startTime)} />
                </div>
              )}

              {booking.status === 'COMPLETED' && booking.payment && (
                <p className="mt-2 text-sm text-slate-400">
                  Paid Rs {booking.payment.amount} via {booking.payment.paymentMethod}
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setViewingBooking(booking)}
                  className="rounded-md border border-navy-600 px-3 py-1.5 text-sm text-slate-300 hover:border-navy-500 hover:text-white"
                >
                  View
                </button>
                {booking.status === 'RESERVED' && (
                  <>
                    <button
                      onClick={() => handleCheckIn(booking.id)}
                      className="rounded-md bg-electric-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-electric-600"
                    >
                      Check In
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => setCheckingOutBooking(booking)}
                    className="rounded-md bg-electric-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-electric-600"
                  >
                    Check Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {checkingOutBooking && (
        <CheckoutPanel
          booking={checkingOutBooking}
          onClose={() => setCheckingOutBooking(null)}
          onSuccess={() => {
            setCheckingOutBooking(null)
            refetch()
          }}
        />
      )}

      {viewingBooking && (
        <Modal title="Booking Details" onClose={() => setViewingBooking(null)}>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-slate-400">Location</p>
            <p className="text-white">
              {viewingBooking.slot.floor.parkingLocation.name} — {viewingBooking.slot.floor.parkingLocation.address},{' '}
              {viewingBooking.slot.floor.parkingLocation.city}
            </p>
            <p className="mt-2 text-slate-400">Floor / Slot</p>
            <p className="text-white">
              {viewingBooking.slot.floor.name} · {viewingBooking.slot.slotCode} ({viewingBooking.slot.slotType})
            </p>
            <p className="mt-2 text-slate-400">Vehicle</p>
            <p className="text-white">
              {viewingBooking.vehicle.vehicleNumber} ({viewingBooking.vehicle.vehicleType})
            </p>
            <p className="mt-2 text-slate-400">Status</p>
            <Badge label={viewingBooking.status} />
            <p className="mt-2 text-slate-400">Reserved At</p>
            <p className="text-white">{formatDateTime(viewingBooking.startTime)}</p>
            {viewingBooking.actualCheckinTime && (
              <>
                <p className="mt-2 text-slate-400">Checked In</p>
                <p className="text-white">{formatDateTime(viewingBooking.actualCheckinTime)}</p>
              </>
            )}
            {viewingBooking.actualCheckoutTime && (
              <>
                <p className="mt-2 text-slate-400">Checked Out</p>
                <p className="text-white">{formatDateTime(viewingBooking.actualCheckoutTime)}</p>
              </>
            )}
            {viewingBooking.payment && (
              <>
                <p className="mt-2 text-slate-400">Payment</p>
                <p className="text-white">
                  Rs {viewingBooking.payment.amount} via {viewingBooking.payment.paymentMethod}
                </p>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MyBookingsPage
