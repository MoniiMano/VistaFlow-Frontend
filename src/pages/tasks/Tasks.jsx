import { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdAdd, MdSearch, MdEdit, MdDelete, MdFilterList, 
  MdPerson, MdCalendarToday, MdFlag, MdCheckCircle,
  MdFolder, MdLabel
} from 'react-icons/md'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { taskService } from '@api/services/taskService'
import { projectService } from '@api/services/projectService'
import { sectionService } from '@api/services/sectionService'
import { userService } from '@api/services/userService'
import { toast } from '@components/ui/Toast'

const statusColors = {
  todo: { bg: colors.neutral[500], text: 'white', label: 'To Do' },
  'in-progress': { bg: colors.primary[500], text: 'white', label: 'In Progress' },
  review: { bg: colors.warning[500], text: 'white', label: 'Review' },
  completed: { bg: colors.success[500], text: 'white', label: 'Completed' },
  blocked: { bg: colors.error[500], text: 'white', label: 'Blocked' }
}

const priorityColors = {
  low: { color: colors.neutral[500], label: 'Low' },
  medium: { color: colors.primary[500], label: 'Medium' },
  high: { color: colors.warning[500], label: 'High' },
  urgent: { color: colors.error[500], label: 'Urgent' }
}

// Task Card Component
const TaskCard = memo(({ task, onEdit, onDelete, onStatusChange, isDark }) => {
  const cardBg = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const mutedColor = isDark ? colors.neutral[500] : colors.neutral[500]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="p-5 rounded-2xl cursor-pointer group relative"
      style={{
        background: cardBg,
        border: `2px solid ${borderColor}`,
        boxShadow: isDark ? `0 4px 16px rgba(0,0,0,0.3)` : `0 4px 16px rgba(0,0,0,0.08)`
      }}
    >
      {/* Priority Indicator */}
      <div 
        className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
        style={{ backgroundColor: priorityColors[task.priority].color }}
      />
      
      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="p-2 rounded-lg"
          style={{ background: `${colors.primary[500]}20`, color: colors.primary[500] }}
        >
          <MdEdit size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
          className="p-2 rounded-lg"
          style={{ background: `${colors.error[500]}20`, color: colors.error[500] }}
        >
          <MdDelete size={16} />
        </motion.button>
      </div>
      
      {/* Title */}
      <h3 className="font-bold text-lg mb-2 pr-20" style={{ color: titleColor }}>
        {task.title}
      </h3>
      
      {/* Description */}
      {task.description && (
        <p className="text-sm mb-4 line-clamp-2" style={{ color: textColor }}>
          {task.description}
        </p>
      )}
      
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <select
          value={task.status}
          onChange={(e) => { e.stopPropagation(); onStatusChange(task._id, e.target.value); }}
          className="px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all"
          style={{ 
            backgroundColor: statusColors[task.status].bg,
            color: statusColors[task.status].text,
            border: 'none',
            outline: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(statusColors).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>
        
        <span 
          className="px-3 py-1.5 text-xs font-semibold rounded-full"
          style={{ 
            background: `${priorityColors[task.priority].color}20`,
            color: priorityColors[task.priority].color
          }}
        >
          {priorityColors[task.priority].label}
        </span>
      </div>
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs rounded-lg flex items-center gap-1"
              style={{
                background: `${colors.accent[500]}15`,
                color: colors.accent[500]
              }}
            >
              <MdLabel size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Project & Section */}
      <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: mutedColor }}>
        {task.project && (
          <div className="flex items-center gap-1">
            <MdFolder size={14} />
            <span>{task.project.name}</span>
          </div>
        )}
        {task.section && (
          <div className="flex items-center gap-1">
            <span>•</span>
            <span>{task.section.name}</span>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor }}>
        <div className="flex items-center gap-3 text-xs" style={{ color: textColor }}>
          {task.assignedTo && (
            <div className="flex items-center gap-1.5">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                style={{ background: colors.primary[500] }}
              >
                {task.assignedTo.name.charAt(0).toUpperCase()}
              </div>
              <span>{task.assignedTo.name}</span>
            </div>
          )}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: textColor }}>
            <MdCalendarToday size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'

// Task Form Modal
const TaskFormModal = memo(({ isOpen, onClose, onSubmit, task, projects, sections, isLoading, isDark }) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    section: '',
    assignedTo: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: ''
  })
  
  const [filteredSections, setFilteredSections] = useState([])
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  
  const canAssignTasks = user?.role === 'admin' || user?.role === 'manager'
  
  useEffect(() => {
    if (isOpen && canAssignTasks) {
      fetchUsers()
    }
  }, [isOpen, canAssignTasks])
  
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      
      // Try to fetch from users endpoint first
      try {
        const response = await userService.getAll()
        if (response.success && response.data) {
          setUsers(response.data)
          setLoadingUsers(false)
          return
        }
      } catch (err) {
        console.log('Users endpoint not available, extracting from projects')
      }
      
      // Fallback: Extract unique users from all projects
      const projectsResponse = await projectService.getAll()
      if (projectsResponse.success && projectsResponse.data) {
        const uniqueUsers = new Map()
        
        projectsResponse.data.forEach(project => {
          // Add owner
          if (project.owner && project.owner._id) {
            uniqueUsers.set(project.owner._id, {
              _id: project.owner._id,
              name: project.owner.name,
              email: project.owner.email,
              role: project.owner.role || 'unknown'
            })
          }
          
          // Add members
          if (project.members && Array.isArray(project.members)) {
            project.members.forEach(member => {
              if (member._id) {
                uniqueUsers.set(member._id, {
                  _id: member._id,
                  name: member.name,
                  email: member.email,
                  role: member.role || 'member'
                })
              }
            })
          }
        })
        
        setUsers(Array.from(uniqueUsers.values()))
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || '',
        section: task.section?._id || '',
        assignedTo: task.assignedTo?._id || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        project: '',
        section: '',
        assignedTo: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        tags: ''
      })
    }
  }, [task, isOpen])
  
  useEffect(() => {
    if (formData.project) {
      const projectSections = sections.filter(s => s.project._id === formData.project || s.project === formData.project)
      setFilteredSections(projectSections)
    } else {
      setFilteredSections([])
    }
  }, [formData.project, sections])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.project) {
      toast.error('Please select a project')
      return
    }
    
    if (!formData.section) {
      toast.error('Please select a section')
      return
    }
    
    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }
    onSubmit(submitData)
  }
  
  const labelColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const inputBg = isDark ? colors.dark[200] : '#ffffff'
  const inputBorder = isDark ? colors.dark[400] : colors.neutral[300]
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter task title"
            required
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary[500]
              e.target.style.boxShadow = `0 0 0 4px ${colors.primary[500]}20`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description"
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary[500]
              e.target.style.boxShadow = `0 0 0 4px ${colors.primary[500]}20`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
        
        {/* Project & Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Project *
            </label>
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value, section: '' })}
              required
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Section *
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              required
              disabled={!formData.project}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ 
                background: inputBg, 
                borderColor: inputBorder, 
                color: inputColor,
                opacity: !formData.project ? 0.5 : 1
              }}
            >
              <option value="">Select Section</option>
              {filteredSections.map(section => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Assign To (Admin/Manager only) */}
        {canAssignTasks && (
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Assign To (Optional)
            </label>
            {loadingUsers ? (
              <div className="text-center py-3" style={{ color: labelColor }}>
                Loading users...
              </div>
            ) : (
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
                style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        
        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
          />
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., frontend, urgent, bug"
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
          />
        </div>
        
        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: isDark ? colors.dark[300] : colors.neutral[200],
              color: isDark ? colors.neutral[300] : colors.neutral[700]
            }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </motion.button>
        </div>
      </form>
    </Modal>
  )
})

TaskFormModal.displayName = 'TaskFormModal'

const Tasks = memo(() => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const cardBg = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const inputBg = isDark ? colors.dark[100] : '#ffffff'
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, projectsRes] = await Promise.all([
        user?.role === 'member' ? taskService.getMyTasks() : taskService.getAll(),
        projectService.getAll()
      ])
      
      if (tasksRes.success) {
        setTasks(tasksRes.data)
      }
      
      if (projectsRes.success) {
        setProjects(projectsRes.data)
        
        // Fetch all sections from all projects
        const allSections = []
        for (const project of projectsRes.data) {
          if (project.sections) {
            allSections.push(...project.sections)
          }
        }
        setSections(allSections)
      }
    } catch (error) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateOrUpdate = async (formData) => {
    try {
      setIsSubmitting(true)
      
      if (editingTask) {
        const response = await taskService.update(editingTask._id, formData)
        if (response.success) {
          toast.success('Task updated successfully')
          fetchData()
          setIsModalOpen(false)
          setEditingTask(null)
        }
      } else {
        const response = await taskService.create(formData)
        if (response.success) {
          toast.success('Task created successfully')
          fetchData()
          setIsModalOpen(false)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await taskService.delete(id)
      if (response.success) {
        toast.success('Task deleted successfully')
        fetchData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task')
    }
  }
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await taskService.update(id, { status: newStatus })
      if (response.success) {
        toast.success('Status updated successfully')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }
  
  const handleEdit = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || task.status === filterStatus
    const matchesPriority = !filterPriority || task.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })
  
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
            Tasks
          </h1>
          <p style={{ color: textColor }}>
            {user?.role === 'member' ? 'Your assigned tasks' : 'Manage all tasks'}
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<MdAdd size={20} />}
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
        >
          New Task
        </Button>
      </motion.div>
      
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4"
        style={{ background: cardBg, border: `2px solid ${borderColor}` }}
      >
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px] relative">
            <MdSearch 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              size={20} 
              style={{ color: colors.neutral[400] }} 
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
              style={{ 
                borderColor,
                background: inputBg,
                color: inputColor
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary[500]
                e.target.style.boxShadow = `0 0 20px ${colors.primary[500]}20`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = borderColor
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor, color: inputColor }}
          >
            <option value="">All Status</option>
            {Object.entries(statusColors).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          
          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor, color: inputColor }}
          >
            <option value="">All Priority</option>
            {Object.entries(priorityColors).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
      </motion.div>
      
      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isDark={isDark}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-lg mb-4" style={{ color: textColor }}>
                {searchQuery || filterStatus || filterPriority 
                  ? 'No tasks found matching your filters' 
                  : 'No tasks yet. Create your first task!'}
              </p>
              {!searchQuery && !filterStatus && !filterPriority && (
                <Button 
                  variant="primary" 
                  icon={<MdAdd size={20} />}
                  onClick={() => {
                    setEditingTask(null)
                    setIsModalOpen(true)
                  }}
                >
                  Create Your First Task
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        projects={projects}
        sections={sections}
        isLoading={isSubmitting}
        isDark={isDark}
      />
    </div>
  )
})

Tasks.displayName = 'Tasks'

export default Tasks
