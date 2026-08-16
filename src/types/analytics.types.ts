export interface AnalyticsQueryParams {
  locationId?: string
  from?: string
  to?: string
}

export interface RevenueReport {
  totalRevenue: number
  paymentsCount: number
}

export interface OccupancyReport {
  locationId: string
  locationName: string
  totalSlots: number
  available: number
  reserved: number
  occupied: number
  maintenance: number
  occupancyRate: number
}

export interface PeakHourEntry {
  hour: number
  count: number
}
