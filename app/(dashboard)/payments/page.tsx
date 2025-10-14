'use client'

import Link from 'next/link'
import { useOverduePayments, useUpcomingPayments } from '@/src/hooks/use-payments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import {
  AlertTriangle,
  Calendar,
  ArrowRight,
  DollarSign,
  Clock,
  FileText,
  BarChart3,
} from 'lucide-react'
import { formatCurrency } from '@/src/lib/utils/format'
import { useMemo } from 'react'

export default function PaymentsPage() {
  const { data: overduePayments } = useOverduePayments()
  const { data: upcomingPayments } = useUpcomingPayments(7)

  const overdueTotal = useMemo(() => {
    if (!overduePayments) return 0
    return overduePayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
  }, [overduePayments])

  const upcomingTotal = useMemo(() => {
    if (!upcomingPayments) return 0
    return upcomingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
  }, [upcomingPayments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestão de Pagamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe pagamentos atrasados e próximos vencimentos
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pagamentos Atrasados */}
        <Card className="border-red-200 transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Pagamentos Atrasados
              </CardTitle>
              <div className="rounded-full bg-red-100 px-3 py-1">
                <span className="text-sm font-bold text-red-700">
                  {overduePayments?.length || 0}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Valor Total</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueTotal)}</p>
            </div>

            <div className="border-t pt-2">
              <p className="text-muted-foreground mb-3 text-sm">
                Gerencie pagamentos em atraso com cálculo automático de multas e juros
              </p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/payments/overdue">
                  Ver Atrasados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Vencimentos */}
        <Card className="border-blue-200 transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Calendar className="h-5 w-5 text-blue-600" />
                Próximos Vencimentos
              </CardTitle>
              <div className="rounded-full bg-blue-100 px-3 py-1">
                <span className="text-sm font-bold text-blue-700">
                  {upcomingPayments?.length || 0}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Valor nos Próximos 7 Dias</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(upcomingTotal)}</p>
            </div>

            <div className="border-t pt-2">
              <p className="text-muted-foreground mb-3 text-sm">
                Acompanhe pagamentos que vencem em breve e organize seu fluxo de caixa
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/payments/upcoming">
                  Ver Próximos Vencimentos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <AlertTriangle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overduePayments?.length || 0) + (upcomingPayments?.length || 0)}
            </div>
            <p className="text-muted-foreground text-xs">Pagamentos que requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Aberto</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overdueTotal + upcomingTotal)}</div>
            <p className="text-muted-foreground text-xs">Total atrasado + próximos vencimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos Hoje</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {upcomingPayments?.filter((p) => {
                const today = new Date().toISOString().split('T')[0]
                return p.due_date === today
              }).length || 0}
            </div>
            <p className="text-muted-foreground text-xs">Pagamentos com vencimento hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Button asChild variant="outline" className="h-auto justify-start py-4">
            <Link href="/leases">
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Ver Contratos</div>
                <div className="text-muted-foreground text-xs">Acesse pagamentos por contrato</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto justify-start py-4">
            <Link href="/dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Dashboard</div>
                <div className="text-muted-foreground text-xs">
                  Visão geral de todas as métricas
                </div>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
