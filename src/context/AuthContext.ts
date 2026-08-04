import { createContext } from 'react'
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
