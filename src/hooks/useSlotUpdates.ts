import { useEffect } from 'react'
import { useRealtime } from './useRealtime'
import type { SlotUpdatedEvent } from '../types/realtime.types'

// Joins the location's socket room while mounted and forwards matching slotUpdated
// events to onUpdate. Waits for the socket to exist before joining (it connects
// asynchronously after login), so it's safe to call as soon as locationId is known.
export function useSlotUpdates(locationId: string | undefined, onUpdate: (payload: SlotUpdatedEvent) => void) {
  const { socket, joinLocation, leaveLocation, subscribeToSlotUpdates } = useRealtime()

  useEffect(() => {
    if (!socket || !locationId) return

    joinLocation(locationId)
    const unsubscribe = subscribeToSlotUpdates((payload) => {
      if (payload.parkingLocationId === locationId) {
        onUpdate(payload)
      }
    })

    return () => {
      leaveLocation(locationId)
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, locationId])
}
