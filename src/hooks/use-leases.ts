import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leasesService } from '@/src/lib/api/leases.service'
import type {
  Lease,
  CreateLeaseRequest,
  RenewLeaseRequest,
  LeaseStats,
} from '@/src/types/api/lease'
import type { Payment } from '@/src/types/api/payment'
import { toast } from 'sonner'

/**
 * Hook para buscar lista de contratos com filtros opcionais
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
    enabled: !!id,
  })
}

/**
 * Hook para buscar estatísticas de contratos
 */
export function useLeaseStats() {
  return useQuery<LeaseStats>({
    queryKey: ['leases', 'stats'],
    queryFn: () => leasesService.getLeaseStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
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
    enabled: !!leaseId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Contrato cancelado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao cancelar contrato: ${error.message}`)
    },
  })
}
