import type { Slot } from './slot.types'

export interface Floor {
  id: string
  parkingLocationId: string
  name: string
  floorNumber: number
  createdAt: string
  updatedAt: string
}

export interface FloorWithSlots extends Floor {
  slots: Slot[]
}

export interface CreateFloorPayload {
  name: string
  floorNumber: number
}

export type UpdateFloorPayload = Partial<CreateFloorPayload>
