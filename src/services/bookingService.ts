import api from './api'
import type {
  Booking,
  BookingStatus,
  LocationBooking,
  CreateBookingPayload,
  CheckoutPayload,
} from '../types/booking.types'

export const bookingService = {
  create(payload: CreateBookingPayload) {
    return api.post<Booking>('/bookings', payload).then((res) => res.data)
  },
  getAll(status?: BookingStatus) {
    return api.get<Booking[]>('/bookings', { params: { status } }).then((res) => res.data)
  },
  getById(id: string) {
    return api.get<Booking>(`/bookings/${id}`).then((res) => res.data)
  },
  cancel(id: string) {
    return api.patch<Booking>(`/bookings/${id}/cancel`).then((res) => res.data)
  },
  checkIn(id: string) {
    return api.patch<Booking>(`/bookings/${id}/check-in`).then((res) => res.data)
  },
  checkOut(id: string, payload?: CheckoutPayload) {
    return api.patch<Booking>(`/bookings/${id}/check-out`, payload).then((res) => res.data)
  },
  // Manager/admin view — bookings at a location they manage (or any, for admin).
  getByLocation(locationId: string, status?: BookingStatus) {
    return api
      .get<LocationBooking[]>(`/parking-locations/${locationId}/bookings`, { params: { status } })
      .then((res) => res.data)
  },
  forceCheckOut(id: string, payload?: CheckoutPayload) {
    return api.patch<Booking>(`/bookings/${id}/force-check-out`, payload).then((res) => res.data)
  },
}
