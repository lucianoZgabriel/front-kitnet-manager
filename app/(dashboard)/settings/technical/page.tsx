'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { toast } from 'sonner'
import { forceSchedulerRun } from '@/src/lib/api/admin.service'
import { PlayCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'

export default function TechnicalPage() {
  const [lastExecution, setLastExecution] = useState<{
    timestamp: string
    tasks: string[]
  } | null>(null)

  const forceScheduler = useMutation({
    mutationFn: forceSchedulerRun,
    onSuccess: (data) => {
      setLastExecution({
        timestamp: data.data.executed_at,
        tasks: data.data.tasks,
      })
      toast.success(
        'Scheduler executado com sucesso! Todas as tarefas agendadas foram processadas.'
      )
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Erro ao executar scheduler')
    },
  })

  const handleForceScheduler = () => {
    forceScheduler.mutate()
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const taskLabels: Record<string, string> = {
    mark_overdue_payments: 'Marcar pagamentos atrasados',
    check_expiring_soon_leases: 'Verificar contratos expirando',
    auto_renew_leases: 'Renovar contratos automaticamente',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Funções Técnicas</h1>
        <p className="text-muted-foreground">Execute tarefas administrativas e testes do sistema</p>
      </div>

      {/* Informações sobre o Scheduler */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sobre o Scheduler</AlertTitle>
        <AlertDescription>
          O scheduler executa automaticamente a cada 24 horas. Use o botão abaixo apenas para testes
          ou quando precisar forçar a execução das tarefas agendadas.
        </AlertDescription>
      </Alert>

      {/* Card de Execução do Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Forçar Execução do Scheduler
          </CardTitle>
          <CardDescription>
            Executa manualmente todas as tarefas agendadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tarefas que serão executadas:</h4>
            <ul className="text-muted-foreground ml-5 list-disc space-y-1 text-sm">
              <li>Marcar pagamentos como atrasados (vencidos e não pagos)</li>
              <li>Verificar contratos expirando em 45 dias e atualizar status</li>
              <li>Renovar automaticamente contratos sem reajuste (janela de 7 dias)</li>
            </ul>
          </div>

          <Button
            onClick={handleForceScheduler}
            disabled={forceScheduler.isPending}
            className="w-full"
          >
            {forceScheduler.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Executar Scheduler
              </>
            )}
          </Button>

          {/* Última Execução */}
          {lastExecution && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-medium text-green-900">Última Execução Manual</h4>
                  <p className="text-sm text-green-700">
                    {formatTimestamp(lastExecution.timestamp)}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-green-900">Tarefas executadas:</p>
                    <ul className="ml-5 list-disc space-y-0.5 text-xs text-green-700">
                      {lastExecution.tasks.map((task) => (
                        <li key={task}>{taskLabels[task] || task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Scheduler</CardTitle>
          <CardDescription>Informações sobre a execução automática</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Intervalo de Execução</p>
            <p className="text-muted-foreground text-sm">A cada 24 horas</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Janela de Renovação Automática</p>
            <p className="text-muted-foreground text-sm">
              Contratos são renovados automaticamente quando faltam 7 dias ou menos para o
              vencimento (apenas contratos sem reajuste)
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Janela de Alerta de Expiração</p>
            <p className="text-muted-foreground text-sm">
              Contratos aparecem como &ldquo;Expirando em Breve&rdquo; quando faltam 45 dias ou
              menos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
