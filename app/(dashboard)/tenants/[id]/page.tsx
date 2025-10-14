'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTenant, useDeleteTenant } from '@/src/hooks/use-tenants'
import { useLeases } from '@/src/hooks/use-leases'
import { LeaseStatusBadge } from '@/src/components/leases/lease-status-badge'
import { TenantForm } from '@/src/components/tenants/tenant-form'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { ConfirmDialog } from '@/src/components/shared/confirm-dialog'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { ArrowLeft, Edit, Trash2, X } from 'lucide-react'
import {
  formatCPF,
  formatPhone,
  formatDateTime,
  formatDate,
  formatCurrency,
} from '@/src/lib/utils/format'

export default function TenantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string

  const { data: tenant, isLoading, error, refetch } = useTenant(id)
  const { data: leases } = useLeases({ tenant_id: id })
  const deleteTenant = useDeleteTenant()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  if (error || !tenant) {
    return (
      <ErrorMessage
        title="Erro ao carregar inquilino"
        message="Não foi possível carregar os dados do inquilino"
        retry={refetch}
      />
    )
  }

  const handleDelete = async () => {
    try {
      await deleteTenant.mutateAsync(id)
      router.push('/tenants')
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Inquilinos
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{tenant.full_name}</h1>
            <p className="text-muted-foreground">Detalhes e informações do inquilino</p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
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
            <CardTitle>Editar Inquilino</CardTitle>
            <CardDescription>Altere as informações do inquilino abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <TenantForm tenant={tenant} mode="edit" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Informações Principais */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Nome Completo</p>
                  <p className="text-lg font-semibold">{tenant.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">CPF</p>
                  <p className="font-mono text-lg">{formatCPF(tenant.cpf)}</p>
                  <p className="text-muted-foreground mt-1 text-xs">CPF não pode ser alterado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Telefone</p>
                  <p className="text-lg">{formatPhone(tenant.phone)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email</p>
                  <p className="text-lg">
                    {tenant.email ? (
                      <a href={`mailto:${tenant.email}`} className="text-primary hover:underline">
                        {tenant.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Não informado</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentação */}
          {(tenant.id_document_type || tenant.id_document_number) && (
            <Card>
              <CardHeader>
                <CardTitle>Documentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Tipo de Documento</p>
                    <p className="text-lg">
                      {tenant.id_document_type || (
                        <span className="text-muted-foreground">Não informado</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Número do Documento</p>
                    <p className="text-lg">
                      {tenant.id_document_number || (
                        <span className="text-muted-foreground">Não informado</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contratos */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Contratos</CardTitle>
              <CardDescription>Contratos de locação associados a este inquilino</CardDescription>
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
                    Nenhum contrato encontrado para este inquilino
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link href="/leases/new">Criar Contrato</Link>
                  </Button>
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
                <span className="text-muted-foreground">Cadastrado em:</span>
                <span className="font-medium">{formatDateTime(tenant.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span className="font-medium">{formatDateTime(tenant.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{tenant.id}</span>
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
        title="Deletar Inquilino"
        description={`Tem certeza que deseja deletar o inquilino ${tenant.full_name}? Esta ação não pode ser desfeita. Nota: Não é possível deletar inquilinos com contratos ativos.`}
        confirmText="Deletar"
        variant="destructive"
        loading={deleteTenant.isPending}
      />
    </div>
  )
}
