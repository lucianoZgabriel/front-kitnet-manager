'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function TestNavigationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    console.log('[TEST NAV DETAIL] Page mounted', {
      id,
      timestamp: new Date().toISOString(),
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
      params,
    })

    // Verificar se houve logout
    const checkAuthInterval = setInterval(() => {
      const hasAuth = typeof localStorage !== 'undefined' && !!localStorage.getItem('auth-storage')
      console.log('[TEST NAV DETAIL] Auth check', {
        hasAuth,
        timestamp: new Date().toISOString(),
      })

      if (!hasAuth) {
        console.error('[TEST NAV DETAIL] 🚨 AUTH LOST! Token desapareceu!')
      }
    }, 1000)

    return () => clearInterval(checkAuthInterval)
  }, [id, params])

  const handleGoBack = () => {
    console.log('[TEST NAV DETAIL] Going back', {
      timestamp: new Date().toISOString(),
    })
    router.push('/test-navigation')
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />✅ Navegação Bem-Sucedida!
          </CardTitle>
          <CardDescription>Se você está vendo esta página, a navegação funcionou</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">
              <strong>ID recebido:</strong> {id}
            </p>
            <p className="mt-2 text-sm text-green-700">Verifique o console para logs detalhados</p>
          </div>

          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Status da Autenticação</h3>
            <p className="text-sm text-blue-700">
              O console está verificando o token a cada 1 segundo. Se houver logout, você verá uma
              mensagem de erro no console.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Próximos Passos</h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Verifique se você ainda está autenticado</li>
              <li>Confira os logs no console</li>
              <li>Tente voltar para a página anterior</li>
              <li>Compare o comportamento em dev vs produção</li>
            </ul>
          </div>

          <Button onClick={handleGoBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Teste de Navegação
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
