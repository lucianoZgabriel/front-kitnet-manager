'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTenants } from '@/src/hooks/use-tenants'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { formatCPF, formatPhone } from '@/src/lib/utils/format'
import { Card } from '@/src/components/ui/card'

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: tenants, isLoading, error, refetch } = useTenants()

  // Filtro local por nome ou CPF
  const filteredTenants = tenants?.filter(
    (tenant) =>
      tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.cpf.includes(searchTerm)
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !tenants) {
    return (
      <ErrorMessage
        title="Erro ao carregar inquilinos"
        message="Não foi possível carregar a lista de inquilinos"
        retry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquilinos</h1>
          <p className="text-muted-foreground">Gerencie os inquilinos do sistema</p>
        </div>
        <Button asChild>
          <Link href="/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Inquilino
          </Link>
        </Button>
      </div>

      {/* Estatística rápida */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Total de Inquilinos</p>
          <p className="text-2xl font-bold">{tenants.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Com Email Cadastrado</p>
          <p className="text-2xl font-bold text-blue-600">
            {tenants.filter((t) => t.email).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Resultados</p>
          <p className="text-2xl font-bold">{filteredTenants?.length || 0}</p>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de inquilinos */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Nome Completo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">CPF</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants && filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-muted/50 border-b">
                    <td className="px-4 py-3 font-medium">{tenant.full_name}</td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {formatCPF(tenant.cpf)}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {formatPhone(tenant.phone)}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {tenant.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tenants/${tenant.id}`}>Ver detalhes</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                    {searchTerm
                      ? 'Nenhum inquilino encontrado com esse termo de busca'
                      : 'Nenhum inquilino cadastrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
