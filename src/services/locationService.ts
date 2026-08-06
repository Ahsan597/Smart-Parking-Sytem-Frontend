import api from './api'
import type {
  ParkingLocation,
  ParkingLocationDetail,
  ParkingLocationSearchResult,
  SearchLocationsParams,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '../types/location.types'
import type { AvailableSlot } from '../types/booking.types'

export const locationService = {
  create(payload: CreateLocationPayload) {
    return api.post<ParkingLocation>('/parking-locations', payload).then((res) => res.data)
  },
  getAll(params?: SearchLocationsParams) {
    return api.get<ParkingLocationSearchResult[]>('/parking-locations', { params }).then((res) => res.data)
  },
  getMine() {
    return api.get<ParkingLocation[]>('/parking-locations/my').then((res) => res.data)
  },
  getById(id: string) {
    return api.get<ParkingLocationDetail>(`/parking-locations/${id}`).then((res) => res.data)
  },
  getAvailableSlots(id: string) {
    return api.get<AvailableSlot[]>(`/parking-locations/${id}/available-slots`).then((res) => res.data)
  },
  update(id: string, payload: UpdateLocationPayload) {
    return api.patch<ParkingLocation>(`/parking-locations/${id}`, payload).then((res) => res.data)
  },
  remove(id: string) {
    return api.delete(`/parking-locations/${id}`).then(() => undefined)
  },
}
