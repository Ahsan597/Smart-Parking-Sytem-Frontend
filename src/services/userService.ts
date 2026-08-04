import api from './api'
import type { User, UpdateProfilePayload } from '../types/user.types'

export const userService = {
  getMe() {
    return api.get<User>('/users/me').then((res) => res.data)
  },
  updateMe(payload: UpdateProfilePayload) {
    return api.patch<User>('/users/me', payload).then((res) => res.data)
  },
  getAll() {
    return api.get<User[]>('/users').then((res) => res.data)
  },
}
