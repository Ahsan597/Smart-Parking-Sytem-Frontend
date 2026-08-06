export interface Pricing {
  id: string
  parkingLocationId: string
  // TypeORM serializes decimal columns as strings, not numbers
  hourlyRate: string
  dailyRate: string | null
  monthlyRate: string | null
  createdAt: string
  updatedAt: string
}

export interface SetPricingPayload {
  hourlyRate: number
  dailyRate?: number
  monthlyRate?: number
}
