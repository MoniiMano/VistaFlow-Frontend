import { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md'
import { create } from 'zustand'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'

// Toast Store
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, toast.duration || 3000)
    
    return id
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  clearAll: () => set({ toasts: [] })
}))

// Toast helper functions
export const toast = {
  success: (message, duration) => useToastStore.getState().addToast({ type: 'success', message, duration }),
  error: (message, duration) => useToastStore.getState().addToast({ type: 'error', message, duration }),
  warning: (message, duration) => useToastStore.getState().addToast({ type: 'warning', message, duration }),
  info: (message, duration) => useToastStore.getState().addToast({ type: 'info', message, duration })
}

const ToastItem = memo(({ toast: toastData, onClose }) => {
  const { isDark } = useThemeStore()
  
  const icons = {
    success: <MdCheckCircle size={20} />,
    error: <MdError size={20} />,
    warning: <MdWarning size={20} />,
    info: <MdInfo size={20} />
  }
  
  const colorMap = {
    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[500],
    info: colors.primary[500]
  }
  
  const bgMap = isDark ? {
    success: `${colors.success[500]}20`,
    error: `${colors.error[500]}20`,
    warning: `${colors.warning[500]}20`,
    info: `${colors.primary[500]}20`
  } : {
    success: colors.success[50],
    error: colors.error[50],
    warning: colors.warning[50],
    info: colors.primary[50]
  }
  
  const textColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const borderColor = isDark ? `${colorMap[toastData.type]}40` : `${colorMap[toastData.type]}30`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl mb-3 min-w-[300px] max-w-[400px]"
      style={{
        background: bgMap[toastData.type],
        border: `1px solid ${borderColor}`
      }}
    >
      <div style={{ color: colorMap[toastData.type] }}>
        {icons[toastData.type]}
      </div>
      <p className="flex-1 text-sm font-medium" style={{ color: textColor }}>
        {toastData.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: isDark ? colors.neutral[400] : colors.neutral[600] }}
      >
        <MdClose size={16} />
      </button>
    </motion.div>
  )
})

ToastItem.displayName = 'ToastItem'

export const ToastContainer = memo(() => {
  const { toasts, removeToast } = useToastStore()
  
  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
})

ToastContainer.displayName = 'ToastContainer'

export default ToastContainer
