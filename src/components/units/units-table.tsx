'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { UnitStatusBadge } from './unit-status-badge'
import { formatCurrency } from '@/src/lib/utils/format'
import type { Unit, UnitStatus } from '@/src/types/api/unit'
import { Eye, Search } from 'lucide-react'

interface UnitsTableProps {
  units: Unit[]
}

export function UnitsTable({ units }: UnitsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all')
  const [floorFilter, setFloorFilter] = useState<string>('all')

  // Filtrar unidades
  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter
    const matchesFloor = floorFilter === 'all' || unit.floor.toString() === floorFilter
    return matchesSearch && matchesStatus && matchesFloor
  })

  // Obter lista única de andares
  const floors = Array.from(new Set(units.map((u) => u.floor))).sort((a, b) => a - b)

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as UnitStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="occupied">Ocupada</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="renovation">Reforma</SelectItem>
          </SelectContent>
        </Select>
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Andar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os andares</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor.toString()}>
                {floor}º andar
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Andar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renovada</TableHead>
              <TableHead>Valor Base</TableHead>
              <TableHead>Valor Renovado</TableHead>
              <TableHead>Valor Atual</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhuma unidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.number}</TableCell>
                  <TableCell>{unit.floor}º</TableCell>
                  <TableCell>
                    <UnitStatusBadge status={unit.status} />
                  </TableCell>
                  <TableCell>
                    {unit.is_renovated ? (
                      <span className="text-green-600">Sim</span>
                    ) : (
                      <span className="text-muted-foreground">Não</span>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(unit.base_rent_value)}</TableCell>
                  <TableCell>{formatCurrency(unit.renovated_rent_value)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(unit.current_rent_value)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/units/${unit.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info de resultados */}
      <div className="text-muted-foreground text-sm">
        Mostrando {filteredUnits.length} de {units.length} unidades
      </div>
    </div>
  )
}
