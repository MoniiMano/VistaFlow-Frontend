import apiClient from '../client'
import { ENDPOINTS } from '../endpoints'

export const taskService = {
  getAll: async (params) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.BASE, { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.BY_ID(id))
    return response.data
  },
  
  getBySection: async (sectionId) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.BY_SECTION(sectionId))
    return response.data
  },
  
  getMyTasks: async (params) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.MY_TASKS, { params })
    return response.data
  },
  
  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.TASKS.BASE, data)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(ENDPOINTS.TASKS.BY_ID(id), data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.TASKS.BY_ID(id))
    return response.data
  },
  
  assign: async (id, userId) => {
    const response = await apiClient.post(ENDPOINTS.TASKS.ASSIGN(id), { userId })
    return response.data
  },
  
  search: async (query) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.SEARCH, { params: query })
    return response.data
  },
  
  export: async (filters) => {
    const response = await apiClient.get(ENDPOINTS.TASKS.EXPORT, {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  }
}

export default taskService
