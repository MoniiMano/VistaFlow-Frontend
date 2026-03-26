import { memo } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@theme/colors'

const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const variants = {
    primary: {
      bg: colors.primary[500],
      hover: colors.primary[600],
      ring: colors.primary[400]
    },
    secondary: {
      bg: colors.secondary[500],
      hover: colors.secondary[600],
      ring: colors.secondary[400]
    },
    accent: {
      bg: colors.accent[500],
      hover: colors.accent[600],
      ring: colors.accent[400]
    },
    success: {
      bg: colors.success[500],
      hover: colors.success[600],
      ring: colors.success[400]
    },
    warning: {
      bg: colors.warning[500],
      hover: colors.warning[600],
      ring: colors.warning[400]
    },
    danger: {
      bg: colors.error[500],
      hover: colors.error[600],
      ring: colors.error[400]
    },
    outline: {
      bg: 'transparent',
      hover: colors.primary[50],
      ring: colors.primary[400],
      border: colors.primary[500]
    },
    ghost: {
      bg: 'transparent',
      hover: colors.neutral[100],
      ring: colors.neutral[400]
    }
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  }
  
  const variantStyle = variants[variant]
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizes[size]} ${widthClass} ${className}`}
      style={{
        backgroundColor: variantStyle.bg,
        color: variant === 'outline' || variant === 'ghost' ? variantStyle.border || colors.neutral[700] : 'white',
        border: variant === 'outline' ? `2px solid ${variantStyle.border}` : 'none',
        boxShadow: variant !== 'outline' && variant !== 'ghost' ? `0 4px 15px ${variantStyle.bg}40` : 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variantStyle.hover
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variantStyle.bg
        }
      }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
