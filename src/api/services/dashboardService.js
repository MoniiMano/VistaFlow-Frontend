import apiClient from '../client'
import { ENDPOINTS } from '../endpoints'

export const dashboardService = {
  getAdminStats: async () => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.ADMIN)
    return response.data
  },
  
  getManagerStats: async () => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.MANAGER)
    return response.data
  },
  
  getMemberStats: async () => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.MEMBER)
    return response.data
  }
}

export default dashboardService
