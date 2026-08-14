import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { RealtimeContext } from './RealtimeContext'
import { useAuth } from '../hooks/useAuth'
import { notificationService } from '../services/notificationService'
import type { Notification } from '../types/notification.types'
import type { SlotUpdatedEvent } from '../types/realtime.types'

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const slotUpdateListeners = useRef(new Set<(payload: SlotUpdatedEvent) => void>())

  useEffect(() => {
    if (!isAuthenticated) {
      setSocket(null)
      setNotifications([])
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    const socketInstance = io(SOCKET_URL, { auth: { token } })

    socketInstance.on('notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      toast(notification.title, { icon: '🔔' })
    })

    socketInstance.on('slotUpdated', (payload: SlotUpdatedEvent) => {
      slotUpdateListeners.current.forEach((listener) => listener(payload))
    })

    setSocket(socketInstance)

    setIsLoadingNotifications(true)
    notificationService
      .getAll()
      .then(setNotifications)
      .finally(() => setIsLoadingNotifications(false))

    return () => {
      socketInstance.disconnect()
    }
  }, [isAuthenticated])

  const markAsRead = useCallback(async (id: string) => {
    await notificationService.markRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  const joinLocation = useCallback(
    (locationId: string) => {
      socket?.emit('joinLocation', locationId)
    },
    [socket],
  )

  const leaveLocation = useCallback(
    (locationId: string) => {
      socket?.emit('leaveLocation', locationId)
    },
    [socket],
  )

  const subscribeToSlotUpdates = useCallback((callback: (payload: SlotUpdatedEvent) => void) => {
    slotUpdateListeners.current.add(callback)
    return () => {
      slotUpdateListeners.current.delete(callback)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <RealtimeContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        isLoadingNotifications,
        markAsRead,
        markAllAsRead,
        joinLocation,
        leaveLocation,
        subscribeToSlotUpdates,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}
