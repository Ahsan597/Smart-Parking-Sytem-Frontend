import { useCallback, useEffect, useState } from 'react'
import { vehicleService } from '../services/vehicleService'
import { getErrorMessage } from '../services/errorUtils'
import type { Vehicle } from '../types/vehicle.types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await vehicleService.getAll()
      setVehicles(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  return { vehicles, isLoading, error, refetch: fetchVehicles }
}
