'use client'

import Link from 'next/link'
import { LeaseForm } from '@/src/components/leases/lease-form'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function NewLeasePage() {
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
        <h1 className="text-3xl font-bold">Novo Contrato</h1>
        <p className="text-muted-foreground">
          Crie um novo contrato de locação vinculando unidade e inquilino
        </p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
          <CardDescription>
            Preencha os dados do novo contrato. Campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaseForm mode="create" />
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            • <strong>Duração:</strong> Todos os contratos têm duração fixa de 6 meses
          </p>
          <p>
            • <strong>Pagamentos:</strong> Serão gerados automaticamente 6 pagamentos mensais +
            parcelas da taxa de pintura
          </p>
          <p>
            • <strong>Unidade:</strong> Apenas unidades com status &quot;Disponível&quot; podem ser
            selecionadas
          </p>
          <p>
            • <strong>Inquilino:</strong> O inquilino não pode ter outro contrato ativo
          </p>
          <p>
            • <strong>Status:</strong> Após criação, a unidade terá status alterado para
            &quot;Ocupada&quot;
          </p>
          <p>
            • <strong>Renovação:</strong> Contratos podem ser renovados 45 dias antes do término
          </p>
          <p>
            • <strong>Taxa de Pintura:</strong> Pode ser parcelada em até 4 vezes nos primeiros
            meses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
