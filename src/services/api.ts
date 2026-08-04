import axios from 'axios'
import toast from 'react-hot-toast'
import { getErrorMessage } from './errorUtils'
import type { ApiSuccessResponse } from '../types/api.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function isMutation(method?: string): boolean {
  return !!method && method.toLowerCase() !== 'get'
}

api.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiSuccessResponse<unknown>
    if (isMutation(response.config.method) && envelope?.message) {
      toast.success(envelope.message)
    }
    response.data = envelope?.data
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    if (isMutation(error.config?.method)) {
      toast.error(getErrorMessage(error))
    }
    return Promise.reject(error)
  },
)

export default api
