import api from './api'
import type {
  Slot,
  CreateSlotPayload,
  UpdateSlotPayload,
  UpdateSlotStatusPayload,
} from '../types/slot.types'

export const slotService = {
  create(floorId: string, payload: CreateSlotPayload) {
    return api.post<Slot>(`/floors/${floorId}/slots`, payload).then((res) => res.data)
  },
  getByFloor(floorId: string) {
    return api.get<Slot[]>(`/floors/${floorId}/slots`).then((res) => res.data)
  },
  getById(id: string) {
    return api.get<Slot>(`/slots/${id}`).then((res) => res.data)
  },
  update(id: string, payload: UpdateSlotPayload) {
    return api.patch<Slot>(`/slots/${id}`, payload).then((res) => res.data)
  },
  updateStatus(id: string, payload: UpdateSlotStatusPayload) {
    return api.patch<Slot>(`/slots/${id}/status`, payload).then((res) => res.data)
  },
  remove(id: string) {
    return api.delete(`/slots/${id}`).then(() => undefined)
  },
}
