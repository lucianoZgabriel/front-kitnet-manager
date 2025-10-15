'use client'

import { useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import { useChangePassword } from '@/src/hooks/use-users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { User, Shield, Calendar, Key } from 'lucide-react'
import { formatDateTime } from '@/src/lib/utils/format'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema de validação para troca de senha
const changePasswordSchema = z
  .object({
    old_password: z.string().min(6, 'Senha atual deve ter no mínimo 6 caracteres'),
    new_password: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    confirm_password: z.string().min(6, 'Confirmação obrigatória'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const changePassword = useChangePassword()
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  if (!user) {
    return null
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        old_password: data.old_password,
        new_password: data.new_password,
      })
      reset()
      setShowPasswordForm(false)
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      admin: 'destructive',
      manager: 'default',
      viewer: 'secondary',
    }
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gerente',
      viewer: 'Visualizador',
    }
    return <Badge variant={variants[role] || 'default'}>{labels[role] || role}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações e configurações</p>
      </div>

      {/* Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
          <CardDescription>Seus dados de acesso ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Nome de Usuário</Label>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Função
              </Label>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Conta Criada em
              </Label>
              <p className="text-sm">{formatDateTime(user.created_at)}</p>
            </div>
            {user.last_login_at && (
              <div>
                <Label className="text-muted-foreground">Último Acesso</Label>
                <p className="text-sm">{formatDateTime(user.last_login_at)}</p>
              </div>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground">Status</Label>
            <div className="mt-1">
              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                {user.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Altere sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)}>Alterar Senha</Button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="old_password">Senha Atual</Label>
                <Input
                  id="old_password"
                  type="password"
                  {...register('old_password')}
                  placeholder="Digite sua senha atual"
                />
                {errors.old_password && (
                  <p className="text-destructive mt-1 text-sm">{errors.old_password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="new_password">Nova Senha</Label>
                <Input
                  id="new_password"
                  type="password"
                  {...register('new_password')}
                  placeholder="Digite a nova senha (mín. 6 caracteres)"
                />
                {errors.new_password && (
                  <p className="text-destructive mt-1 text-sm">{errors.new_password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...register('confirm_password')}
                  placeholder="Digite a nova senha novamente"
                />
                {errors.confirm_password && (
                  <p className="text-destructive mt-1 text-sm">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending ? 'Alterando...' : 'Alterar Senha'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset()
                    setShowPasswordForm(false)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
