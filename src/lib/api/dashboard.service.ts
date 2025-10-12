import { api } from './client'
import type { DashboardResponse } from '@/src/types/api/dashboard'
import type { ApiResponse } from '@/src/types/api/auth'

/**
 * Dashboard API Service
 * Handles dashboard metrics and alerts
 */
export const dashboardService = {
  /**
   * Get dashboard metrics
   * Returns occupancy, financial, contracts data and alerts
   */
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<ApiResponse<DashboardResponse>>('/dashboard')
    // O interceptor já retorna response.data, que é ApiResponse<T>
    // Precisamos acessar o campo 'data' dentro de ApiResponse
    const apiResponse = response as unknown as ApiResponse<DashboardResponse>
    return apiResponse.data as DashboardResponse
  },
}
