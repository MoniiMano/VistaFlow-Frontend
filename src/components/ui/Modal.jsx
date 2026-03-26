import { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { colors } from '@theme/colors'
import { useThemeStore } from '@store/themeStore'

const Modal = memo(({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showCloseButton = true
}) => {
  const { isDark } = useThemeStore()
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }
  
  const bgColor = isDark ? colors.dark[100] : '#ffffff'
  const borderColor = isDark ? colors.dark[300] : colors.neutral[200]
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900]
  const iconColor = isDark ? colors.neutral[400] : colors.neutral[500]
  const iconHoverBg = isDark ? colors.dark[200] : colors.neutral[100]
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
              style={{ backgroundColor: bgColor }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor }}>
                  {title && (
                    <h2 className="text-xl font-semibold" style={{ color: titleColor }}>
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-xl transition-all duration-300"
                      style={{ color: iconColor }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 90,
                        backgroundColor: iconHoverBg
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MdClose size={24} />
                    </motion.button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
})

Modal.displayName = 'Modal'

export default Modal
