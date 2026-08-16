import api from './api'
import type { Notification } from '../types/notification.types'

export const notificationService = {
  getAll() {
    return api.get<Notification[]>('/notifications').then((res) => res.data)
  },
  markRead(id: string) {
    return api.patch<Notification>(`/notifications/${id}/read`).then((res) => res.data)
  },
  markAllRead() {
    return api.patch<void>('/notifications/read-all').then((res) => res.data)
  },
}
