import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type { Payment, MarkPaymentAsPaidRequest, PaymentStats } from '@/src/types/api/payment'

/**
 * Payments API Service
 * Handles all payment related operations
 */
export const paymentsService = {
  /**
   * Get payment by ID
   * @param id - Payment UUID
   */
  async getPayment(id: string): Promise<Payment> {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`)
    const apiResponse = response as unknown as ApiResponse<Payment>
    return apiResponse.data as Payment
  },

  /**
   * Get payments by lease
   * @param leaseId - Lease UUID
   */
  async getLeasePayments(leaseId: string): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>(`/leases/${leaseId}/payments`)
    const apiResponse = response as unknown as ApiResponse<Payment[]>
    return apiResponse.data || []
  },

  /**
   * Get overdue payments
   * Returns all payments with status 'overdue' (past due_date)
   */
  async getOverduePayments(): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>('/payments/overdue')
    const apiResponse = response as unknown as ApiResponse<Payment[]>
    return apiResponse.data || []
  },

  /**
   * Get upcoming payments
   * @param days - Number of days ahead to look (default: 7)
   */
  async getUpcomingPayments(days: number = 7): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>('/payments/upcoming', {
      params: { days },
    })
    const apiResponse = response as unknown as ApiResponse<Payment[]>
    return apiResponse.data || []
  },

  /**
   * Mark payment as paid
   * @param id - Payment UUID
   * @param data - Payment date and method
   */
  async markPaymentAsPaid(id: string, data: MarkPaymentAsPaidRequest): Promise<Payment> {
    const response = await api.put<ApiResponse<Payment>>(`/payments/${id}/pay`, data)
    const apiResponse = response as unknown as ApiResponse<Payment>
    return apiResponse.data as Payment
  },

  /**
   * Cancel payment
   * Note: Can only cancel payments with status 'pending' or 'overdue'
   * @param id - Payment UUID
   */
  async cancelPayment(id: string): Promise<void> {
    await api.post(`/payments/${id}/cancel`)
  },

  /**
   * Get payment statistics by lease
   * @param leaseId - Lease UUID
   */
  async getPaymentStats(leaseId: string): Promise<PaymentStats> {
    const response = await api.get<ApiResponse<PaymentStats>>(`/leases/${leaseId}/payments/stats`)
    const apiResponse = response as unknown as ApiResponse<PaymentStats>
    return apiResponse.data as PaymentStats
  },
}
