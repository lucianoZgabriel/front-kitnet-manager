import { api } from './client'
import type { ApiResponse } from '@/src/types/api/auth'
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/src/types/api/tenant'

/**
 * Tenants API Service
 * Handles all tenant (inquilino) related operations
 */
export const tenantsService = {
  /**
   * Get all tenants with optional name search
   * @param name - Search by name (optional)
   */
  async getTenants(params?: { name?: string }): Promise<Tenant[]> {
    const response = await api.get<ApiResponse<Tenant[]>>('/tenants', { params })
    const apiResponse = response as unknown as ApiResponse<Tenant[]>
    return apiResponse.data || []
  },

  /**
   * Get tenant by ID
   * @param id - Tenant UUID
   */
  async getTenant(id: string): Promise<Tenant> {
    const response = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`)
    const apiResponse = response as unknown as ApiResponse<Tenant>
    return apiResponse.data as Tenant
  },

  /**
   * Get tenant by CPF
   * @param cpf - CPF in format XXX.XXX.XXX-XX
   */
  async getTenantByCPF(cpf: string): Promise<Tenant> {
    const response = await api.get<ApiResponse<Tenant>>('/tenants/cpf', {
      params: { cpf },
    })
    const apiResponse = response as unknown as ApiResponse<Tenant>
    return apiResponse.data as Tenant
  },

  /**
   * Create new tenant
   * @param data - Tenant creation data
   */
  async createTenant(data: CreateTenantRequest): Promise<Tenant> {
    const response = await api.post<ApiResponse<Tenant>>('/tenants', data)
    const apiResponse = response as unknown as ApiResponse<Tenant>
    return apiResponse.data as Tenant
  },

  /**
   * Update existing tenant
   * Note: CPF cannot be updated (immutable)
   * @param id - Tenant UUID
   * @param data - Tenant update data
   */
  async updateTenant(id: string, data: UpdateTenantRequest): Promise<Tenant> {
    const response = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, data)
    const apiResponse = response as unknown as ApiResponse<Tenant>
    return apiResponse.data as Tenant
  },

  /**
   * Delete tenant
   * Note: Cannot delete tenant with active lease
   * @param id - Tenant UUID
   */
  async deleteTenant(id: string): Promise<void> {
    await api.delete(`/tenants/${id}`)
  },
}
