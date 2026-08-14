import type { SlotStatus } from './slot.types'

export interface SlotUpdatedEvent {
  slotId: string
  slotCode: string
  floorId: string
  parkingLocationId: string
  locationName: string
  previousStatus: SlotStatus
  status: SlotStatus
}
