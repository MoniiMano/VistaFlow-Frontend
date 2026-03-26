import apiClient from '../client'
import { ENDPOINTS } from '../endpoints'

export const sectionService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.SECTIONS.BASE)
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.SECTIONS.BY_ID(id))
    return response.data
  },
  
  getByProject: async (projectId) => {
    const response = await apiClient.get(ENDPOINTS.SECTIONS.BY_PROJECT(projectId))
    return response.data
  },
  
  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.SECTIONS.BASE, data)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(ENDPOINTS.SECTIONS.BY_ID(id), data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.SECTIONS.BY_ID(id))
    return response.data
  }
}

export default sectionService
