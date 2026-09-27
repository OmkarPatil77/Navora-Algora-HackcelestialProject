import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = ({
  open,
  onOpenChange,
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-charcoal-950/40 backdrop-blur-xs"
            onClick={() => onOpenChange(false)}
          />
          {children}
        </div>
      )}
    </AnimatePresence>
  )
}

export const DialogContent = ({
  children,
  className,
  onClose,
  maxWidth = "max-w-lg"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ type: "spring", duration: 0.25, bounce: 0 }}
      className={cn(
        "relative z-50 w-full rounded-2xl border border-sand-200 bg-white p-6 shadow-soft-xl",
        maxWidth,
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-sand-100 hover:text-charcoal-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {children}
    </motion.div>
  )
}

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("mb-4 space-y-1 text-left", className)} {...props} />
)

export const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-bold text-charcoal-900 font-serif", className)} {...props} />
)

export const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-xs text-muted-foreground leading-relaxed", className)} {...props} />
)

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("mt-6 flex items-center justify-end gap-2.5", className)} {...props} />
)
