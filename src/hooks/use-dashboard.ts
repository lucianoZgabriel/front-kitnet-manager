import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/src/lib/api/dashboard.service'
import type { DashboardResponse } from '@/src/types/api/dashboard'

/**
 * Hook para buscar dados do dashboard
 * Atualiza automaticamente a cada 60 segundos
 */
export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    refetchInterval: 60000, // Atualiza a cada 1 minuto
    staleTime: 30000, // Considera dados frescos por 30 segundos
  })
}
