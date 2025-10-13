import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type { Unit, CreateUnitRequest, UpdateUnitRequest, UnitStatus } from '@/src/types/api/unit'

/**
 * Units API Service
 * Handles all unit (kitnet) related operations
 */
export const unitsService = {
  /**
   * Get all units with optional filters
   * @param status - Filter by unit status
   * @param floor - Filter by floor number
   */
  async getUnits(params?: { status?: UnitStatus; floor?: number }): Promise<Unit[]> {
    const response = await api.get<ApiResponse<Unit[]>>('/units', { params })
    const apiResponse = response as unknown as ApiResponse<Unit[]>
    return apiResponse.data || []
  },

  /**
   * Get unit by ID
   * @param id - Unit UUID
   */
  async getUnit(id: string): Promise<Unit> {
    const response = await api.get<ApiResponse<Unit>>(`/units/${id}`)
    const apiResponse = response as unknown as ApiResponse<Unit>
    return apiResponse.data as Unit
  },

  /**
   * Create new unit
   * @param data - Unit creation data
   */
  async createUnit(data: CreateUnitRequest): Promise<Unit> {
    const response = await api.post<ApiResponse<Unit>>('/units', data)
    const apiResponse = response as unknown as ApiResponse<Unit>
    return apiResponse.data as Unit
  },

  /**
   * Update existing unit
   * @param id - Unit UUID
   * @param data - Unit update data
   */
  async updateUnit(id: string, data: UpdateUnitRequest): Promise<Unit> {
    const response = await api.put<ApiResponse<Unit>>(`/units/${id}`, data)
    const apiResponse = response as unknown as ApiResponse<Unit>
    return apiResponse.data as Unit
  },

  /**
   * Update unit status
   * @param id - Unit UUID
   * @param status - New status
   */
  async updateUnitStatus(id: string, status: UnitStatus): Promise<void> {
    await api.patch(`/units/${id}/status`, { status })
  },

  /**
   * Delete unit
   * @param id - Unit UUID
   */
  async deleteUnit(id: string): Promise<void> {
    await api.delete(`/units/${id}`)
  },

  /**
   * Get occupancy statistics
   */
  async getOccupancyStats(): Promise<{
    total_units: number
    available_units: number
    occupied_units: number
    maintenance_units: number
    renovation_units: number
    occupancy_rate: number
  }> {
    const response = await api.get<
      ApiResponse<{
        total_units: number
        available_units: number
        occupied_units: number
        maintenance_units: number
        renovation_units: number
        occupancy_rate: number
      }>
    >('/units/stats/occupancy')
    const apiResponse = response as unknown as ApiResponse<{
      total_units: number
      available_units: number
      occupied_units: number
      maintenance_units: number
      renovation_units: number
      occupancy_rate: number
    }>
    return apiResponse.data as {
      total_units: number
      available_units: number
      occupied_units: number
      maintenance_units: number
      renovation_units: number
      occupancy_rate: number
    }
  },
}
