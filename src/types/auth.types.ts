export type UserRole = 'USER' | 'PARKING_MANAGER' | 'SUPER_ADMIN'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  phone?: string
}
