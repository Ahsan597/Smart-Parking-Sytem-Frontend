import type { ParkingLocation } from './location.types'
import type { Pricing } from './pricing.types'

export interface FavoriteLocationEntry {
  id: string
  userId: string
  parkingLocationId: string
  createdAt: string
  parkingLocation: ParkingLocation & { pricing: Pricing | null }
}
