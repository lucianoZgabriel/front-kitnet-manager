'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function TestSimpleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    console.log('[TEST SIMPLE DETAIL] Page mounted (OUTSIDE DASHBOARD)', {
      id,
      timestamp: new Date().toISOString(),
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
      location: window.location.href,
      wasLoggedOut: false, // Se você ver isso no console, não foi deslogado!
    })
  }, [id])

  const handleBack = () => {
    console.log('[TEST SIMPLE DETAIL] Back button clicked', {
      timestamp: new Date().toISOString(),
    })
    router.push('/test-simple')
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>✅ Navegação Bem-Sucedida!</CardTitle>
              <CardDescription>Você chegou na página de detalhes SEM ser deslogado</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">🎉 Sucesso!</p>
            <p className="mt-1 text-sm text-green-800 dark:text-green-200">
              Se você está vendo esta página, a navegação funcionou corretamente. Você NÃO foi
              deslogado!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID do Teste:</h3>
              <p className="mt-1 text-2xl font-bold">{id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Informações da Navegação:
              </h3>
              <div className="bg-muted mt-2 space-y-1 rounded-md p-3 font-mono text-xs">
                <p>
                  <strong>URL:</strong> /test-simple/detail/{id}
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date().toISOString()}
                </p>
                <p>
                  <strong>Auth Token Presente:</strong>{' '}
                  {typeof localStorage !== 'undefined' && !!localStorage.getItem('auth-storage')
                    ? '✅ Sim'
                    : '❌ Não'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              📋 Próximos Passos
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
              <li>
                Se isso funcionou em produção: O problema está no DashboardLayout ou em algum de
                seus componentes (Navbar, Sidebar, etc.)
              </li>
              <li>
                Se isso FALHOU em produção: O problema é mais profundo (Next.js 15, Vercel, API,
                etc.)
              </li>
              <li>Compare os logs do console com os da página /test-navigation</li>
              <li>Verifique se há diferenças nos componentes renderizados entre as duas rotas</li>
            </ol>
          </div>

          <Button onClick={handleBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Testes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
