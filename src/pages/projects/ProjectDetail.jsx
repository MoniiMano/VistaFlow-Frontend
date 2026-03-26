import { memo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdArrowBack, MdAdd, MdEdit, MdDelete, MdMoreVert, 
  MdPerson, MdCalendarToday, MdFlag, MdCheckCircle 
} from 'react-icons/md'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { projectService } from '@api/services/projectService'
import { sectionService } from '@api/services/sectionService'
import { taskService } from '@api/services/taskService'
import { toast } from '@components/ui/Toast'

const statusColors = {
  todo: { bg: colors.neutral[500], text: 'white' },
  'in-progress': { bg: colors.primary[500], text: 'white' },
  review: { bg: colors.warning[500], text: 'white' },
  completed: { bg: colors.success[500], text: 'white' },
  blocked: { bg: colors.error[500], text: 'white' }
}

const priorityColors = {
  low: colors.neutral[500],
  medium: colors.primary[500],
  high: colors.warning[500],
  urgent: colors.error[500]
}

// Task Card Component
const TaskCard = memo(({ task, onEdit, onDelete, isDark }) => {
  const cardBg = isDark ? colors.dark[100] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl cursor-pointer group relative"
      style={{
        background: cardBg,
        border: `2px solid ${borderColor}`,
        boxShadow: isDark ? `0 2px 8px rgba(0,0,0,0.3)` : `0 2px 8px rgba(0,0,0,0.1)`
      }}
    >
      {/* Priority Indicator */}
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: priorityColors[task.priority] }}
      />
      
      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="p-1.5 rounded-lg"
          style={{ background: `${colors.primary[500]}20`, color: colors.primary[500] }}
        >
          <MdEdit size={14} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
          className="p-1.5 rounded-lg"
          style={{ background: `${colors.error[500]}20`, color: colors.error[500] }}
        >
          <MdDelete size={14} />
        </motion.button>
      </div>
      
      <h4 className="font-semibold mb-2 pr-12" style={{ color: titleColor }}>
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-sm mb-3 line-clamp-2" style={{ color: textColor }}>
          {task.description}
        </p>
      )}
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs rounded-full"
              style={{
                background: `${colors.accent[500]}15`,
                color: colors.accent[500]
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs" style={{ color: textColor }}>
        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <MdPerson size={14} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <MdCalendarToday size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'

// Section Column Component
const SectionColumn = memo(({ section, tasks, onAddTask, onEditSection, onDeleteSection, onEditTask, onDeleteTask, isDark }) => {
  const cardBg = isDark ? colors.dark[200] : colors.neutral[50]
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-shrink-0 w-80 rounded-2xl p-4"
      style={{
        background: cardBg,
        border: `2px solid ${borderColor}`
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg" style={{ color: titleColor }}>
            {section.name}
          </h3>
          <p className="text-xs" style={{ color: textColor }}>
            {tasks.length} tasks
          </p>
        </div>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditSection(section)}
            className="p-2 rounded-lg"
            style={{ color: textColor }}
          >
            <MdEdit size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDeleteSection(section._id)}
            className="p-2 rounded-lg"
            style={{ color: colors.error[500] }}
          >
            <MdDelete size={16} />
          </motion.button>
        </div>
      </div>
      
      {/* Tasks */}
      <div className="space-y-3 mb-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              isDark={isDark}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAddTask(section._id)}
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        style={{
          background: isDark ? colors.dark[300] : colors.neutral[200],
          color: isDark ? colors.neutral[300] : colors.neutral[700]
        }}
      >
        <MdAdd size={20} />
        Add Task
      </motion.button>
    </motion.div>
  )
})

SectionColumn.displayName = 'SectionColumn'

// Section Form Modal
const SectionFormModal = memo(({ isOpen, onClose, onSubmit, section, projectId, isLoading, isDark }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  useEffect(() => {
    if (section) {
      setName(section.name || '')
      setDescription(section.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [section, isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, description, project: projectId })
  }
  
  const labelColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const inputBg = isDark ? colors.dark[200] : '#ffffff'
  const inputBorder = isDark ? colors.dark[400] : colors.neutral[300]
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={section ? 'Edit Section' : 'Create Section'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Section Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., To Do, In Progress, Done"
            required
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            maxLength={300}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 rounded-xl font-semibold"
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
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Saving...' : section ? 'Update' : 'Create'}
          </motion.button>
        </div>
      </form>
    </Modal>
  )
})

SectionFormModal.displayName = 'SectionFormModal'

// Task Form Modal
const TaskFormModal = memo(({ isOpen, onClose, onSubmit, task, sectionId, projectId, isLoading, isDark }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: ''
  })
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        tags: ''
      })
    }
  }, [task, isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      section: sectionId,
      project: projectId,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }
    onSubmit(submitData)
  }
  
  const labelColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const inputBg = isDark ? colors.dark[200] : '#ffffff'
  const inputBorder = isDark ? colors.dark[400] : colors.neutral[300]
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
        
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
          />
        </div>
        
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
        
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 rounded-xl font-semibold"
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
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
              opacity: isLoading ? 0.7 : 1
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

const ProjectDetail = memo(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  
  const [project, setProject] = useState(null)
  const [sections, setSections] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const cardBg = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  
  const canManage = user?.role === 'admin' || (user?.role === 'manager' && project?.owner?._id === user?._id)
  
  useEffect(() => {
    fetchProjectData()
  }, [id])
  
  const fetchProjectData = async () => {
    try {
      setLoading(true)
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ project: id })
      ])
      
      if (projectRes.success) {
        setProject(projectRes.data)
        setSections(projectRes.data.sections || [])
      }
      
      if (tasksRes.success) {
        setTasks(tasksRes.data)
      }
    } catch (error) {
      toast.error('Failed to load project data')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateOrUpdateSection = async (formData) => {
    try {
      setIsSubmitting(true)
      
      if (editingSection) {
        const response = await sectionService.update(editingSection._id, formData)
        if (response.success) {
          toast.success('Section updated successfully')
          fetchProjectData()
          setIsSectionModalOpen(false)
          setEditingSection(null)
        }
      } else {
        const response = await sectionService.create(formData)
        if (response.success) {
          toast.success('Section created successfully')
          fetchProjectData()
          setIsSectionModalOpen(false)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save section')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Are you sure? This will delete all tasks in this section.')) return
    
    try {
      const response = await sectionService.delete(sectionId)
      if (response.success) {
        toast.success('Section deleted successfully')
        fetchProjectData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete section')
    }
  }
  
  const handleCreateOrUpdateTask = async (formData) => {
    try {
      setIsSubmitting(true)
      
      if (editingTask) {
        const response = await taskService.update(editingTask._id, formData)
        if (response.success) {
          toast.success('Task updated successfully')
          fetchProjectData()
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }
      } else {
        const response = await taskService.create(formData)
        if (response.success) {
          toast.success('Task created successfully')
          fetchProjectData()
          setIsTaskModalOpen(false)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await taskService.delete(taskId)
      if (response.success) {
        toast.success('Task deleted successfully')
        fetchProjectData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task')
    }
  }
  
  const handleAddTask = (sectionId) => {
    setSelectedSectionId(sectionId)
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }
  
  const handleEditTask = (task) => {
    setSelectedSectionId(task.section._id || task.section)
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }
  
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
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <p style={{ color: textColor }}>Project not found</p>
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
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/projects')}
            className="p-2 rounded-xl"
            style={{ background: cardBg, border: `2px solid ${borderColor}` }}
          >
            <MdArrowBack size={24} style={{ color: titleColor }} />
          </motion.button>
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ color: titleColor }}>
              {project.name}
            </h1>
            <p style={{ color: textColor }}>
              {project.description || 'No description'}
            </p>
          </div>
        </div>
        
        {canManage && (
          <Button 
            variant="primary" 
            icon={<MdAdd size={20} />}
            onClick={() => {
              setEditingSection(null)
              setIsSectionModalOpen(true)
            }}
          >
            Add Section
          </Button>
        )}
      </motion.div>
      
      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {sections.length > 0 ? (
            sections.map((section) => (
              <SectionColumn
                key={section._id}
                section={section}
                tasks={tasks.filter(t => t.section._id === section._id || t.section === section._id)}
                onAddTask={handleAddTask}
                onEditSection={setEditingSection}
                onDeleteSection={handleDeleteSection}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                isDark={isDark}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full text-center py-12"
            >
              <p className="text-lg mb-4" style={{ color: textColor }}>
                No sections yet. Create your first section to start organizing tasks!
              </p>
              {canManage && (
                <Button 
                  variant="primary" 
                  icon={<MdAdd size={20} />}
                  onClick={() => {
                    setEditingSection(null)
                    setIsSectionModalOpen(true)
                  }}
                >
                  Create First Section
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <SectionFormModal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false)
          setEditingSection(null)
        }}
        onSubmit={handleCreateOrUpdateSection}
        section={editingSection}
        projectId={id}
        isLoading={isSubmitting}
        isDark={isDark}
      />
      
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
          setSelectedSectionId(null)
        }}
        onSubmit={handleCreateOrUpdateTask}
        task={editingTask}
        sectionId={selectedSectionId}
        projectId={id}
        isLoading={isSubmitting}
        isDark={isDark}
      />
    </div>
  )
})

ProjectDetail.displayName = 'ProjectDetail'

export default ProjectDetail
