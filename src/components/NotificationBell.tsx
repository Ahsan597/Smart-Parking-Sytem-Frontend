import { useEffect, useRef, useState } from 'react'
import { useRealtime } from '../hooks/useRealtime'

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function NotificationBell() {
  const { notifications, unreadCount, isLoadingNotifications, markAsRead, markAllAsRead } = useRealtime()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-md border border-navy-600 p-2 text-slate-300 transition hover:border-navy-500 hover:text-white"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-navy-700 bg-navy-900 shadow-lg">
          <div className="flex items-center justify-between border-b border-navy-700 px-4 py-3">
            <p className="text-sm font-medium text-white">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead()} className="text-xs text-electric-400 hover:text-electric-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isLoadingNotifications ? (
              <p className="px-4 py-3 text-sm text-slate-400">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                  className={`block w-full border-b border-navy-800 px-4 py-3 text-left transition last:border-b-0 hover:bg-navy-800 ${
                    notification.isRead ? '' : 'bg-electric-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{notification.title}</p>
                    {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-400" />}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{timeAgo(notification.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
