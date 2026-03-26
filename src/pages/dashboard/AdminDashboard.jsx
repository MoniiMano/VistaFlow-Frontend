import { memo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdFolder, MdTask, MdPeople, MdTrendingUp, MdArrowUpward } from 'react-icons/md'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'
import { dashboardService } from '@api/services/dashboardService'
import { projectService } from '@api/services/projectService'
import { toast } from '@components/ui/Toast'

const StatCard = memo(({ icon, title, value, color, trend, delay }) => {
  const { isDark } = useThemeStore()
  const textColor = isDark ? colors.neutral[300] : colors.neutral[600]
  const valueColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `2px solid ${color}30`,
        boxShadow: `0 10px 30px ${color}20`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.6 }}
          className="p-3 rounded-xl"
          style={{ 
            background: `${color}20`,
            boxShadow: `0 5px 15px ${color}30`
          }}
        >
          <div style={{ color }}>{icon}</div>
        </motion.div>
        
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
               style={{ background: `${colors.success[500]}20`, color: colors.success[500] }}>
            <MdArrowUpward size={14} />
            <span className="text-xs font-semibold">{trend}%</span>
          </div>
        )}
      </div>
      
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-sm font-medium mb-1"
          style={{ color: textColor }}
        >
          {title}
        </motion.p>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="text-4xl font-bold"
          style={{ color: valueColor }}
        >
          {value}
        </motion.p>
      </div>
      
      {/* Animated background effect */}
      <motion.div
        className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-10"
        style={{ background: color }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  )
})

StatCard.displayName = 'StatCard'

const ProjectCard = memo(({ project, delay }) => {
  const { isDark } = useThemeStore()
  const bgColor = isDark ? colors.dark[200] : 'var(--bg-secondary)'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const progressBg = isDark ? colors.dark[400] : colors.neutral[200]
  
  const statusColors = {
    active: colors.primary[500],
    planning: colors.warning[500],
    completed: colors.success[500]
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ x: 5 }}
      className="p-4 rounded-xl cursor-pointer"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold" style={{ color: titleColor }}>
          {project.name}
        </h3>
        <span 
          className="px-3 py-1 text-xs font-medium rounded-full"
          style={{ 
            background: `${statusColors[project.status]}20`,
            color: statusColors[project.status]
          }}
        >
          {project.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-3" style={{ color: textColor }}>
        <span>{project.tasks} tasks</span>
        <span className="font-semibold">{project.progress}%</span>
      </div>
      
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: progressBg }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${statusColors[project.status]}, ${statusColors[project.status]}dd)`
          }}
        />
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

const AdminDashboard = memo(() => {
  const { isDark } = useThemeStore()
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const cardBg = isDark ? colors.dark[200] : 'var(--bg-secondary)'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const statBg = isDark ? colors.dark[300] : 'var(--bg-tertiary)'
  const statTextColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const statValueColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, projectsRes] = await Promise.all([
          dashboardService.getAdminStats(),
          projectService.getAll({ limit: 4 })
        ])
        
        if (statsRes.success) {
          setStats(statsRes.data)
        }
        
        if (projectsRes.success) {
          setProjects(projectsRes.data)
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const taskStats = stats?.tasksByStatus || []
  const taskStatusMap = {
    'todo': { label: 'To Do', color: colors.neutral[500] },
    'in-progress': { label: 'In Progress', color: colors.primary[500] },
    'review': { label: 'Review', color: colors.warning[500] },
    'completed': { label: 'Completed', color: colors.success[500] }
  }
  
  const formattedTaskStats = taskStats.map(stat => ({
    status: taskStatusMap[stat._id]?.label || stat._id,
    count: stat.count,
    color: taskStatusMap[stat._id]?.color || colors.neutral[500]
  }))
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-transparent rounded-full"
          style={{ borderColor: colors.primary[500] }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: titleColor }}>
            Admin Dashboard
          </h1>
          <p style={{ color: textColor }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MdFolder size={32} />}
          title="Total Projects"
          value={stats?.totalProjects || 0}
          color={colors.primary[500]}
          delay={0.1}
        />
        <StatCard
          icon={<MdTask size={32} />}
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          color={colors.secondary[500]}
          delay={0.2}
        />
        <StatCard
          icon={<MdPeople size={32} />}
          title="Team Members"
          value={stats?.totalUsers || 0}
          color={colors.accent[500]}
          delay={0.3}
        />
        <StatCard
          icon={<MdTrendingUp size={32} />}
          title="Active Projects"
          value={stats?.activeProjects || 0}
          color={colors.success[500]}
          delay={0.4}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: titleColor }}>
            Recent Projects
          </h2>
          <div className="space-y-3">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard 
                  key={project._id} 
                  project={{
                    id: project._id,
                    name: project.name,
                    status: project.status,
                    tasks: project.sections?.reduce((sum, s) => sum + (s.tasks?.length || 0), 0) || 0,
                    progress: project.progress || 0
                  }} 
                  delay={0.6 + index * 0.1} 
                />
              ))
            ) : (
              <p className="text-center py-8" style={{ color: textColor }}>
                No projects yet. Create your first project!
              </p>
            )}
          </div>
        </motion.div>

        {/* Task Overview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: titleColor }}>
            Task Overview
          </h2>
          
          <div className="space-y-4 mb-6">
            {formattedTaskStats.length > 0 ? (
              formattedTaskStats.map((stat, index) => (
                <motion.div
                  key={stat.status}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: statBg }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-4 h-4 rounded-full"
                      style={{ background: stat.color }}
                    />
                    <span className="font-medium" style={{ color: statTextColor }}>
                      {stat.status}
                    </span>
                  </div>
                  <span className="text-xl font-bold" style={{ color: statValueColor }}>
                    {stat.count}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-4" style={{ color: textColor }}>
                No tasks yet
              </p>
            )}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
            className="text-center p-6 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary[500]}10, ${colors.secondary[500]}10)`,
              border: `2px solid ${colors.primary[500]}20`
            }}
          >
            <p className="text-5xl font-bold mb-2" style={{ color: colors.primary[isDark ? 400 : 600] }}>
              {stats?.totalTasks || 0}
            </p>
            <p className="text-sm font-medium" style={{ color: textColor }}>
              Total Tasks
            </p>
          </motion.div>
        </motion.div>
      </div>

    
    </div>
  )
})

AdminDashboard.displayName = 'AdminDashboard'

export default AdminDashboard
