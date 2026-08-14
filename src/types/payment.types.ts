import type { BookingSlot, BookingStatus } from './booking.types'

export type PaymentMethod = 'CASH' | 'JAZZCASH' | 'EASYPAISA' | 'STRIPE'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Payment {
  id: string
  bookingId: string
  // TypeORM serializes decimal columns as strings, not numbers
  amount: string
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  paidAt: string | null
  createdAt: string
}

// GET /payments nests the full booking -> slot -> floor -> parkingLocation trail
export interface PaymentBooking {
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
}

export interface PaymentHistoryEntry extends Payment {
  booking: PaymentBooking
}
