import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsService } from '@/src/lib/api/payments.service'
import type { Payment, MarkPaymentAsPaidRequest, PaymentStats } from '@/src/types/api/payment'
import { toast } from 'sonner'

/**
 * Hook para buscar um pagamento específico por ID
 */
export function usePayment(id: string) {
  return useQuery<Payment>({
    queryKey: ['payments', id],
    queryFn: () => paymentsService.getPayment(id),
    enabled: !!id, // Apenas verificar se tem ID
  })
}

/**
 * Hook para buscar pagamentos de um contrato
 * Usado na página de detalhes do contrato
 */
export function useLeasePayments(leaseId: string) {
  return useQuery<Payment[]>({
    queryKey: ['leases', leaseId, 'payments'],
    queryFn: () => paymentsService.getLeasePayments(leaseId),
    enabled: !!leaseId, // Apenas verificar se tem leaseId
    staleTime: 2 * 60 * 1000, // 2 minutos (pagamentos mudam com frequência)
  })
}

/**
 * Hook para buscar pagamentos atrasados
 * Usado na página de pagamentos atrasados
 */
export function useOverduePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments', 'overdue'],
    queryFn: () => paymentsService.getOverduePayments(),
    staleTime: 1 * 60 * 1000, // 1 minuto (informação crítica, atualizar frequentemente)
  })
}

/**
 * Hook para buscar próximos vencimentos
 * @param days - Número de dias à frente (padrão: 7)
 */
export function useUpcomingPayments(days: number = 7) {
  return useQuery<Payment[]>({
    queryKey: ['payments', 'upcoming', days],
    queryFn: () => paymentsService.getUpcomingPayments(days),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para buscar estatísticas de pagamentos de um contrato
 */
export function usePaymentStats(leaseId: string) {
  return useQuery<PaymentStats>({
    queryKey: ['leases', leaseId, 'payments', 'stats'],
    queryFn: () => paymentsService.getPaymentStats(leaseId),
    enabled: !!leaseId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para marcar pagamento como pago
 * Nota: Se o pagamento for painting_fee, atualiza automaticamente o contador no contrato
 */
export function useMarkPaymentAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkPaymentAsPaidRequest }) =>
      paymentsService.markPaymentAsPaid(id, data),
    onSuccess: (payment) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['leases', payment.lease_id, 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['leases', payment.lease_id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast.success('Pagamento marcado como pago com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao marcar pagamento como pago: ${error.message}`)
    },
  })
}

/**
 * Hook para cancelar pagamento
 * Nota: Apenas pagamentos com status 'pending' ou 'overdue' podem ser cancelados
 */
export function useCancelPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => paymentsService.cancelPayment(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast.success('Pagamento cancelado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao cancelar pagamento: ${error.message}`)
    },
  })
}
