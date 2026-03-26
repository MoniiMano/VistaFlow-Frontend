import { memo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdRocketLaunch, MdGroups, MdTask, MdDashboard } from 'react-icons/md'
import { colors } from '@theme/colors'
import { useAuthStore } from '@store/authStore'
import { authService } from '@api/services/authService'
import { toast } from '@components/ui/Toast'

const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  useEffect(() => {
    document.body.classList.add('auth-page')
    return () => {
      document.body.classList.remove('auth-page')
    }
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authService.register(registerData)
      
      if (response.success) {
        setUser(response.user)
        toast.success('Registration successful!')
        navigate(`/dashboard/${response.user.role}`)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      setErrors({ submit: message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      
      {/* LEFT - Form */}
      <div style={{ 
        flex: '1',
        minWidth: '50%',
        maxWidth: '50%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.dark[100],
        padding: '1.5rem 2rem',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '420px', paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              textAlign:'center',
              color: colors.neutral[100],
              marginBottom: '0.4rem'
            }}>
              ! . . . Create Account . . . !
            </h1>
           
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errors.submit && (
              <div style={{ 
                padding: '1rem',
                borderRadius: '0.75rem',
                background: `${colors.error[500]}15`,
                border: `1px solid ${colors.error[500]}40`
              }}>
                <p style={{ fontSize: '0.875rem', color: colors.error[400] }}>
                  {errors.submit}
                </p>
              </div>
            )}
            
            {/* Name */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: colors.neutral[300],
                marginBottom: '0.5rem'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <MdPerson size={20} style={{ color: colors.accent[400] }} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${errors.name ? colors.error[500] : colors.dark[400]}`,
                    background: colors.dark[200],
                    color: colors.neutral[100],
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.accent[500]
                    e.target.style.boxShadow = `0 0 0 4px ${colors.accent[500]}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? colors.error[500] : colors.dark[400]
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              {errors.name && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: colors.error[400] }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: colors.neutral[300],
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <MdEmail size={20} style={{ color: colors.primary[400] }} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${errors.email ? colors.error[500] : colors.dark[400]}`,
                    background: colors.dark[200],
                    color: colors.neutral[100],
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary[500]
                    e.target.style.boxShadow = `0 0 0 4px ${colors.primary[500]}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? colors.error[500] : colors.dark[400]
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: colors.error[400] }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: colors.neutral[300],
                marginBottom: '0.5rem'
              }}>
                Select Role
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'member' }))}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${formData.role === 'member' ? colors.primary[500] : colors.dark[400]}`,
                    background: formData.role === 'member' ? `${colors.primary[500]}20` : colors.dark[200],
                    color: formData.role === 'member' ? colors.primary[400] : colors.neutral[300],
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'manager' }))}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${formData.role === 'manager' ? colors.secondary[500] : colors.dark[400]}`,
                    background: formData.role === 'manager' ? `${colors.secondary[500]}20` : colors.dark[200],
                    color: formData.role === 'manager' ? colors.secondary[400] : colors.neutral[300],
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${formData.role === 'admin' ? colors.accent[500] : colors.dark[400]}`,
                    background: formData.role === 'admin' ? `${colors.accent[500]}20` : colors.dark[200],
                    color: formData.role === 'admin' ? colors.accent[400] : colors.neutral[300],
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Admin
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: colors.neutral[500] }}>
                {formData.role === 'member' && 'Access to assigned tasks and projects'}
                {formData.role === 'manager' && 'Manage teams and assign tasks'}
                {formData.role === 'admin' && 'Full system access and control'}
              </p>
            </div>

            {/* Password */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: colors.neutral[300],
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <MdLock size={20} style={{ color: colors.secondary[400] }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 3rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${errors.password ? colors.error[500] : colors.dark[400]}`,
                    background: colors.dark[200],
                    color: colors.neutral[100],
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.secondary[500]
                    e.target.style.boxShadow = `0 0 0 4px ${colors.secondary[500]}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? colors.error[500] : colors.dark[400]
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? 
                    <MdVisibilityOff size={20} style={{ color: colors.neutral[400] }} /> :
                    <MdVisibility size={20} style={{ color: colors.neutral[400] }} />
                  }
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: colors.error[400] }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: colors.neutral[300],
                marginBottom: '0.5rem'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <MdLock size={20} style={{ color: colors.secondary[400] }} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 3rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${errors.confirmPassword ? colors.error[500] : colors.dark[400]}`,
                    background: colors.dark[200],
                    color: colors.neutral[100],
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.secondary[500]
                    e.target.style.boxShadow = `0 0 0 4px ${colors.secondary[500]}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? colors.error[500] : colors.dark[400]
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {showConfirmPassword ? 
                    <MdVisibilityOff size={20} style={{ color: colors.neutral[400] }} /> :
                    <MdVisibility size={20} style={{ color: colors.neutral[400] }} />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: colors.error[400] }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                color: 'white',
                background: `linear-gradient(135deg, ${colors.accent[500]}, ${colors.primary[500]})`,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? 'Creating account...' : 'Create Account →'}
            </motion.button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: colors.neutral[400] }}>
              Already have an account?{' '}
              <Link 
                to="/login"
                style={{ color: colors.accent[400], fontWeight: 'bold', textDecoration: 'none' }}
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* RIGHT - Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          flex: '1',
          minWidth: '50%',
          maxWidth: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.accent[600]} 0%, ${colors.secondary[600]} 100%)`,
          padding: '2rem 2.5rem',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <MdRocketLaunch size={32} color="white" />
            </div>
          </motion.div>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Start Your<br />Journey Today
          </h1>
          
          <p style={{ 
            fontSize: '1.05rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Join thousands of teams using VistaFlow to manage projects efficiently
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ 
                padding: '0.6rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MdGroups size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Team Collaboration
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Work together seamlessly with your entire team
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ 
                padding: '0.6rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MdTask size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Task Management
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Organize and prioritize tasks with ease
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ 
                padding: '0.6rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MdDashboard size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Real-time Insights
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Track progress with beautiful dashboards
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                Free
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Forever Plan
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                24/7
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Support
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                100%
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Satisfaction
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
})

Register.displayName = 'Register'

export default Register
