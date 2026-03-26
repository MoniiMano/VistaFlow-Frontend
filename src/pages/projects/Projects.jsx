import { memo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdCalendarToday, MdPeople } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { projectService } from '@api/services/projectService'
import { userService } from '@api/services/userService'
import { toast } from '@components/ui/Toast'

const statusColors = {
  planning: { bg: colors.neutral[200], text: colors.neutral[700], darkBg: colors.neutral[600] },
  active: { bg: colors.primary[500], text: 'white', darkBg: colors.primary[600] },
  'on-hold': { bg: colors.warning[500], text: 'white', darkBg: colors.warning[600] },
  completed: { bg: colors.success[500], text: 'white', darkBg: colors.success[600] },
  archived: { bg: colors.neutral[400], text: 'white', darkBg: colors.neutral[500] }
}

const priorityColors = {
  low: colors.neutral[500],
  medium: colors.primary[500],
  high: colors.warning[500],
  urgent: colors.error[500]
}

const ProjectCard = memo(({ project, delay, onEdit, onDelete, onView }) => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const cardBg = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const mutedColor = isDark ? colors.neutral[500] : colors.neutral[500]
  const ownerColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const progressBg = isDark ? colors.dark[400] : colors.neutral[200]
  
  const canEdit = user?.role === 'admin' || (user?.role === 'manager' && project.owner?._id === user?._id)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="rounded-2xl p-6 cursor-pointer relative group"
      style={{
        background: cardBg,
        border: `2px solid ${borderColor}`,
        boxShadow: isDark ? `0 4px 20px rgba(0,0,0,0.4)` : `0 4px 20px rgba(0,0,0,0.1)`
      }}
      onClick={() => onView(project._id)}
    >
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {canEdit && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-2 rounded-lg"
              style={{ background: `${colors.primary[500]}20`, color: colors.primary[500] }}
            >
              <MdEdit size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
              className="p-2 rounded-lg"
              style={{ background: `${colors.error[500]}20`, color: colors.error[500] }}
            >
              <MdDelete size={18} />
            </motion.button>
          </>
        )}
      </div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-16">
          <h3 className="text-lg font-bold mb-2" style={{ color: titleColor }}>
            {project.name}
          </h3>
          <p className="text-sm line-clamp-2" style={{ color: textColor }}>
            {project.description || 'No description'}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 180 }}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: priorityColors[project.priority] }}
        />
      </div>
      
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span 
          className="px-3 py-1 text-xs font-semibold rounded-full"
          style={{ 
            backgroundColor: isDark ? statusColors[project.status].darkBg : statusColors[project.status].bg,
            color: statusColors[project.status].text
          }}
        >
          {project.status}
        </span>
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ 
          color: priorityColors[project.priority],
          background: `${priorityColors[project.priority]}15`
        }}>
          {project.priority}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm mb-4" style={{ color: textColor }}>
        <span className="flex items-center gap-1">
          <MdPeople size={16} />
          {project.members?.length || 0}
        </span>
        {project.startDate && (
          <span className="flex items-center gap-1">
            <MdCalendarToday size={14} />
            {new Date(project.startDate).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t" style={{ borderColor }}>
        <p className="text-xs" style={{ color: mutedColor }}>
          Owner: <span style={{ color: ownerColor }}>{project.owner?.name || 'Unknown'}</span>
        </p>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

const ProjectFormModal = memo(({ isOpen, onClose, onSubmit, project, isLoading }) => {
  const { isDark } = useThemeStore()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    members: []
  })
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])
  
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
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        members: project.members?.map(m => m._id) || []
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '',
        endDate: '',
        members: []
      })
    }
  }, [project, isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  const toggleMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }))
  }
  
  const labelColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const inputBg = isDark ? colors.dark[200] : '#ffffff'
  const inputBorder = isDark ? colors.dark[400] : colors.neutral[300]
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Create New Project'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Project Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
            required
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
            style={{ 
              background: inputBg,
              borderColor: inputBorder,
              color: inputColor
            }}
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
            placeholder="Enter project description"
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none"
            style={{ 
              background: inputBg,
              borderColor: inputBorder,
              color: inputColor
            }}
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
              style={{ 
                background: inputBg,
                borderColor: inputBorder,
                color: inputColor
              }}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
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
              style={{ 
                background: inputBg,
                borderColor: inputBorder,
                color: inputColor
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ 
                background: inputBg,
                borderColor: inputBorder,
                color: inputColor
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
              style={{ 
                background: inputBg,
                borderColor: inputBorder,
                color: inputColor
              }}
            />
          </div>
        </div>
        
        {/* Team Members */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
            Team Members (Optional)
          </label>
          {loadingUsers ? (
            <div className="text-center py-4" style={{ color: labelColor }}>
              Loading users...
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 p-3 rounded-xl border-2" style={{ borderColor: inputBorder, background: inputBg }}>
              {users.length > 0 ? (
                users.map(user => (
                  <label
                    key={user._id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
                    style={{ 
                      background: formData.members.includes(user._id) ? `${colors.primary[500]}20` : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: colors.primary[500] }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: inputColor }}>
                        {user.name}
                      </p>
                      <p className="text-xs" style={{ color: isDark ? colors.neutral[500] : colors.neutral[600] }}>
                        {user.email} • {user.role}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center text-sm py-2" style={{ color: labelColor }}>
                  No users available
                </p>
              )}
            </div>
          )}
          <p className="text-xs mt-2" style={{ color: isDark ? colors.neutral[500] : colors.neutral[600] }}>
            Selected: {formData.members.length} member(s)
          </p>
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
            {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </motion.button>
        </div>
      </form>
    </Modal>
  )
})

ProjectFormModal.displayName = 'ProjectFormModal'

const Projects = memo(() => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600]
  const cardBg = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[200]
  const inputBg = isDark ? colors.dark[100] : '#ffffff'
  const inputColor = isDark ? colors.neutral[100] : colors.neutral[900]
  
  const canCreateProject = user?.role === 'admin' || user?.role === 'manager'
  
  useEffect(() => {
    fetchProjects()
  }, [])
  
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectService.getAll()
      
      if (response.success) {
        // Filter projects based on role
        let filteredProjects = response.data
        
        if (user?.role === 'member') {
          // Members can only see projects they're assigned to
          filteredProjects = response.data.filter(project => 
            project.members?.some(member => member._id === user._id)
          )
        } else if (user?.role === 'manager') {
          // Managers can see their own projects and projects they're members of
          filteredProjects = response.data.filter(project => 
            project.owner?._id === user._id || 
            project.members?.some(member => member._id === user._id)
          )
        }
        // Admin sees all projects (no filter needed)
        
        setProjects(filteredProjects)
      }
    } catch (error) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateOrUpdate = async (formData) => {
    try {
      setIsSubmitting(true)
      
      if (editingProject) {
        const response = await projectService.update(editingProject._id, formData)
        if (response.success) {
          toast.success('Project updated successfully')
          fetchProjects()
          setIsModalOpen(false)
          setEditingProject(null)
        }
      } else {
        const response = await projectService.create(formData)
        if (response.success) {
          toast.success('Project created successfully')
          fetchProjects()
          setIsModalOpen(false)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await projectService.delete(id)
      if (response.success) {
        toast.success('Project deleted successfully')
        fetchProjects()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project')
    }
  }
  
  const handleEdit = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }
  
  const handleView = (id) => {
    navigate(`/projects/${id}`)
  }
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: titleColor }}>
            Projects
          </h1>
          <p style={{ color: textColor }}>
            Manage and track all your projects
          </p>
        </div>
        {canCreateProject && (
          <Button 
            variant="primary" 
            icon={<MdAdd size={20} />}
            onClick={() => {
              setEditingProject(null)
              setIsModalOpen(true)
            }}
          >
            New Project
          </Button>
        )}
      </motion.div>
      
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4"
        style={{ background: cardBg, border: `1px solid ${borderColor}` }}
      >
        <div className="relative">
          <MdSearch 
            className="absolute left-4 top-1/2 transform -translate-y-1/2" 
            size={20} 
            style={{ color: colors.neutral[400] }} 
          />
          <input
            type="text"
            placeholder="Search projects..."
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
      </motion.div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project._id} 
              project={project}
              delay={0.2 + index * 0.1}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <p className="text-lg mb-4" style={{ color: textColor }}>
              {searchQuery ? 'No projects found matching your search' : 'No projects yet'}
            </p>
            {canCreateProject && !searchQuery && (
              <Button 
                variant="primary" 
                icon={<MdAdd size={20} />}
                onClick={() => {
                  setEditingProject(null)
                  setIsModalOpen(true)
                }}
              >
                Create Your First Project
              </Button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProject(null)
        }}
        onSubmit={handleCreateOrUpdate}
        project={editingProject}
        isLoading={isSubmitting}
      />
    </div>
  )
})

Projects.displayName = 'Projects'

export default Projects
