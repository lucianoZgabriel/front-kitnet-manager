'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLeases, useLeaseStats } from '@/src/hooks/use-leases'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { Button } from '@/src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Plus, Eye, Edit } from 'lucide-react'
import { Card } from '@/src/components/ui/card'
import { LeaseStatusBadge } from '@/src/components/leases/lease-status-badge'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import type { LeaseStatus } from '@/src/types/api/lease'

export default function LeasesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  // TEMPORARIAMENTE DESABILITADO PARA TESTAR SE QUERIES SIMULTÂNEAS CAUSAM 401
  // const { data: stats } = useLeaseStats()
  const { data: stats } = useLeaseStats()
  const {
    data: leases,
    isLoading,
    error,
    refetch,
  } = useLeases(statusFilter === 'all' ? undefined : { status: statusFilter })

  // Mostrar loading apenas para a lista de leases (stats é opcional)
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !leases) {
    return (
      <ErrorMessage
        title="Erro ao carregar contratos"
        message="Não foi possível carregar a lista de contratos"
        retry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contratos</h1>
          <p className="text-muted-foreground">Gerencie os contratos de locação</p>
        </div>
        <Button asChild>
          <Link href="/leases/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Link>
        </Button>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="p-4">
            <p className="text-muted-foreground text-sm font-medium">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm font-medium">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm font-medium">Expirando em Breve</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.expiring_soon}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm font-medium">Expirados</p>
            <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm font-medium">Cancelados</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="expiring_soon">Expirando em Breve</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground flex-1 text-sm">
          Mostrando {leases.length} contrato(s)
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Início</th>
                <th className="p-4 text-left text-sm font-medium">Término</th>
                <th className="p-4 text-left text-sm font-medium">Valor Mensal</th>
                <th className="p-4 text-left text-sm font-medium">Vencimento</th>
                <th className="p-4 text-left text-sm font-medium">Taxa Pintura</th>
                <th className="p-4 text-right text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-muted-foreground p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-medium">Nenhum contrato encontrado</p>
                      <p className="text-sm">
                        {statusFilter === 'all'
                          ? 'Crie um novo contrato para começar'
                          : 'Tente alterar os filtros'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-muted/50 border-b">
                    <td className="p-4">
                      <LeaseStatusBadge status={lease.status as LeaseStatus} />
                    </td>
                    <td className="p-4 text-sm">{formatDate(lease.start_date)}</td>
                    <td className="p-4 text-sm">{formatDate(lease.end_date)}</td>
                    <td className="p-4 text-sm font-medium">
                      {formatCurrency(parseFloat(lease.monthly_rent_value))}
                    </td>
                    <td className="p-4 text-sm">Dia {lease.payment_due_day}</td>
                    <td className="p-4 text-sm">
                      {formatCurrency(parseFloat(lease.painting_fee_total))}
                      <span className="text-muted-foreground text-xs">
                        {' '}
                        ({lease.painting_fee_installments}x)
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/leases/${lease.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/leases/${lease.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
