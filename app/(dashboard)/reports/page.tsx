'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { BarChart3, FileText, ArrowRight, TrendingUp, Calendar } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Acesse relatórios financeiros e análises detalhadas de pagamentos
        </p>
      </div>

      {/* Cards de Relatórios */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Relatório Financeiro */}
        <Card className="border-green-200 transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Relatório Financeiro
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              Análise completa de receitas, despesas e pagamentos por período com filtros avançados
              por tipo e status
            </CardDescription>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span>Resumo financeiro do período</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>Filtros por data, tipo e status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-green-600" />
                <span>Lista detalhada de pagamentos</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/reports/financial">
                  Acessar Relatório Financeiro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Relatório de Pagamentos */}
        <Card className="border-blue-200 transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <FileText className="h-5 w-5 text-blue-600" />
                Histórico de Pagamentos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              Histórico completo de pagamentos com filtros por contrato, inquilino, status e período
            </CardDescription>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>Filtros por contrato e inquilino</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Filtros por período e status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Histórico detalhado de transações</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/reports/payments">
                  Acessar Histórico de Pagamentos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre os Relatórios</CardTitle>
          <CardDescription>Informações importantes sobre os relatórios disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
              1
            </div>
            <div>
              <strong>Relatório Financeiro:</strong> Ideal para análise de receitas e despesas em um
              período específico. Use os filtros para segmentar por tipo de pagamento (aluguel, taxa
              de pintura) e status (pago, pendente, atrasado).
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
              2
            </div>
            <div>
              <strong>Histórico de Pagamentos:</strong> Consulte o histórico completo de pagamentos
              com filtros por contrato específico, inquilino, status e período. Útil para auditorias
              e análises por inquilino.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
              3
            </div>
            <div>
              <strong>Dica:</strong> Use o seletor de período para analisar dados mensais,
              trimestrais ou anuais. Os relatórios são atualizados em tempo real com base nos
              filtros selecionados.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
