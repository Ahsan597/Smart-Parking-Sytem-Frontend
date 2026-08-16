import type { Slot } from './slot.types'
import type { Floor } from './floor.types'
import type { ParkingLocation } from './location.types'
import type { Vehicle } from './vehicle.types'
import type { Payment, PaymentMethod } from './payment.types'
import type { User } from './user.types'

export type BookingStatus = 'PENDING' | 'RESERVED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

export interface AvailableSlot extends Slot {
  floor: Floor
}

export interface BookingFloor extends Floor {
  parkingLocation: ParkingLocation
}

export interface BookingSlot extends Slot {
  floor: BookingFloor
}

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  slotId: string
  // Scheduled/actual check-in time the driver picked — "now" or up to 120 minutes ahead.
  startTime: string
  // Planned checkout time, if the driver gave one; null means open-ended (bill on actual checkout).
  expectedEndTime: string | null
  actualCheckinTime: string | null
  actualCheckoutTime: string | null
  status: BookingStatus
  createdAt: string
  slot: BookingSlot
  vehicle: Vehicle
  payment: Payment | null
}

// GET /parking-locations/:locationId/bookings (manager/admin view) — same shape as
// a driver's own booking, plus the driver's own user info nested in.
export interface LocationBooking extends Booking {
  user: User
}

export interface CreateBookingPayload {
  slotId: string
  vehicleId: string
  // Required. Must be "now" (small tolerance) up to 120 minutes in the future — validate before submitting.
  checkInTime: string
  // Optional. If given, must be after checkInTime. Omit if the driver doesn't know yet.
  checkOutTime?: string
}

export interface CheckoutPayload {
  paymentMethod?: PaymentMethod
}
