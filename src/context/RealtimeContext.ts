import { createContext } from 'react'
import type { Socket } from 'socket.io-client'
import type { Notification } from '../types/notification.types'
import type { SlotUpdatedEvent } from '../types/realtime.types'

export interface RealtimeContextValue {
  socket: Socket | null
  notifications: Notification[]
  unreadCount: number
  isLoadingNotifications: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  joinLocation: (locationId: string) => void
  leaveLocation: (locationId: string) => void
  subscribeToSlotUpdates: (callback: (payload: SlotUpdatedEvent) => void) => () => void
}

export const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined)
