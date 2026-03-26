import { memo, forwardRef } from 'react'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'

const Input = memo(forwardRef(({ 
  label,
  error,
  icon,
  type = 'text',
  placeholder,
  className = '',
  ...props 
}, ref) => {
  const { isDark } = useThemeStore()
  
  const labelColor = isDark ? colors.neutral[300] : colors.neutral[700]
  const bgColor = isDark ? colors.dark[200] : '#ffffff'
  const borderColor = isDark ? colors.dark[400] : colors.neutral[300]
  const textColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const iconColor = isDark ? colors.neutral[500] : colors.neutral[400]
  const focusBorderColor = error ? colors.error[500] : colors.primary[500]
  const focusRingColor = error ? colors.error[500] : colors.primary[500]
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span style={{ color: iconColor }}>{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          style={{
            backgroundColor: bgColor,
            borderColor: error ? colors.error[500] : borderColor,
            color: textColor
          }}
          onFocus={(e) => {
            e.target.style.borderColor = focusBorderColor
            e.target.style.boxShadow = `0 0 0 3px ${focusRingColor}20`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? colors.error[500] : borderColor
            e.target.style.boxShadow = 'none'
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm font-medium" style={{ color: colors.error[500] }}>
          {error}
        </p>
      )}
    </div>
  )
}))

Input.displayName = 'Input'

export default Input
