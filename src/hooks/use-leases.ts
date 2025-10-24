import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leasesService } from '@/src/lib/api/leases.service'
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
import { toast } from 'sonner'

/**
 * Hook para buscar lista de contratos com filtros opcionais
 * IMPORTANTE: Não usamos enabled com token check porque isso pode causar
 * race conditions durante HMR. O axios interceptor já valida o token.
 */
export function useLeases(params?: { status?: string; unit_id?: string; tenant_id?: string }) {
  return useQuery<Lease[]>({
    queryKey: ['leases', params],
    queryFn: () => leasesService.getLeases(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para buscar um contrato específico por ID
 */
export function useLease(id: string) {
  return useQuery<Lease>({
    queryKey: ['leases', id],
    queryFn: () => leasesService.getLease(id),
    enabled: !!id, // Apenas verificar se tem ID
  })
}

/**
 * Hook para buscar estatísticas de contratos
 * Query opcional: falhas não devem quebrar a página
 */
export function useLeaseStats() {
  return useQuery<LeaseStats>({
    queryKey: ['leases', 'stats'],
    queryFn: () => leasesService.getLeaseStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Configurações específicas para query opcional
    retry: 1, // Apenas 1 retry
    retryDelay: 1000, // 1 segundo entre retries
    // Se falhar, não propagar erro - apenas retornar undefined
    throwOnError: false,
  })
}

/**
 * Hook para buscar contratos expirando em breve (45 dias)
 */
export function useExpiringSoonLeases() {
  return useQuery<Lease[]>({
    queryKey: ['leases', 'expiring-soon'],
    queryFn: () => leasesService.getExpiringSoonLeases(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para buscar pagamentos de um contrato
 */
export function useLeasePayments(leaseId: string) {
  return useQuery<Payment[]>({
    queryKey: ['leases', leaseId, 'payments'],
    queryFn: () => leasesService.getLeasePayments(leaseId),
    enabled: !!leaseId, // Apenas verificar se tem leaseId
    staleTime: 2 * 60 * 1000, // 2 minutos (pagamentos mudam com frequência)
  })
}

/**
 * Hook para criar novo contrato
 * Nota: Gera automaticamente 6 pagamentos mensais + parcelas da taxa de pintura
 */
export function useCreateLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLeaseRequest) => leasesService.createLease(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      const paymentsCount = result.payments.length
      toast.success(`Contrato criado com sucesso! ${paymentsCount} pagamento(s) gerado(s).`)
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao criar contrato: ${error.message}`)
    },
  })
}

/**
 * Hook para renovar contrato existente
 * Nota: Cria novo contrato de 6 meses após o término do contrato atual
 */
export function useRenewLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RenewLeaseRequest }) =>
      leasesService.renewLease(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['leases', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Contrato renovado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao renovar contrato: ${error.message}`)
    },
  })
}

/**
 * Hook para cancelar contrato
 * Nota: Altera status para 'cancelled', libera a unidade e cancela pagamentos pendentes
 */
export function useCancelLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => leasesService.cancelLease(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['leases', id] })
      queryClient.invalidateQueries({ queryKey: ['leases', id, 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Contrato cancelado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao cancelar contrato: ${error.message}`)
    },
  })
}

/**
 * Hook para buscar pagamentos canceláveis de um contrato
 * Retorna pagamentos com status 'pending' ou 'overdue'
 */
export function useCancellablePayments(leaseId: string) {
  return useQuery<Payment[]>({
    queryKey: ['leases', leaseId, 'cancellable-payments'],
    queryFn: () => leasesService.getCancellablePayments(leaseId),
    enabled: !!leaseId,
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

/**
 * Hook para cancelar contrato com seleção de pagamentos
 * Nota: Permite escolher quais pagamentos serão cancelados
 */
export function useCancelLeaseWithPayments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, paymentIds }: { id: string; paymentIds: string[] }) =>
      leasesService.cancelLeaseWithPayments(id, paymentIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['leases', id] })
      queryClient.invalidateQueries({ queryKey: ['leases', id, 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['leases', id, 'cancellable-payments'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Contrato e pagamentos selecionados cancelados com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao cancelar contrato: ${error.message}`)
    },
  })
}

/**
 * Hook para alterar dia de vencimento de pagamentos de um contrato
 * Nota: Gera pagamento proporcional e recalcula pagamentos futuros
 */
export function useChangePaymentDueDay() {
  const queryClient = useQueryClient()

  return useMutation<
    ChangePaymentDueDayResponse,
    { message: string },
    { id: string; data: ChangePaymentDueDayRequest }
  >({
    mutationFn: ({ id, data }) => leasesService.changePaymentDueDay(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['leases', id] })
      queryClient.invalidateQueries({ queryKey: ['leases', id, 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Dia de vencimento alterado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao alterar dia de vencimento: ${error.message}`)
    },
  })
}

/**
 * Hook para buscar histórico de reajustes de aluguel de um contrato
 */
export function useLeaseRentAdjustments(leaseId: string) {
  return useQuery<LeaseRentAdjustment[]>({
    queryKey: ['leases', leaseId, 'rent-adjustments'],
    queryFn: () => leasesService.getLeaseRentAdjustments(leaseId),
    enabled: !!leaseId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
