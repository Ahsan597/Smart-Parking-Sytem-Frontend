import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsInitializing(false)
      return
    }

    userService
      .getMe()
      .then((profile) => {
        setUser({ id: profile.id, fullName: profile.fullName, email: profile.email, role: profile.role })
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => {
        setIsInitializing(false)
      })
  }, [])

  async function login(payload: LoginPayload) {
    const { accessToken, user: loggedInUser } = await authService.login(payload)
    localStorage.setItem('token', accessToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(payload: RegisterPayload) {
    const { accessToken, user: registeredUser } = await authService.register(payload)
    localStorage.setItem('token', accessToken)
    setUser(registeredUser)
    return registeredUser
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  function updateUser(patch: Partial<AuthUser>) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isInitializing, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
