import { useFetch } from './useFetch'
import { vehicleService } from '../services/vehicleService'

export function useVehicles() {
  const { data, isLoading, error, refetch } = useFetch(() => vehicleService.getAll(), [])
  return { vehicles: data ?? [], isLoading, error, refetch }
}
