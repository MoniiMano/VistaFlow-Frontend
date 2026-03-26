import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { colors } from '@theme/colors'

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuthStore()
  const { isDark } = useThemeStore()
  
  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }
  
  const bgColor = isDark ? colors.dark[50] : colors.neutral[50]
  const titleColor = isDark ? colors.primary[400] : colors.primary[600]
  const subtitleColor = isDark ? colors.neutral[400] : colors.neutral[600]
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: titleColor }}>
            VistaFlow
          </h1>
          <p className="text-lg" style={{ color: subtitleColor }}>
            Internal Workflow & Team Management
          </p>
        </div>
        
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
