import { memo } from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'

const Credits = memo(() => {
  const { isDark } = useThemeStore()
  
  const titleColor = isDark ? colors.primary[400] : colors.primary[600]
  const subtitleColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const headingColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const mutedColor = isDark ? colors.neutral[500] : colors.neutral[600]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="text-center">
        <motion.h1 
          className="text-4xl font-bold mb-2"
          style={{ color: titleColor }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          VistaFlow
        </motion.h1>
        <motion.p 
          className="text-xl"
          style={{ color: subtitleColor }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Internal Workflow & Team Management Platform
        </motion.p>
      </div>
      
      <Card padding="xl">
        <div className="space-y-8">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>
              About the Project
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: textColor }}>
              VistaFlow is a modern, full-stack team management platform built to demonstrate 
              enterprise-level application development with cutting-edge technologies and best practices.
            </p>
          </motion.div>
          
          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${colors.primary[500]}15` }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-2" style={{ color: colors.primary[isDark ? 400 : 700] }}>
                  Frontend
                </h3>
                <ul className="space-y-1 text-sm" style={{ color: textColor }}>
                  <li>• React 18 + Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• Zustand (State Management)</li>
                  <li>• React Query (API Management)</li>
                  <li>• Framer Motion (Animations)</li>
                  <li>• React Router DOM</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${colors.secondary[500]}15` }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-2" style={{ color: colors.secondary[isDark ? 400 : 700] }}>
                  Backend
                </h3>
                <ul className="space-y-1 text-sm" style={{ color: textColor }}>
                  <li>• Node.js + Express</li>
                  <li>• MongoDB + Mongoose</li>
                  <li>• JWT Authentication</li>
                  <li>• Socket.io (Real-time)</li>
                  <li>• Zod (Validation)</li>
                  <li>• Helmet (Security)</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '🔐', text: 'Secure JWT Authentication' },
                { icon: '👥', text: 'Role-Based Access Control' },
                { icon: '📊', text: 'Interactive Dashboards' },
                { icon: '📁', text: 'Hierarchical Project Management' },
                { icon: '✅', text: 'Task Management System' },
                { icon: '🔍', text: 'Advanced Search & Filters' },
                { icon: '📤', text: 'Excel Export Functionality' },
                { icon: '🌙', text: 'Dark Mode Support' },
                { icon: '⚡', text: 'Real-time Updates' },
                { icon: '📱', text: 'Mobile Responsive Design' },
                { icon: '🎨', text: 'Custom Theme System' },
                { icon: '🚀', text: 'Performance Optimized' }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-xl transition-all duration-300"
                  style={{ backgroundColor: isDark ? colors.dark[200] : colors.neutral[50] }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: isDark ? colors.dark[300] : colors.neutral[100] }}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span style={{ color: textColor }}>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>
              Architecture Highlights
            </h2>
            <div className="space-y-3">
              {[
                { title: '✓ MVC Pattern', desc: 'Clean separation of concerns with Models, Views, and Controllers on both frontend and backend' },
                { title: '✓ RESTful API Design', desc: '28+ well-structured endpoints with proper validation and error handling' },
                { title: '✓ Security First', desc: 'HttpOnly cookies, rate limiting, input validation, and comprehensive security headers' },
                { title: '✓ Performance Optimized', desc: 'Strategic MongoDB indexing, React Query caching, component memoization, and code splitting' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="p-4 rounded-xl border-2 transition-all duration-300"
                  style={{ 
                    borderColor: isDark ? colors.dark[400] : colors.neutral[200],
                    backgroundColor: isDark ? colors.dark[200] : 'transparent'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    borderColor: colors.success[500],
                    x: 4
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: colors.success[isDark ? 400 : 700] }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: mutedColor }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>
              Project Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '28+', label: 'API Endpoints', color: colors.primary },
                { value: '100+', label: 'Components', color: colors.secondary },
                { value: '15+', label: 'Pages', color: colors.accent },
                { value: '10+', label: 'Docs Files', color: colors.success }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${stat.color[500]}15` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <p className="text-3xl font-bold" style={{ color: stat.color[isDark ? 400 : 700] }}>
                    {stat.value}
                  </p>
                  <p className="text-sm mt-1" style={{ color: mutedColor }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Developer */}
          <motion.div 
            className="text-center pt-6 border-t"
            style={{ borderColor: isDark ? colors.dark[400] : colors.neutral[200] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-lg font-medium mb-2" style={{ color: headingColor }}>
              Built with ❤️ for Efficient Team Collaboration
            </p>
            <p style={{ color: mutedColor }}>
              A production-ready demonstration of modern full-stack development
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              {[
                { label: 'React', color: colors.primary },
                { label: 'Express', color: colors.secondary },
                { label: 'MongoDB', color: colors.success }
              ].map((tech, index) => (
                <motion.span 
                  key={index}
                  className="px-4 py-2 rounded-xl font-medium"
                  style={{ 
                    backgroundColor: `${tech.color[500]}20`,
                    color: tech.color[isDark ? 400 : 700]
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {tech.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
        
        </div>
      </Card>
    </motion.div>
  )
})

Credits.displayName = 'Credits'

export default Credits
