import { createContext } from 'react'
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => void
  updateUser: (patch: Partial<AuthUser>) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
