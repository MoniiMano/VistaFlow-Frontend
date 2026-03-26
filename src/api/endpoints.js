// API endpoint constants
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    STATS: '/users/stats'
  },
  
  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    SEARCH: '/projects/search',
    EXPORT: '/projects/export'
  },
  
  // Sections
  SECTIONS: {
    BASE: '/sections',
    BY_ID: (id) => `/sections/${id}`,
    BY_PROJECT: (projectId) => `/projects/${projectId}/sections`
  },
  
  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    BY_SECTION: (sectionId) => `/sections/${sectionId}/tasks`,
    ASSIGN: (id) => `/tasks/${id}/assign`,
    MY_TASKS: '/tasks/my-tasks',
    SEARCH: '/tasks/search',
    EXPORT: '/tasks/export'
  },
  
  // Dashboard
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    MANAGER: '/dashboard/manager',
    MEMBER: '/dashboard/member'
  }
}

export default ENDPOINTS
