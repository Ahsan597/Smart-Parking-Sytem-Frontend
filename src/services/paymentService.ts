import api from './api'
import type { PaymentHistoryEntry } from '../types/payment.types'

export const paymentService = {
  getAll() {
    return api.get<PaymentHistoryEntry[]>('/payments').then((res) => res.data)
  },
}
