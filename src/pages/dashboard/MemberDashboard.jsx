import { memo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdTask, MdCheckCircle, MdPending } from 'react-icons/md'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'
import { dashboardService } from '@api/services/dashboardService'
import { toast } from '@components/ui/Toast'

const StatCard = memo(({ icon, title, value, color, delay }) => {
  const { isDark } = useThemeStore()
  const textColor = isDark ? colors.neutral[300] : colors.neutral[600]
  const valueColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="rounded-2xl p-6"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `2px solid ${color}30`,
        boxShadow: `0 10px 30px ${color}20`
      }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="p-3 rounded-xl"
          style={{ background: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </motion.div>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: textColor }}>
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color: valueColor }}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

StatCard.displayName = 'StatCard'

const MemberDashboard = memo(() => {
  const { isDark } = useThemeStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const cardBg = isDark ? colors.dark[200] : 'var(--bg-secondary)'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getMemberStats()
        
        if (response.success) {
          setStats(response.data)
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2" style={{ color: titleColor }}>
          My Dashboard
        </h1>
        <p style={{ color: textColor }}>
          Track your tasks and progress
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<MdTask size={32} />}
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          color={colors.primary[500]}
          delay={0.1}
        />
        <StatCard
          icon={<MdPending size={32} />}
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          color={colors.warning[500]}
          delay={0.2}
        />
        <StatCard
          icon={<MdCheckCircle size={32} />}
          title="Completed"
          value={stats?.completedTasks || 0}
          color={colors.success[500]}
          delay={0.3}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-6"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: titleColor }}>
          My Tasks
        </h2>
        <p style={{ color: textColor }}>Task list will be displayed here</p>
      </motion.div>
    </div>
  )
})

MemberDashboard.displayName = 'MemberDashboard'

export default MemberDashboard
