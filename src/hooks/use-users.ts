import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/src/lib/api/auth.service'
import type {
  User,
  CreateUserRequest,
  ChangePasswordRequest,
  ChangeRoleRequest,
} from '@/src/types/api/auth'
import { toast } from 'sonner'

/**
 * Hook para buscar lista de todos os usuários (admin only)
 */
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => authService.listUsers().then((res) => res.data || []),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para buscar um usuário específico por ID (admin only)
 */
export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await authService.getUserById(id)
      if (!response.data) {
        throw new Error('Usuário não encontrado')
      }
      return response.data
    },
    enabled: !!id,
  })
}

/**
 * Hook para criar novo usuário (admin only)
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await authService.createUser(data)
      if (!response.data) {
        throw new Error(response.error || 'Erro ao criar usuário')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário criado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao criar usuário: ${error.message}`)
    },
  })
}

/**
 * Hook para alterar senha do usuário atual
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await authService.changePassword(data)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao alterar senha')
      }
      return response
    },
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao alterar senha: ${error.message}`)
    },
  })
}

/**
 * Hook para alterar role de um usuário (admin only)
 */
export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: ChangeRoleRequest }) => {
      const response = await authService.changeUserRole(userId, role)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao alterar função do usuário')
      }
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] })
      toast.success('Função do usuário alterada com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao alterar função: ${error.message}`)
    },
  })
}

/**
 * Hook para desativar um usuário (admin only)
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await authService.deactivateUser(userId)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao desativar usuário')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário desativado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao desativar usuário: ${error.message}`)
    },
  })
}

/**
 * Hook para ativar um usuário (admin only)
 */
export function useActivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await authService.activateUser(userId)
      if (!response.success) {
        throw new Error(response.error || 'Erro ao ativar usuário')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário ativado com sucesso!')
    },
    onError: (error: { message: string }) => {
      toast.error(`Erro ao ativar usuário: ${error.message}`)
    },
  })
}
