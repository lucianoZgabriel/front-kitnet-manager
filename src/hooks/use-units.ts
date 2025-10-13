import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { unitsService } from '@/src/lib/api/units.service'
import type { Unit, CreateUnitRequest, UpdateUnitRequest, UnitStatus } from '@/src/types/api/unit'
import { toast } from 'sonner'

/**
 * Hook para buscar lista de unidades com filtros
 */
export function useUnits(params?: { status?: UnitStatus; floor?: number }) {
  return useQuery<Unit[]>({
    queryKey: ['units', params],
    queryFn: () => unitsService.getUnits(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para buscar uma unidade específica por ID
 */
export function useUnit(id: string) {
  return useQuery<Unit>({
    queryKey: ['units', id],
    queryFn: () => unitsService.getUnit(id),
    enabled: !!id,
  })
}

/**
 * Hook para criar nova unidade
 */
export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUnitRequest) => unitsService.createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Unidade criada com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao criar unidade: ${error.message}`)
    },
  })
}

/**
 * Hook para atualizar unidade existente
 */
export function useUpdateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitRequest }) =>
      unitsService.updateUnit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['units', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Unidade atualizada com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao atualizar unidade: ${error.message}`)
    },
  })
}

/**
 * Hook para atualizar status da unidade
 */
export function useUpdateUnitStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UnitStatus }) =>
      unitsService.updateUnitStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['units', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Status atualizado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao atualizar status: ${error.message}`)
    },
  })
}

/**
 * Hook para deletar unidade
 */
export function useDeleteUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => unitsService.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Unidade deletada com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao deletar unidade: ${error.message}`)
    },
  })
}

/**
 * Hook para buscar estatísticas de ocupação
 */
export function useOccupancyStats() {
  return useQuery({
    queryKey: ['units', 'stats', 'occupancy'],
    queryFn: () => unitsService.getOccupancyStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}
