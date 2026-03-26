import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { authService } from '@api/services/authService'
import { ToastContainer } from '@components/ui/Toast'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import ManagerDashboard from './pages/dashboard/ManagerDashboard'
import MemberDashboard from './pages/dashboard/MemberDashboard'
import Projects from './pages/projects/Projects'
import ProjectDetail from './pages/projects/ProjectDetail'
import Tasks from './pages/tasks/Tasks'
import Credits from './pages/Credits'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { initTheme, isDark } = useThemeStore()
  const { setUser, setLoading } = useAuthStore()
  
  useEffect(() => {
    // Initialize theme on mount
    initTheme()
  }, [initTheme])
  
  // Apply dark class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const response = await authService.getCurrentUser()
        if (response.success) {
          setUser(response.user)
        }
      } catch (error) {
        // User not authenticated, silently fail
        console.log('Not authenticated')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [setUser, setLoading])
  
  return (
    <>
      <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboard Routes */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        <Route path="/dashboard/member" element={<MemberDashboard />} />
        
        {/* Project Routes */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        
        {/* Task Routes */}
        <Route path="/tasks" element={<Tasks />} />
        
        {/* Credits */}
        <Route path="/credits" element={<Credits />} />
      </Route>
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    
    {/* Toast Notifications */}
    <ToastContainer />
  </>
  )
}

export default App
