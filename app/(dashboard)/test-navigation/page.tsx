'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function TestNavigationPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('[TEST NAV] Page mounted', {
      timestamp: new Date().toISOString(),
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasAuthToken:
        typeof localStorage !== 'undefined' ? !!localStorage.getItem('auth-storage') : false,
    })
  }, [])

  const handleNavigate = () => {
    const testId = 'test-123'
    console.log('[TEST NAV] Button clicked', {
      testId,
      timestamp: new Date().toISOString(),
      targetUrl: `/test-navigation/detail/${testId}`,
    })
    router.push(`/test-navigation/detail/${testId}`)
  }

  const handleLinkClick = () => {
    const testId = 'test-456'
    console.log('[TEST NAV] Link clicked', {
      testId,
      timestamp: new Date().toISOString(),
      targetUrl: `/test-navigation/detail/${testId}`,
    })
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔬 Teste Mínimo de Navegação</CardTitle>
          <CardDescription>
            Esta página testa navegação simples sem dependências complexas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 1: router.push()</h3>
            <Button onClick={handleNavigate} variant="default">
              Navegar com router.push (ID: test-123)
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 2: Link Component</h3>
            <Link
              href="/test-navigation/detail/test-456"
              onClick={handleLinkClick}
              className="ring-offset-background focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Navegar com Link (ID: test-456)
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Método 3: window.location.href</h3>
            <Button
              onClick={() => {
                const testId = 'test-789'
                console.log('[TEST NAV] window.location.href clicked', {
                  testId,
                  timestamp: new Date().toISOString(),
                  targetUrl: `/test-navigation/detail/${testId}`,
                })
                window.location.href = `/test-navigation/detail/${testId}`
              }}
              variant="outline"
            >
              Navegar com window.location.href (ID: test-789)
            </Button>
          </div>

          <div className="bg-muted mt-6 rounded-md p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Instruções:</strong> Abra o console do navegador e clique nos botões acima.
              Verifique se a navegação funciona corretamente em produção.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
