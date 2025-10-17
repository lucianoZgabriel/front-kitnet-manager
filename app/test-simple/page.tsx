'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function TestSimplePage() {
  const router = useRouter()

  useEffect(() => {
    console.log('[TEST SIMPLE] Page mounted (OUTSIDE DASHBOARD)', {
      timestamp: new Date().toISOString(),
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
      location: window.location.href,
    })
  }, [])

  const handleNavigate = () => {
    const testId = 'router-push-123'
    console.log('[TEST SIMPLE] Button clicked (router.push)', {
      testId,
      timestamp: new Date().toISOString(),
      targetUrl: `/test-simple/detail/${testId}`,
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
    })
    router.push(`/test-simple/detail/${testId}`)
  }

  const handleLinkClick = () => {
    const testId = 'link-component-456'
    console.log('[TEST SIMPLE] Link clicked', {
      testId,
      timestamp: new Date().toISOString(),
      targetUrl: `/test-simple/detail/${testId}`,
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
    })
  }

  const handleWindowLocation = () => {
    const testId = 'window-location-789'
    console.log('[TEST SIMPLE] window.location.href clicked', {
      testId,
      timestamp: new Date().toISOString(),
      targetUrl: `/test-simple/detail/${testId}`,
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
    })
    window.location.href = `/test-simple/detail/${testId}`
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Teste FORA do Dashboard Layout</CardTitle>
          <CardDescription>
            Esta página está FORA da pasta (dashboard) e não usa DashboardLayout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              ⚠️ Teste de Isolamento
            </p>
            <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
              Se a navegação funcionar aqui mas falhar no dashboard, o problema está no
              DashboardLayout ou em algum componente/hook usado apenas lá.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 1: router.push()</h3>
            <Button onClick={handleNavigate} variant="default" className="w-full">
              Navegar com router.push (ID: router-push-123)
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 2: Link Component</h3>
            <Link
              href="/test-simple/detail/link-component-456"
              onClick={handleLinkClick}
              className="ring-offset-background focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Navegar com Link (ID: link-component-456)
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 3: window.location.href</h3>
            <Button onClick={handleWindowLocation} variant="outline" className="w-full">
              Navegar com window.location.href (ID: window-location-789)
            </Button>
          </div>

          <div className="bg-muted mt-6 rounded-md p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Instruções:</strong>
            </p>
            <ol className="text-muted-foreground mt-2 list-decimal space-y-1 pl-5 text-sm">
              <li>Abra o console do navegador</li>
              <li>Clique em cada um dos 3 botões acima</li>
              <li>Verifique se você é deslogado ou se a navegação funciona</li>
              <li>
                Compare o comportamento com a página /test-navigation (que está DENTRO do dashboard)
              </li>
            </ol>
          </div>

          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              📊 Resultado Esperado
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>✅ Se funcionar aqui: O problema está no DashboardLayout ou seus componentes</li>
              <li>
                ❌ Se falhar aqui também: O problema é mais profundo (Next.js 15, Vercel, etc.)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
