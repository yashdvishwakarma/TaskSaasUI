// api/apiService.ts
import http from './apiClient';

class ApiService {
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await http.get<any>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await http.post<any>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await http.put<any>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await http.delete<any>(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await http.patch<any>(url, data);
    return response.data;
  }
}

export default new ApiService();