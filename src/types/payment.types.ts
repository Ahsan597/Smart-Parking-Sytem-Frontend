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
