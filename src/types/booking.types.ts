import type { Slot } from './slot.types'
import type { Floor } from './floor.types'
import type { ParkingLocation } from './location.types'
import type { Vehicle } from './vehicle.types'
import type { Payment, PaymentMethod } from './payment.types'

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
  startTime: string
  expectedEndTime: string
  actualCheckinTime: string | null
  actualCheckoutTime: string | null
  status: BookingStatus
  createdAt: string
  slot: BookingSlot
  vehicle: Vehicle
  payment: Payment | null
}

export interface CreateBookingPayload {
  slotId: string
  vehicleId: string
  expectedDurationMinutes: number
}

export interface CheckoutPayload {
  paymentMethod?: PaymentMethod
}
