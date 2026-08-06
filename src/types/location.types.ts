import type { FloorWithSlots } from './floor.types'
import type { Pricing } from './pricing.types'

export type ParkingLocationStatus = 'ACTIVE' | 'INACTIVE'

export interface ParkingLocation {
  id: string
  name: string
  address: string
  city: string
  // TypeORM serializes decimal columns as strings, not numbers
  latitude: string
  longitude: string
  status: ParkingLocationStatus
  managerId: string | null
  createdAt: string
  updatedAt: string
}

export interface ParkingLocationManager {
  id: string
  fullName: string
  email: string
}

export interface ParkingLocationDetail extends ParkingLocation {
  floors: FloorWithSlots[]
  manager: ParkingLocationManager | null
}

// GET /parking-locations (search) enriches each location with live pricing/availability.
// Other endpoints (e.g. /parking-locations/my) return the bare ParkingLocation shape.
export interface ParkingLocationSearchResult extends ParkingLocation {
  pricing: Pricing | null
  availableSlots: number
}

export interface SearchLocationsParams {
  city?: string
  name?: string
  onlyAvailable?: boolean
}

export interface CreateLocationPayload {
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  managerId?: string
}

export interface UpdateLocationPayload {
  name?: string
  address?: string
  city?: string
  latitude?: number
  longitude?: number
  managerId?: string
  status?: ParkingLocationStatus
}
