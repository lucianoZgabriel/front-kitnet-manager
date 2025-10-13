import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsService } from '@/src/lib/api/tenants.service'
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/src/types/api/tenant'
import { toast } from 'sonner'

/**
 * Hook para buscar lista de inquilinos com busca opcional por nome
 */
export function useTenants(params?: { name?: string }) {
  return useQuery<Tenant[]>({
    queryKey: ['tenants', params],
    queryFn: () => tenantsService.getTenants(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para buscar um inquilino específico por ID
 */
export function useTenant(id: string) {
  return useQuery<Tenant>({
    queryKey: ['tenants', id],
    queryFn: () => tenantsService.getTenant(id),
    enabled: !!id,
  })
}

/**
 * Hook para buscar inquilino por CPF
 */
export function useTenantByCPF(cpf: string) {
  return useQuery<Tenant>({
    queryKey: ['tenants', 'cpf', cpf],
    queryFn: () => tenantsService.getTenantByCPF(cpf),
    enabled: !!cpf && cpf.length === 14, // CPF formatado tem 14 caracteres
  })
}

/**
 * Hook para criar novo inquilino
 */
export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      toast.success('Inquilino criado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao criar inquilino: ${error.message}`)
    },
  })
}

/**
 * Hook para atualizar inquilino existente
 * Note: CPF não pode ser atualizado (imutável)
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRequest }) =>
      tenantsService.updateTenant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.id] })
      toast.success('Inquilino atualizado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao atualizar inquilino: ${error.message}`)
    },
  })
}

/**
 * Hook para deletar inquilino
 * Note: Não pode deletar inquilino com contrato ativo
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tenantsService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      toast.success('Inquilino deletado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao deletar inquilino: ${error.message}`)
    },
  })
}
