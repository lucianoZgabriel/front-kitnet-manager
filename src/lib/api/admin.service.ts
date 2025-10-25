import { api } from './client'

export interface ForceSchedulerResponse {
  success: boolean
  message: string
  data: {
    executed_at: string
    tasks: string[]
  }
}

/**
 * Força execução manual do scheduler
 * Executa todas as tarefas agendadas:
 * - mark_overdue_payments (marca pagamentos atrasados)
 * - check_expiring_soon_leases (verifica contratos expirando)
 * - auto_renew_leases (renova contratos automaticamente)
 */
export const forceSchedulerRun = async (): Promise<ForceSchedulerResponse> => {
  return api.post('/admin/force-scheduler')
}
