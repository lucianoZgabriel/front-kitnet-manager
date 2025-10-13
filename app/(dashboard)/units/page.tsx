'use client'

import Link from 'next/link'
import { useUnits } from '@/src/hooks/use-units'
import { UnitsTable } from '@/src/components/units/units-table'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { Button } from '@/src/components/ui/button'
import { Plus } from 'lucide-react'

export default function UnitsPage() {
  const { data: units, isLoading, error, refetch } = useUnits()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !units) {
    return (
      <ErrorMessage
        title="Erro ao carregar unidades"
        message="Não foi possível carregar a lista de unidades"
        retry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unidades</h1>
          <p className="text-muted-foreground">Gerencie as unidades (kitnets) do sistema</p>
        </div>
        <Button asChild>
          <Link href="/units/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Unidade
          </Link>
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold">{units.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm font-medium">Disponíveis</p>
          <p className="text-2xl font-bold text-green-600">
            {units.filter((u) => u.status === 'available').length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm font-medium">Ocupadas</p>
          <p className="text-2xl font-bold text-blue-600">
            {units.filter((u) => u.status === 'occupied').length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm font-medium">Manutenção/Reforma</p>
          <p className="text-2xl font-bold text-yellow-600">
            {units.filter((u) => u.status === 'maintenance' || u.status === 'renovation').length}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <UnitsTable units={units} />
    </div>
  )
}
