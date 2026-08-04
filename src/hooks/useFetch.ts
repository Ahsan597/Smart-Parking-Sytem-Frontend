import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/errorUtils'

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return fetcher()
      .then((result) => setData(result))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}
