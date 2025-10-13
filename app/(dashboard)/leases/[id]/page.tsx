'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLease, useLeasePayments, useCancelLease, useRenewLease } from '@/src/hooks/use-leases'
import { useTenant } from '@/src/hooks/use-tenants'
import { useUnit } from '@/src/hooks/use-units'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { ConfirmDialog } from '@/src/components/shared/confirm-dialog'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Badge } from '@/src/components/ui/badge'
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react'
import { LeaseStatusBadge } from '@/src/components/leases/lease-status-badge'
import { formatCurrency, formatDate, formatDateTime, formatCPF } from '@/src/lib/utils/format'

export default function LeaseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: lease, isLoading, error, refetch } = useLease(id)
  const { data: payments, isLoading: paymentsLoading } = useLeasePayments(id)
  const cancelLease = useCancelLease()
  const renewLease = useRenewLease()

  // Buscar dados relacionados
  const { data: tenant } = useTenant(lease?.tenant_id || '')
  const { data: unit } = useUnit(lease?.unit_id || '')

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRenewDialog, setShowRenewDialog] = useState(false)
  const [renewPaintingFee, setRenewPaintingFee] = useState('250.00')
  const [renewInstallments, setRenewInstallments] = useState(2)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !lease) {
    return (
      <ErrorMessage
        title="Erro ao carregar contrato"
        message="Não foi possível carregar os dados do contrato"
        retry={refetch}
      />
    )
  }

  const handleCancel = async () => {
    try {
      await cancelLease.mutateAsync(id)
      setShowCancelDialog(false)
      router.push('/leases')
    } catch {
      // Erro já tratado pelo hook
    }
  }

  const handleRenew = async () => {
    try {
      await renewLease.mutateAsync({
        id,
        data: {
          painting_fee_total: renewPaintingFee,
          painting_fee_installments: renewInstallments,
        },
      })
      setShowRenewDialog(false)
    } catch {
      // Erro já tratado pelo hook
    }
  }

  const canCancel = lease.status === 'active' || lease.status === 'expiring_soon'
  const canRenew = lease.status === 'active' || lease.status === 'expiring_soon'

  // Calcular estatísticas de pagamento
  const totalPayments = payments?.length || 0
  const paidPayments = payments?.filter((p) => p.status === 'paid').length || 0
  const overduePayments = payments?.filter((p) => p.status === 'overdue').length || 0
  const pendingPayments = payments?.filter((p) => p.status === 'pending').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/leases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Contratos
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Detalhes do Contrato</h1>
            <p className="text-muted-foreground">Informações completas do contrato de locação</p>
          </div>
          <div className="flex gap-2">
            {canRenew && (
              <Button variant="outline" onClick={() => setShowRenewDialog(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Renovar
              </Button>
            )}
            {canCancel && (
              <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status e Datas */}
        <Card>
          <CardHeader>
            <CardTitle>Status e Período</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Status</p>
              <LeaseStatusBadge status={lease.status} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Data de Assinatura</p>
              <p className="text-sm">{formatDate(lease.contract_signed_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Período do Contrato</p>
              <p className="text-sm">
                {formatDate(lease.start_date)} até {formatDate(lease.end_date)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Duração</p>
              <p className="text-sm">6 meses</p>
            </div>
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Aluguel Mensal</p>
              <p className="text-2xl font-bold">
                {formatCurrency(parseFloat(lease.monthly_rent_value))}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Dia de Vencimento</p>
              <p className="text-sm">Dia {lease.payment_due_day} de cada mês</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Taxa de Pintura</p>
              <p className="text-sm">
                {formatCurrency(parseFloat(lease.painting_fee_total))} em{' '}
                {lease.painting_fee_installments}x
              </p>
              <p className="text-muted-foreground text-xs">
                Pago: {formatCurrency(parseFloat(lease.painting_fee_paid))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unidade e Inquilino */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Unidade */}
        <Card>
          <CardHeader>
            <CardTitle>Unidade</CardTitle>
          </CardHeader>
          <CardContent>
            {unit ? (
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Número</p>
                  <p className="text-lg font-semibold">Unidade {unit.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Andar</p>
                  <p className="text-sm">{unit.floor}º andar</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Status</p>
                  <Badge>{unit.status}</Badge>
                </div>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href={`/units/${unit.id}`}>Ver Detalhes da Unidade</Link>
                </Button>
              </div>
            ) : (
              <LoadingSpinner size="sm" />
            )}
          </CardContent>
        </Card>

        {/* Inquilino */}
        <Card>
          <CardHeader>
            <CardTitle>Inquilino</CardTitle>
          </CardHeader>
          <CardContent>
            {tenant ? (
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Nome</p>
                  <p className="text-lg font-semibold">{tenant.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">CPF</p>
                  <p className="text-sm">{formatCPF(tenant.cpf)}</p>
                </div>
                {tenant.phone && (
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Telefone</p>
                    <p className="text-sm">{tenant.phone}</p>
                  </div>
                )}
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href={`/tenants/${tenant.id}`}>Ver Detalhes do Inquilino</Link>
                </Button>
              </div>
            ) : (
              <LoadingSpinner size="sm" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>Timeline de todos os pagamentos deste contrato</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <LoadingSpinner size="md" />
          ) : payments && payments.length > 0 ? (
            <>
              {/* Estatísticas de Pagamento */}
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs font-medium">Total</p>
                  <p className="text-2xl font-bold">{totalPayments}</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs font-medium text-green-700">Pagos</p>
                  <p className="text-2xl font-bold text-green-700">{paidPayments}</p>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-xs font-medium text-yellow-700">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-700">{pendingPayments}</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-medium text-red-700">Atrasados</p>
                  <p className="text-2xl font-bold text-red-700">{overduePayments}</p>
                </div>
              </div>

              {/* Tabela de Pagamentos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left text-sm font-medium">Tipo</th>
                      <th className="p-2 text-left text-sm font-medium">Referência</th>
                      <th className="p-2 text-left text-sm font-medium">Vencimento</th>
                      <th className="p-2 text-left text-sm font-medium">Valor</th>
                      <th className="p-2 text-left text-sm font-medium">Status</th>
                      <th className="p-2 text-left text-sm font-medium">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-muted/50 border-b">
                        <td className="p-2 text-sm">
                          {payment.payment_type === 'rent'
                            ? 'Aluguel'
                            : payment.payment_type === 'painting_fee'
                              ? 'Taxa Pintura'
                              : 'Ajuste'}
                        </td>
                        <td className="p-2 text-sm">{formatDate(payment.reference_month)}</td>
                        <td className="p-2 text-sm">{formatDate(payment.due_date)}</td>
                        <td className="p-2 text-sm font-medium">
                          {formatCurrency(parseFloat(payment.amount))}
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              payment.status === 'paid'
                                ? 'default'
                                : payment.status === 'overdue'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {payment.status === 'paid'
                              ? 'Pago'
                              : payment.status === 'overdue'
                                ? 'Atrasado'
                                : payment.status === 'pending'
                                  ? 'Pendente'
                                  : 'Cancelado'}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">
                          {payment.payment_date ? (
                            <div>
                              <p>{formatDate(payment.payment_date)}</p>
                              {payment.payment_method && (
                                <p className="text-muted-foreground text-xs">
                                  {payment.payment_method === 'pix'
                                    ? 'PIX'
                                    : payment.payment_method === 'cash'
                                      ? 'Dinheiro'
                                      : payment.payment_method === 'bank_transfer'
                                        ? 'Transferência'
                                        : 'Cartão'}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center text-sm">Nenhum pagamento encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">ID do Contrato</p>
            <p className="font-mono text-sm">{lease.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Criado em</p>
            <p className="text-sm">{formatDateTime(lease.created_at)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Última atualização</p>
            <p className="text-sm">{formatDateTime(lease.updated_at)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Cancelamento */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancelar Contrato"
        description="Tem certeza que deseja cancelar este contrato? Esta ação vai liberar a unidade e cancelar todos os pagamentos pendentes."
        confirmText="Sim, cancelar"
        onConfirm={handleCancel}
        variant="destructive"
        loading={cancelLease.isPending}
      />

      {/* Dialog de Renovação */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renovar Contrato</DialogTitle>
            <DialogDescription>
              Criar um novo contrato de 6 meses para a mesma unidade e inquilino, começando após o
              término do contrato atual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="renew_painting_fee">Taxa de Pintura</Label>
              <Input
                id="renew_painting_fee"
                type="text"
                placeholder="250.00"
                value={renewPaintingFee}
                onChange={(e) => setRenewPaintingFee(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Formato: 1000.00 (ponto como separador decimal)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="renew_installments">Número de Parcelas</Label>
              <Select
                value={renewInstallments.toString()}
                onValueChange={(val) => setRenewInstallments(parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenewDialog(false)}
              disabled={renewLease.isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleRenew} disabled={renewLease.isPending}>
              {renewLease.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Renovando...
                </>
              ) : (
                'Renovar Contrato'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
