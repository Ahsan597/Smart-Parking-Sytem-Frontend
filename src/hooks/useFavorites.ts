import { useCallback } from 'react'
import { useFetch } from './useFetch'
import { favoriteService } from '../services/favoriteService'

export function useFavorites() {
  const { data, isLoading, error, refetch } = useFetch(() => favoriteService.getAll(), [])
  const favorites = data ?? []
  const favoriteLocationIds = new Set(favorites.map((f) => f.parkingLocationId))

  const toggleFavorite = useCallback(
    async (locationId: string) => {
      if (favoriteLocationIds.has(locationId)) {
        await favoriteService.remove(locationId)
      } else {
        await favoriteService.add(locationId)
      }
      await refetch()
    },
    // favoriteLocationIds is derived fresh each render from `data`; refetch covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch, data],
  )

  return { favorites, favoriteLocationIds, isLoading, error, toggleFavorite, refetch }
}
