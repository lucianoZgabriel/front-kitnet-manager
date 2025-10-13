import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type {
  Lease,
  CreateLeaseRequest,
  RenewLeaseRequest,
  LeaseStats,
} from '@/src/types/api/lease'
import type { Payment } from '@/src/types/api/payment'

/**
 * Leases API Service
 * Handles all lease (contrato) related operations
 */
export const leasesService = {
  /**
   * Get all leases with optional filters
   * @param params - Filter parameters (status, unit_id, tenant_id)
   */
  async getLeases(params?: {
    status?: string
    unit_id?: string
    tenant_id?: string
  }): Promise<Lease[]> {
    const response = await api.get<ApiResponse<Lease[]>>('/leases', { params })
    const apiResponse = response as unknown as ApiResponse<Lease[]>
    return apiResponse.data || []
  },

  /**
   * Get lease by ID
   * @param id - Lease UUID
   */
  async getLease(id: string): Promise<Lease> {
    const response = await api.get<ApiResponse<Lease>>(`/leases/${id}`)
    const apiResponse = response as unknown as ApiResponse<Lease>
    return apiResponse.data as Lease
  },

  /**
   * Get lease statistics
   */
  async getLeaseStats(): Promise<LeaseStats> {
    const response = await api.get<ApiResponse<LeaseStats>>('/leases/stats')
    const apiResponse = response as unknown as ApiResponse<LeaseStats>
    return apiResponse.data as LeaseStats
  },

  /**
   * Get leases expiring soon (45 days)
   */
  async getExpiringSoonLeases(): Promise<Lease[]> {
    const response = await api.get<ApiResponse<Lease[]>>('/leases/expiring-soon')
    const apiResponse = response as unknown as ApiResponse<Lease[]>
    return apiResponse.data || []
  },

  /**
   * Create new lease
   * Note: Automatically generates 6 monthly payments + painting fee installments
   * @param data - Lease creation data
   */
  async createLease(data: CreateLeaseRequest): Promise<{ lease: Lease; payments: Payment[] }> {
    const response = await api.post<ApiResponse<{ lease: Lease; payments: Payment[] }>>(
      '/leases',
      data
    )
    const apiResponse = response as unknown as ApiResponse<{
      lease: Lease
      payments: Payment[]
    }>
    return apiResponse.data as { lease: Lease; payments: Payment[] }
  },

  /**
   * Renew existing lease
   * Note: Creates new 6-month lease starting after current lease ends
   * @param id - Lease UUID
   * @param data - Renewal data (painting fee)
   */
  async renewLease(id: string, data: RenewLeaseRequest): Promise<Lease> {
    const response = await api.post<ApiResponse<Lease>>(`/leases/${id}/renew`, data)
    const apiResponse = response as unknown as ApiResponse<Lease>
    return apiResponse.data as Lease
  },

  /**
   * Cancel lease
   * Note: Changes lease status to 'cancelled', unit to 'available', and cancels pending payments
   * @param id - Lease UUID
   */
  async cancelLease(id: string): Promise<void> {
    await api.post(`/leases/${id}/cancel`)
  },

  /**
   * Get payments for a lease
   * @param leaseId - Lease UUID
   */
  async getLeasePayments(leaseId: string): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>(`/leases/${leaseId}/payments`)
    const apiResponse = response as unknown as ApiResponse<Payment[]>
    return apiResponse.data || []
  },
}
