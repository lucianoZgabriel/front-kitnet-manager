'use client'

import { useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import {
  useUsers,
  useCreateUser,
  useChangeUserRole,
  useActivateUser,
  useDeactivateUser,
} from '@/src/hooks/use-users'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { ConfirmDialog } from '@/src/components/shared/confirm-dialog'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { Card } from '@/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Plus, Shield, UserX, UserCheck, Search } from 'lucide-react'
import { formatDateTime } from '@/src/lib/utils/format'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User, UserRole } from '@/src/types/api/auth'

// Schema para criação de usuário
const createUserSchema = z.object({
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['admin', 'manager', 'viewer'], {
    message: 'Selecione uma função',
  }),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data: users, isLoading, error, refetch } = useUsers()
  const createUser = useCreateUser()
  const changeUserRole = useChangeUserRole()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()

  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'viewer',
    },
  })

  // Verificar se o usuário atual é admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Acesso restrito a administradores</p>
        </div>
        <Card className="p-8 text-center">
          <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-lg font-medium">Acesso Negado</p>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !users) {
    return (
      <ErrorMessage
        title="Erro ao carregar usuários"
        message="Não foi possível carregar a lista de usuários"
        retry={refetch}
      />
    )
  }

  // Filtro local por username
  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onCreateUser = async (data: CreateUserFormData) => {
    try {
      await createUser.mutateAsync(data)
      reset()
      setShowCreateDialog(false)
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  const handleChangeRole = async () => {
    if (!selectedUser) return
    try {
      await changeUserRole.mutateAsync({
        userId: selectedUser.id,
        role: { role: selectedRole },
      })
      setShowRoleDialog(false)
      setSelectedUser(null)
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  const handleActivateUser = async () => {
    if (!selectedUser) return
    try {
      await activateUser.mutateAsync(selectedUser.id)
      setShowActivateDialog(false)
      setSelectedUser(null)
    } catch {
      // Erro já tratado pelo hook com toast
    }
  }

  const handleDeactivateUser = async () => {
    if (!selectedUser) return
    try {
      await deactivateUser.mutateAsync(selectedUser.id)
      setShowDeactivateDialog(false)
      setSelectedUser(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Total de Usuários</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Administradores</p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Gerentes</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'manager').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.is_active).length}
          </p>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de usuários */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Função</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Criado em</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Último Acesso</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 border-b">
                    <td className="px-4 py-3 font-medium">
                      {user.username}
                      {user.id === currentUser.id && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Você
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {user.last_login_at ? formatDateTime(user.last_login_at) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setSelectedRole(user.role)
                            setShowRoleDialog(true)
                          }}
                          disabled={user.id === currentUser.id}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        {user.is_active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeactivateDialog(true)
                            }}
                            disabled={user.id === currentUser.id}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowActivateDialog(true)
                            }}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                    {searchTerm
                      ? 'Nenhum usuário encontrado com esse termo de busca'
                      : 'Nenhum usuário cadastrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog: Criar Usuário */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="Digite o username (mín. 3 caracteres)"
              />
              {errors.username && (
                <p className="text-destructive mt-1 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Digite a senha (mín. 6 caracteres)"
              />
              {errors.password && (
                <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Select onValueChange={(value) => setValue('role', value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-destructive mt-1 text-sm">{errors.role.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset()
                  setShowCreateDialog(false)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Alterar Função */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Função do Usuário</DialogTitle>
            <DialogDescription>
              Altere a função de <strong>{selectedUser?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Função Atual</Label>
              <div className="mt-2">{selectedUser && getRoleBadge(selectedUser.role)}</div>
            </div>
            <div>
              <Label htmlFor="new-role">Nova Função</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRoleDialog(false)
                setSelectedUser(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangeRole} disabled={changeUserRole.isPending}>
              {changeUserRole.isPending ? 'Alterando...' : 'Alterar Função'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ativar Usuário */}
      <ConfirmDialog
        open={showActivateDialog}
        onOpenChange={setShowActivateDialog}
        title="Ativar Usuário"
        description={`Tem certeza que deseja ativar o usuário ${selectedUser?.username}?`}
        onConfirm={handleActivateUser}
        confirmText="Ativar"
        loading={activateUser.isPending}
      />

      {/* Dialog: Desativar Usuário */}
      <ConfirmDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
        title="Desativar Usuário"
        description={`Tem certeza que deseja desativar o usuário ${selectedUser?.username}? Usuários inativos não poderão fazer login no sistema.`}
        onConfirm={handleDeactivateUser}
        confirmText="Desativar"
        variant="destructive"
        loading={deactivateUser.isPending}
      />
    </div>
  )
}
