import { useQuery } from '@tanstack/react-query'
import { reportsService } from '@/src/lib/api/reports.service'
import type {
  FinancialReportRequest,
  FinancialReportResponse,
  PaymentHistoryRequest,
  PaymentHistoryResponse,
} from '@/src/types/api/dashboard'

/**
 * Hook para buscar relatório financeiro
 * @param params - Date range (required) e filtros opcionais (payment_type, status)
 */
export function useFinancialReport(params: FinancialReportRequest) {
  return useQuery<FinancialReportResponse>({
    queryKey: ['reports', 'financial', params],
    queryFn: () => reportsService.getFinancialReport(params),
    enabled: !!params.start_date && !!params.end_date, // Apenas executar se tem as datas obrigatórias
    staleTime: 5 * 60 * 1000, // 5 minutos (relatórios são menos voláteis)
  })
}

/**
 * Hook para buscar histórico de pagamentos
 * @param params - Filtros opcionais (lease_id, tenant_id, status, date range)
 */
export function usePaymentHistory(params?: PaymentHistoryRequest) {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ['reports', 'payments', params],
    queryFn: () => reportsService.getPaymentHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
