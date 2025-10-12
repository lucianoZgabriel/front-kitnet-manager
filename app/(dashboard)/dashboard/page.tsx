'use client'

import { useDashboard } from '@/src/hooks/use-dashboard'
import { StatsCard } from '@/src/components/dashboard/stats-card'
import { AlertsList } from '@/src/components/dashboard/alerts-list'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { Home, DollarSign, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/src/lib/utils/format'

export default function DashboardPage() {
  const { data: dashboard, isLoading, error, refetch } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <ErrorMessage
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar as métricas do dashboard"
        retry={refetch}
      />
    )
  }

  const { occupancy, financial, contracts, alerts } = dashboard

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de gestão de kitnets</p>
      </div>

      {/* Métricas de Ocupação */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Ocupação</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Taxa de Ocupação"
            value={`${occupancy.occupancy_rate.toFixed(1)}%`}
            description={`${occupancy.occupied_units} de ${occupancy.total_units} unidades`}
            icon={TrendingUp}
            iconClassName="text-blue-600"
          />
          <StatsCard
            title="Unidades Disponíveis"
            value={occupancy.available_units}
            description="Prontas para locação"
            icon={CheckCircle}
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Em Manutenção"
            value={occupancy.maintenance_units}
            description="Unidades em reparo"
            icon={AlertTriangle}
            iconClassName="text-yellow-600"
          />
          <StatsCard
            title="Em Reforma"
            value={occupancy.renovation_units}
            description="Unidades em renovação"
            icon={Home}
            iconClassName="text-purple-600"
          />
        </div>
      </div>

      {/* Métricas Financeiras */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Financeiro</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Receita Mensal"
            value={formatCurrency(financial.monthly_revenue)}
            description="Receita esperada"
            icon={DollarSign}
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Total Recebido"
            value={formatCurrency(financial.total_received)}
            description="Pagamentos confirmados"
            icon={CheckCircle}
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Pagamentos Pendentes"
            value={formatCurrency(financial.total_pending)}
            description={`${financial.pending_count} pagamento(s)`}
            icon={AlertTriangle}
            iconClassName="text-yellow-600"
          />
          <StatsCard
            title="Pagamentos Atrasados"
            value={formatCurrency(financial.total_overdue)}
            description={`${financial.overdue_count} pagamento(s)`}
            icon={AlertTriangle}
            iconClassName="text-red-600"
          />
        </div>
      </div>

      {/* Métricas de Contratos */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Contratos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Contratos Ativos"
            value={contracts.total_active_leases}
            description="Contratos vigentes"
            icon={FileText}
            iconClassName="text-blue-600"
          />
          <StatsCard
            title="Expirando em Breve"
            value={contracts.expiring_soon_count}
            description="Próximos 45 dias"
            icon={AlertTriangle}
            iconClassName="text-yellow-600"
          />
          <StatsCard
            title="Contratos Expirados"
            value={contracts.expired_count}
            description="Aguardando renovação"
            icon={AlertTriangle}
            iconClassName="text-red-600"
          />
        </div>
      </div>

      {/* Alertas */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Alertas e Notificações</h2>
        <AlertsList alerts={alerts} />
      </div>
    </div>
  )
}
