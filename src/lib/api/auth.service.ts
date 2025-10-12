import { api } from './client'
import type {
  LoginRequest,
  LoginResponse,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiResponse,
  CreateUserRequest,
  ChangePasswordRequest,
  ChangeRoleRequest,
} from '@/src/types/api/auth'

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return api.post('/auth/login', credentials)
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get('/auth/me')
  },

  async refreshToken(token: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return api.post('/auth/refresh', { token } as RefreshTokenRequest)
  },

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return api.post('/auth/users', userData)
  },

  async listUsers(): Promise<ApiResponse<User[]>> {
    return api.get('/auth/users')
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get(`/auth/users/${id}`)
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    return api.post('/auth/change-password', data)
  },

  async changeUserRole(userId: string, role: ChangeRoleRequest): Promise<ApiResponse<null>> {
    return api.patch(`/auth/users/${userId}/role`, role)
  },

  async deactivateUser(userId: string): Promise<ApiResponse<null>> {
    return api.post(`/auth/users/${userId}/deactivate`)
  },

  async activateUser(userId: string): Promise<ApiResponse<null>> {
    return api.post(`/auth/users/${userId}/activate`)
  },
}
