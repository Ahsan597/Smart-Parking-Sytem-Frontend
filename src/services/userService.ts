import api from './api'
import type { UserRole } from '../types/auth.types'
import type { User, UpdateProfilePayload, CreateManagerPayload, UpdateUserRolePayload } from '../types/user.types'

export const userService = {
  getMe() {
    return api.get<User>('/users/me').then((res) => res.data)
  },
  updateMe(payload: UpdateProfilePayload) {
    return api.patch<User>('/users/me', payload).then((res) => res.data)
  },
  getAll(role?: UserRole) {
    return api.get<User[]>('/users', { params: role ? { role } : undefined }).then((res) => res.data)
  },
  getManagers() {
    return api.get<User[]>('/users', { params: { role: 'PARKING_MANAGER' } }).then((res) => res.data)
  },
  createManager(payload: CreateManagerPayload) {
    return api.post<User>('/users/managers', payload).then((res) => res.data)
  },
  updateRole(id: string, payload: UpdateUserRolePayload) {
    return api.patch<User>(`/users/${id}/role`, payload).then((res) => res.data)
  },
}
