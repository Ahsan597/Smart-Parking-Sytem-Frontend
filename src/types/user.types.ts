import type { UserRole } from './auth.types'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  status: string
  phone: string | null
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  fullName?: string
  phone?: string
  profilePicture?: string
}
