import { memo } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'

const Card = memo(({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const { isDark } = useThemeStore()
  
  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
  
  const bgColor = isDark ? colors.dark[100] : '#ffffff'
  const borderColor = isDark ? colors.dark[300] : colors.neutral[200]
  
  const baseStyles = `rounded-xl border transition-all duration-300 ${paddings[padding]}`
  const hoverStyles = hover ? 'cursor-pointer hover:shadow-xl' : ''
  
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2, type: "spring", stiffness: 300 }
  } : {}
  
  return (
    <Component
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      style={{ 
        backgroundColor: bgColor,
        borderColor
      }}
      {...motionProps}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'

export default Card
