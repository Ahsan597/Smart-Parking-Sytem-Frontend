import api from './api'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types'

export const authService = {
  register(payload: RegisterPayload) {
    return api.post<AuthResponse>('/auth/register', payload).then((res) => res.data)
  },
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/auth/login', payload).then((res) => res.data)
  },
}
