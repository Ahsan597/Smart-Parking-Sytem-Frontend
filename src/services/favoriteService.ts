import api from './api'
import type { FavoriteLocationEntry } from '../types/favorite.types'

export const favoriteService = {
  add(locationId: string) {
    return api.post<FavoriteLocationEntry>(`/favorites/${locationId}`).then((res) => res.data)
  },
  remove(locationId: string) {
    return api.delete(`/favorites/${locationId}`).then(() => undefined)
  },
  getAll() {
    return api.get<FavoriteLocationEntry[]>('/favorites').then((res) => res.data)
  },
}
