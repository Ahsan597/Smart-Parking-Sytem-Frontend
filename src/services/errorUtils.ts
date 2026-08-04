import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../types/api.types'

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong'
}
