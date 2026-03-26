import apiClient from '../client'
import { ENDPOINTS } from '../endpoints'

export const userService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.USERS.BASE)
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.USERS.BY_ID(id))
    return response.data
  },
  
  getStats: async () => {
    const response = await apiClient.get(ENDPOINTS.USERS.STATS)
    return response.data
  }
}

export default userService
