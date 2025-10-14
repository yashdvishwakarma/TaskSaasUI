import apiService from '../apiService'; // Your existing apiService instance

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  userCount: number;
}

export interface OrganizationDetail extends Organization {
  taskCount: number;
}

export interface CreateOrganizationDto {
  name: string;
  plan?: string;
  isActive?: boolean;
}

export interface UpdateOrganizationDto {
  name?: string;
  plan?: string;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export const orgApi = {
  async getOrganizations(page = 1, pageSize = 10): Promise<PaginatedResponse<Organization>> {
    const response = await apiService.get<PaginatedResponse<Organization>>('/organizations/getorganization', {
      params: { page, pageSize }
    });
    
    return {
      data: response.data,
      // totalCount: parseInt(response.headers['x-total-count'] || '0'),
      // pageSize: parseInt(response.headers['x-page-size'] || '10'),
      // currentPage: parseInt(response.headers['x-current-page'] || '1')

      totalCount: 0,
      pageSize: 1,
      currentPage: 1,
    };
  },

  async getOrganization(id: string): Promise<OrganizationDetail> {
    const response = await apiService.get<OrganizationDetail>(`/api/organizations/${id}`);
    return response;
  },

  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const response = await apiService.post<Organization>('/api/organizations', data);
    return response;
  },

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<void> {
    await apiService.put(`/api/organizations/${id}`, data);
  },

  async deleteOrganization(id: string): Promise<void> {
    await apiService.delete(`/api/organizations/${id}`);
  }
};