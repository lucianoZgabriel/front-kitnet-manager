import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type {
  Lease,
  CreateLeaseRequest,
  RenewLeaseRequest,
  LeaseStats,
  ChangePaymentDueDayRequest,
  ChangePaymentDueDayResponse,
  LeaseRentAdjustment,
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
   * Get cancellable payments for a lease
   * Returns payments with status 'pending' or 'overdue' that can be cancelled
   * @param leaseId - Lease UUID
   */
  async getCancellablePayments(leaseId: string): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>(
      `/leases/${leaseId}/cancellable-payments`
    )
    const apiResponse = response as unknown as ApiResponse<Payment[]>
    return apiResponse.data || []
  },

  /**
   * Cancel lease with selected payments
   * Note: Allows user to select which payments to cancel
   * @param id - Lease UUID
   * @param paymentIds - Array of payment UUIDs to cancel
   */
  async cancelLeaseWithPayments(id: string, paymentIds: string[]): Promise<void> {
    await api.post(`/leases/${id}/cancel-with-payments`, { payment_ids: paymentIds })
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

  /**
   * Change payment due day for a lease
   * Note: Calculates proportional payment and updates all future pending/overdue payments
   * @param id - Lease UUID
   * @param data - Change payment due day data
   */
  async changePaymentDueDay(
    id: string,
    data: ChangePaymentDueDayRequest
  ): Promise<ChangePaymentDueDayResponse> {
    const response = await api.post<ApiResponse<ChangePaymentDueDayResponse>>(
      `/leases/${id}/change-payment-due-day`,
      data
    )
    const apiResponse = response as unknown as ApiResponse<ChangePaymentDueDayResponse>
    return apiResponse.data as ChangePaymentDueDayResponse
  },

  /**
   * Get rent adjustment history for a lease
   * @param id - Lease UUID
   */
  async getLeaseRentAdjustments(id: string): Promise<LeaseRentAdjustment[]> {
    const response = await api.get<ApiResponse<LeaseRentAdjustment[]>>(
      `/leases/${id}/rent-adjustments`
    )
    const apiResponse = response as unknown as ApiResponse<LeaseRentAdjustment[]>
    return apiResponse.data || []
  },
}
