export type SlotType = 'NORMAL' | 'VIP' | 'EV' | 'DISABLED'
export type SlotStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE'

export interface Slot {
  id: string
  floorId: string
  slotCode: string
  slotType: SlotType
  status: SlotStatus
  createdAt: string
  updatedAt: string
}

export interface CreateSlotPayload {
  slotCode: string
  slotType?: SlotType
}

export type UpdateSlotPayload = Partial<CreateSlotPayload>

export interface UpdateSlotStatusPayload {
  status: SlotStatus
}
