import api from './api'
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types'

export const vehicleService = {
  create(payload: CreateVehiclePayload) {
    return api.post<Vehicle>('/vehicles', payload).then((res) => res.data)
  },
  getAll() {
    return api.get<Vehicle[]>('/vehicles').then((res) => res.data)
  },
  getById(id: string) {
    return api.get<Vehicle>(`/vehicles/${id}`).then((res) => res.data)
  },
  update(id: string, payload: UpdateVehiclePayload) {
    return api.patch<Vehicle>(`/vehicles/${id}`, payload).then((res) => res.data)
  },
  remove(id: string) {
    return api.delete(`/vehicles/${id}`).then(() => undefined)
  },
}
