import api from './api'
import type { AnalyticsQueryParams, RevenueReport, OccupancyReport, PeakHourEntry } from '../types/analytics.types'

export const analyticsService = {
  getRevenue(params?: AnalyticsQueryParams) {
    return api.get<RevenueReport>('/analytics/revenue', { params }).then((res) => res.data)
  },
  // Returns a single report when params.locationId is set, otherwise one per location in scope.
  getOccupancy(params?: AnalyticsQueryParams) {
    return api.get<OccupancyReport | OccupancyReport[]>('/analytics/occupancy', { params }).then((res) => res.data)
  },
  getPeakHours(params?: AnalyticsQueryParams) {
    return api.get<PeakHourEntry[]>('/analytics/peak-hours', { params }).then((res) => res.data)
  },
}
