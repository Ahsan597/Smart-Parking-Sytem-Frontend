const RESERVATION_EXPIRY_MINUTES = 15

// Reservations auto-expire 15 minutes after startTime if never checked in (enforced by a backend cron job).
export function getReservationExpiry(startTime: string): string {
  return new Date(new Date(startTime).getTime() + RESERVATION_EXPIRY_MINUTES * 60000).toISOString()
}

// Mirrors the backend's checkout billing: hours parked, rounded up, minimum 1 hour, times the hourly rate.
export function computeEstimatedCost(checkinTime: string, hourlyRate: string, now: number = Date.now()): number {
  const elapsedMs = now - new Date(checkinTime).getTime()
  const hours = Math.max(1, Math.ceil(elapsedMs / (60 * 60 * 1000)))
  return hours * Number(hourlyRate)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function formatElapsed(since: string, now: number = Date.now()): string {
  const minutes = Math.max(0, Math.floor((now - new Date(since).getTime()) / 60000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}
