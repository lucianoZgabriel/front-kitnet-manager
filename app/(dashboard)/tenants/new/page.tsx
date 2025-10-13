'use client'

import Link from 'next/link'
import { TenantForm } from '@/src/components/tenants/tenant-form'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function NewTenantPage() {
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
        <h1 className="text-3xl font-bold">Novo Inquilino</h1>
        <p className="text-muted-foreground">Cadastre um novo inquilino no sistema</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Inquilino</CardTitle>
          <CardDescription>
            Preencha os dados do novo inquilino. Campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm mode="create" />
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            • <strong>CPF:</strong> Deve ser único no sistema e não pode ser alterado após o
            cadastro. Use o formato XXX.XXX.XXX-XX
          </p>
          <p>
            • <strong>Nome Completo:</strong> Nome completo do inquilino conforme documento
          </p>
          <p>
            • <strong>Telefone:</strong> Telefone de contato principal do inquilino
          </p>
          <p>
            • <strong>Email:</strong> Campo opcional, mas recomendado para comunicação
          </p>
          <p>
            • <strong>Documento de Identificação:</strong> Campos opcionais para RG, CNH ou outro
            documento
          </p>
          <p>• Após o cadastro, você poderá vincular o inquilino a um contrato de locação</p>
        </CardContent>
      </Card>
    </div>
  )
}
