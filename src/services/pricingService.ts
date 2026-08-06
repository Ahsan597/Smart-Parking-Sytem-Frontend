import { AxiosError } from 'axios'
import api from './api'
import type { Pricing, SetPricingPayload } from '../types/pricing.types'

export const pricingService = {
  setPricing(locationId: string, payload: SetPricingPayload) {
    return api.put<Pricing>(`/parking-locations/${locationId}/pricing`, payload).then((res) => res.data)
  },
  async getPricing(locationId: string): Promise<Pricing | null> {
    try {
      const res = await api.get<Pricing>(`/parking-locations/${locationId}/pricing`)
      return res.data
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return null
      }
      throw err
    }
  },
}
