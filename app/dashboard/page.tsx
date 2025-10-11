'use client'

import { useAuth } from '@/src/hooks/use-auth'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao Kitnet Manager</p>
        </div>
        <Button onClick={logout} variant="outline">
          Sair
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuário Autenticado</CardTitle>
            <CardDescription>Informações do usuário logado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Nome de usuário:</p>
              <p className="text-lg">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Função:</p>
              <p className="text-lg capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <p className="text-lg">{user?.is_active ? 'Ativo' : 'Inativo'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Autenticação</CardTitle>
            <CardDescription>Estado atual do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p>Sistema autenticado</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p>API conectada</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p>Token válido</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>Funcionalidades a implementar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ Sistema de autenticação</li>
              <li>⏳ Layout com sidebar</li>
              <li>⏳ Dashboard com métricas</li>
              <li>⏳ CRUD de unidades</li>
              <li>⏳ CRUD de inquilinos</li>
              <li>⏳ Gestão de contratos</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
