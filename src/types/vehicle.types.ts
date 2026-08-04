export type VehicleType = 'CAR' | 'BIKE' | 'SUV' | 'TRUCK' | 'VAN' | 'EV'

export interface Vehicle {
  id: string
  userId: string
  vehicleNumber: string
  vehicleType: VehicleType
  vehicleBrand: string | null
  vehicleModel: string | null
  vehicleColor: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVehiclePayload {
  vehicleNumber: string
  vehicleType: VehicleType
  vehicleBrand?: string
  vehicleModel?: string
  vehicleColor?: string
  isDefault?: boolean
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>
