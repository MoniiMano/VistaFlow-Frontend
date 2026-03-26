import apiClient from '../client'
import { ENDPOINTS } from '../endpoints'

export const projectService = {
  getAll: async (params) => {
    const response = await apiClient.get(ENDPOINTS.PROJECTS.BASE, { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.PROJECTS.BY_ID(id))
    return response.data
  },
  
  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.PROJECTS.BASE, data)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(ENDPOINTS.PROJECTS.BY_ID(id), data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.PROJECTS.BY_ID(id))
    return response.data
  },
  
  search: async (query) => {
    const response = await apiClient.get(ENDPOINTS.PROJECTS.SEARCH, { params: query })
    return response.data
  },
  
  export: async (filters) => {
    const response = await apiClient.get(ENDPOINTS.PROJECTS.EXPORT, {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  }
}

export default projectService
