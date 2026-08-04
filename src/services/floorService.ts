import api from './api'
import type { Floor, FloorWithSlots, CreateFloorPayload, UpdateFloorPayload } from '../types/floor.types'

export const floorService = {
  create(locationId: string, payload: CreateFloorPayload) {
    return api.post<Floor>(`/parking-locations/${locationId}/floors`, payload).then((res) => res.data)
  },
  getByLocation(locationId: string) {
    return api.get<Floor[]>(`/parking-locations/${locationId}/floors`).then((res) => res.data)
  },
  getById(id: string) {
    return api.get<FloorWithSlots>(`/floors/${id}`).then((res) => res.data)
  },
  update(id: string, payload: UpdateFloorPayload) {
    return api.patch<Floor>(`/floors/${id}`, payload).then((res) => res.data)
  },
  remove(id: string) {
    return api.delete(`/floors/${id}`).then(() => undefined)
  },
}
