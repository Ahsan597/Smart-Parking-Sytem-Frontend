import type { UserRole } from '../types/auth.types'

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/admin'
    case 'PARKING_MANAGER':
      return '/manager'
    default:
      return '/'
  }
}
