'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUnit, useDeleteUnit, useUpdateUnitStatus } from '@/src/hooks/use-units'
import { useLeases } from '@/src/hooks/use-leases'
import { LeaseStatusBadge } from '@/src/components/leases/lease-status-badge'
import { UnitForm } from '@/src/components/units/unit-form'
import { UnitStatusBadge } from '@/src/components/units/unit-status-badge'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { ConfirmDialog } from '@/src/components/shared/confirm-dialog'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { ArrowLeft, Edit, Trash2, X } from 'lucide-react'
import { formatCurrency, formatDateTime, formatDate } from '@/src/lib/utils/format'
import type { UnitStatus } from '@/src/types/api/unit'

export default function UnitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string

  const { data: unit, isLoading, error, refetch } = useUnit(id)
  const { data: leases } = useLeases({ unit_id: id })
  const deleteUnit = useDeleteUnit()
  const updateStatus = useUpdateUnitStatus()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | null>(null)

  // Detectar query param ?edit=true para entrar direto no modo de edição
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !unit) {
    return (
      <ErrorMessage
        title="Erro ao carregar unidade"
        message="Não foi possível carregar os dados da unidade"
        retry={refetch}
      />
    )
  }

  const handleDelete = async () => {
    try {
      await deleteUnit.mutateAsync(id)
      router.push('/units')
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  const handleStatusChange = async (newStatus: UnitStatus) => {
    if (newStatus === unit.status) return

    try {
      await updateStatus.mutateAsync({ id, status: newStatus })
      setSelectedStatus(null)
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/units">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Unidades
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Unidade {unit.number}</h1>
            <p className="text-muted-foreground">Detalhes e informações da unidade</p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={unit.status === 'occupied'}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </Button>
              </>
            )}
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancelar Edição
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modo Edição */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Editar Unidade</CardTitle>
            <CardDescription>Altere as informações da unidade abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <UnitForm unit={unit} mode="edit" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Informações Principais */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Número da Unidade</p>
                  <p className="text-2xl font-bold">{unit.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Andar</p>
                  <p className="text-lg">{unit.floor}º andar</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <UnitStatusBadge status={unit.status} showIcon />
                    {unit.status !== 'occupied' && (
                      <Select
                        value={selectedStatus || unit.status}
                        onValueChange={(value) => handleStatusChange(value as UnitStatus)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Alterar status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponível</SelectItem>
                          <SelectItem value="occupied" disabled>
                            Ocupada
                          </SelectItem>
                          <SelectItem value="maintenance">Manutenção</SelectItem>
                          <SelectItem value="renovation">Reforma</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {unit.status === 'occupied' && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Unidades ocupadas não podem ter o status alterado manualmente
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Unidade Renovada</p>
                  <p className="text-lg">
                    {unit.is_renovated ? (
                      <span className="text-green-600">Sim</span>
                    ) : (
                      <span className="text-muted-foreground">Não</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Valor Base (sem reforma)
                  </p>
                  <p className="text-lg">{formatCurrency(unit.base_rent_value)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Valor Renovado (com reforma)
                  </p>
                  <p className="text-lg">{formatCurrency(unit.renovated_rent_value)}</p>
                </div>
                <div className="border-primary/20 bg-primary/5 rounded-lg border-2 p-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    Valor Atual do Aluguel
                  </p>
                  <p className="text-primary text-2xl font-bold">
                    {formatCurrency(unit.current_rent_value)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {unit.is_renovated ? 'Baseado no valor renovado' : 'Baseado no valor base'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          {unit.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{unit.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Contratos */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Contratos</CardTitle>
              <CardDescription>Contratos de locação associados a esta unidade</CardDescription>
            </CardHeader>
            <CardContent>
              {leases && leases.length > 0 ? (
                <div className="space-y-4">
                  {leases.map((lease) => (
                    <Link
                      key={lease.id}
                      href={`/leases/${lease.id}`}
                      className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <LeaseStatusBadge status={lease.status} />
                            <p className="text-sm font-medium">
                              {formatDate(lease.start_date)} até {formatDate(lease.end_date)}
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Aluguel: {formatCurrency(parseFloat(lease.monthly_rent_value))} •
                            Vencimento: dia {lease.payment_due_day}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    Nenhum contrato encontrado para esta unidade
                  </p>
                  {unit.status === 'available' && (
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/leases/new">Criar Contrato</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criada em:</span>
                <span className="font-medium">{formatDateTime(unit.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span className="font-medium">{formatDateTime(unit.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{unit.id}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog de Confirmação de Deleção */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Deletar Unidade"
        description={`Tem certeza que deseja deletar a unidade ${unit.number}? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        variant="destructive"
        loading={deleteUnit.isPending}
      />
    </div>
  )
}
