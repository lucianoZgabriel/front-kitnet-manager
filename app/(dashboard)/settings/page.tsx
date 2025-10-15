'use client'

import Link from 'next/link'
import { useAuth } from '@/src/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { User, Users, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  const settingsOptions = [
    {
      title: 'Meu Perfil',
      description: 'Gerencie suas informações pessoais e altere sua senha',
      icon: User,
      href: '/settings/profile',
      roles: ['admin', 'manager', 'viewer'],
    },
    {
      title: 'Gestão de Usuários',
      description: 'Crie, edite e gerencie usuários do sistema (apenas administradores)',
      icon: Users,
      href: '/settings/users',
      roles: ['admin'],
    },
  ]

  const availableOptions = settingsOptions.filter(
    (option) => !option.roles || option.roles.includes(user?.role || '')
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      {/* Opções de Configuração */}
      <div className="grid gap-4 md:grid-cols-2">
        {availableOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.href} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {option.title}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={option.href}>
                    Acessar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
