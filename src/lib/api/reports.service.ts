import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type {
  FinancialReportRequest,
  FinancialReportResponse,
  PaymentHistoryRequest,
  PaymentHistoryResponse,
} from '@/src/types/api/dashboard'

/**
 * Reports API Service
 * Handles financial and payment reports with advanced filtering
 */
export const reportsService = {
  /**
   * Get financial report
   * Returns financial summary, breakdown by type/status, and payment list
   * @param params - Date range and optional filters (payment_type, status)
   */
  async getFinancialReport(params: FinancialReportRequest): Promise<FinancialReportResponse> {
    const response = await api.get<ApiResponse<FinancialReportResponse>>('/reports/financial', {
      params: {
        start_date: params.start_date,
        end_date: params.end_date,
        ...(params.payment_type && { payment_type: params.payment_type }),
        ...(params.status && { status: params.status }),
      },
    })
    const apiResponse = response as unknown as ApiResponse<FinancialReportResponse>
    return apiResponse.data as FinancialReportResponse
  },

  /**
   * Get payment history report
   * Returns payment history with optional filters
   * @param params - Optional filters (lease_id, tenant_id, status, date range)
   */
  async getPaymentHistory(params?: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    const response = await api.get<ApiResponse<PaymentHistoryResponse>>('/reports/payments', {
      params: {
        ...(params?.lease_id && { lease_id: params.lease_id }),
        ...(params?.tenant_id && { tenant_id: params.tenant_id }),
        ...(params?.status && { status: params.status }),
        ...(params?.start_date && { start_date: params.start_date }),
        ...(params?.end_date && { end_date: params.end_date }),
      },
    })
    const apiResponse = response as unknown as ApiResponse<PaymentHistoryResponse>
    return apiResponse.data as PaymentHistoryResponse
  },
}
