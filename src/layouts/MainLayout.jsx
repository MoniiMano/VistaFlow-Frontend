import { useState, memo } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdDashboard, 
  MdFolder, 
  MdTask, 
  MdMenu, 
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdInfo,
  MdLogout
} from 'react-icons/md'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { colors } from '@theme/colors'
import { authService } from '@api/services/authService'
import { toast } from '@components/ui/Toast'

const Sidebar = memo(({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore()
  const { isDark } = useThemeStore()
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }
  
  const menuItems = [
    { 
      icon: <MdDashboard size={22} />, 
      label: 'Dashboard', 
      path: `/dashboard/${user?.role || 'admin'}`,
      color: colors.primary
    },
    { 
      icon: <MdFolder size={22} />, 
      label: 'Projects', 
      path: '/projects',
      color: colors.secondary
    },
    { 
      icon: <MdTask size={22} />, 
      label: 'Tasks', 
      path: '/tasks',
      color: colors.accent
    },
    { 
      icon: <MdInfo size={22} />, 
      label: 'Credits', 
      path: '/credits',
      color: colors.success
    }
  ]
  
  const bgColor = isDark ? colors.dark[100] : '#ffffff'
  const borderColor = isDark ? colors.dark[300] : colors.neutral[200]
  const textColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const mutedColor = isDark ? colors.neutral[400] : colors.neutral[500]
  
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - Always visible on desktop */}
      <aside
        className="fixed left-0 top-0 h-full w-56 border-r z-50 backdrop-blur-xl shadow-xl"
        style={{ 
          backgroundColor: bgColor,
          borderColor: borderColor,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            aside {
              transform: translateX(0) !important;
            }
          }
        `}</style>
        <div className="flex flex-col h-full">
          {/* Compact Logo with animated gradient background */}
          <div className="p-3 border-b relative overflow-hidden" style={{ borderColor }}>
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  `linear-gradient(45deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
                  `linear-gradient(90deg, ${colors.secondary[500]}, ${colors.accent[500]})`,
                  `linear-gradient(135deg, ${colors.accent[500]}, ${colors.primary[500]})`,
                  `linear-gradient(45deg, ${colors.primary[500]}, ${colors.secondary[500]})`
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center gap-2.5">
              {/* Logo Icon */}
              <motion.div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
                  color: 'white',
                  boxShadow: `0 4px 12px ${colors.primary[500]}40`
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  V
                </motion.div>
              </motion.div>
              
              <div className="flex-1">
                <motion.h1 
                  className="text-lg font-bold leading-tight"
                  style={{ color: colors.primary[isDark ? 400 : 600] }}
                  whileHover={{ x: 2 }}
                >
                  VistaFlow
                </motion.h1>
                <motion.p 
                  className="text-xs leading-tight"
                  style={{ color: mutedColor }}
                >
                  Team Management
                </motion.p>
              </div>
            </div>
          </div>
          
          {/* Menu with creative hover effects */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path)
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="block relative group"
                  >
                    <motion.div
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden"
                      style={{ 
                        backgroundColor: isActive 
                          ? `${item.color[500]}15` 
                          : 'transparent',
                        color: isActive ? item.color[600] : textColor
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                          style={{ backgroundColor: item.color[600] }}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon with rotation on hover */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      
                      <span className="font-medium text-sm">{item.label}</span>
                      
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${item.color[500]}10, transparent)`
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          
          {/* Compact User Info with glassmorphism */}
          <motion.div 
            className="p-3 border-t relative overflow-hidden"
            style={{ borderColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2.5 relative z-10 mb-2">
              <motion.div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm relative overflow-hidden" 
                style={{ 
                  backgroundColor: `${colors.primary[500]}20`,
                  color: colors.primary[600]
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      `radial-gradient(circle at 0% 0%, ${colors.primary[400]}, transparent)`,
                      `radial-gradient(circle at 100% 100%, ${colors.secondary[400]}, transparent)`,
                      `radial-gradient(circle at 0% 100%, ${colors.accent[400]}, transparent)`,
                      `radial-gradient(circle at 0% 0%, ${colors.primary[400]}, transparent)`
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                {user?.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm" style={{ color: textColor }}>
                  {user?.name}
                </p>
                <p className="text-xs truncate capitalize" style={{ color: mutedColor }}>
                  {user?.role}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: isDark ? colors.dark[200] : colors.neutral[100],
                color: colors.error[500]
              }}
              whileHover={{ scale: 1.02, backgroundColor: `${colors.error[500]}15` }}
              whileTap={{ scale: 0.98 }}
            >
              <MdLogout size={18} />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </aside>
    </>
  )
})

Sidebar.displayName = 'Sidebar'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark, toggleTheme } = useThemeStore()
  
  const bgColor = isDark ? colors.dark[50] : colors.neutral[50]
  const headerBg = isDark ? colors.dark[100] : '#ffffff'
  const borderColor = isDark ? colors.dark[300] : colors.neutral[200]
  const iconColor = isDark ? colors.neutral[300] : colors.neutral[700]
  
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content - Adjusted for sidebar */}
      <div className="lg:pl-56 transition-all duration-300">
        {/* Compact Header with glassmorphism */}
        <motion.header 
          className="border-b sticky top-0 z-30 backdrop-blur-xl"
          style={{ 
            backgroundColor: `${headerBg}f0`,
            borderColor
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: isDark ? colors.dark[200] : colors.neutral[100],
                color: iconColor
              }}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </motion.button>
            
            {/* Breadcrumb or Page Title - Optional */}
            <div className="hidden lg:block ml-4">
              <p className="text-sm font-medium" style={{ color: iconColor }}>
                Dashboard
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              {/* Quick Stats - Optional */}
              <motion.div
                className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-lg"
                style={{ backgroundColor: isDark ? colors.dark[200] : colors.neutral[100] }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success[500] }} />
                  <span className="text-xs font-medium" style={{ color: iconColor }}>
                    All Systems Operational
                  </span>
                </div>
              </motion.div>
              
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: isDark ? colors.dark[200] : colors.neutral[100],
                  color: iconColor
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                </motion.div>
                
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0"
                  style={{
                    background: `radial-gradient(circle, ${isDark ? colors.warning[500] : colors.primary[500]}30, transparent)`
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.header>
        
        {/* Page Content with fade-in animation - Reduced padding */}
        <motion.main 
          className="p-4 lg:p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

export default MainLayout
