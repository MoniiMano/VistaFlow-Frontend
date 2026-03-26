import { memo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdRocket, MdTrendingUp, MdSpeed, MdSecurity } from 'react-icons/md'
import { colors } from '@theme/colors'
import { useAuthStore } from '@store/authStore'
import { authService } from '@api/services/authService'
import { toast } from '@components/ui/Toast'

const Login = memo(() => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      const response = await authService.login({ email, password })
      
      if (response.success) {
        setUser(response.user)
        toast.success('Login successful!')
        navigate(`/dashboard/${response.user.role}`)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
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
      
      {/* LEFT - Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          flex: '1',
          minWidth: '50%',
          maxWidth: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
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
              <MdRocket size={32} color="white" />
            </div>
          </motion.div>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Welcome to<br />VistaFlow
          </h1>
          
          <p style={{ 
            fontSize: '1.05rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Your ultimate team management platform for seamless collaboration
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
                <MdTrendingUp size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Boost Productivity
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Streamline workflows and track progress in real-time
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
                <MdSpeed size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Lightning Fast
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Built with modern tech for blazing performance
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
                <MdSecurity size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'white', marginBottom: '0.15rem' }}>
                  Secure & Reliable
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.3' }}>
                  Enterprise-grade security with JWT authentication
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                10K+
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Active Users
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                50K+
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Tasks Done
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                99.9%
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Uptime
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* RIGHT - Form */}
      <div style={{ 
        flex: '1',
        minWidth: '50%',
        maxWidth: '50%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.dark[100],
        padding: '2rem 2.5rem',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: colors.neutral[100],
              marginBottom: '0.5rem'
            }}>
              Sign In
            </h1>
            <p style={{ fontSize: '0.95rem', color: colors.neutral[400] }}>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 3rem',
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                color: 'white',
                background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                marginTop: '1rem'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In →'}
            </motion.button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: colors.neutral[400] }}>
              Don't have an account?{' '}
              <Link 
                to="/register"
                style={{ color: colors.primary[400], fontWeight: 'bold', textDecoration: 'none' }}
              >
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
})

Login.displayName = 'Login'

export default Login
