'use client'

import Link from 'next/link'
import { UnitForm } from '@/src/components/units/unit-form'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function NewUnitPage() {
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
        <h1 className="text-3xl font-bold">Nova Unidade</h1>
        <p className="text-muted-foreground">Cadastre uma nova unidade (kitnet) no sistema</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Unidade</CardTitle>
          <CardDescription>
            Preencha os dados da nova unidade. Todos os campos marcados são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnitForm mode="create" />
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            • <strong>Valor Base:</strong> Valor do aluguel para unidades sem reforma
          </p>
          <p>
            • <strong>Valor Renovado:</strong> Valor do aluguel para unidades reformadas (deve ser
            maior ou igual ao valor base)
          </p>
          <p>
            • <strong>Valor Atual:</strong> Será calculado automaticamente baseado no status de
            renovação da unidade
          </p>
          <p>
            • A unidade será criada com status <strong>&ldquo;Disponível&rdquo;</strong> por padrão
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
