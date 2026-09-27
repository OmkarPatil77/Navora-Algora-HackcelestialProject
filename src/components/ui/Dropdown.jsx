import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export const Dropdown = ({
  trigger,
  children,
  align = 'right',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(prev => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-50 mt-2 min-w-[200px] rounded-xl border border-sand-200 bg-white p-1.5 shadow-soft-lg ring-1 ring-black/5 focus:outline-none",
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const DropdownItem = ({ children, className, onClick, destructive = false, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left",
        destructive
          ? "text-rose-600 hover:bg-rose-50"
          : "text-charcoal-700 hover:bg-sand-100 hover:text-charcoal-900",
        className
      )}
    >
      {icon && <span className="w-4 h-4 shrink-0 text-muted-foreground">{icon}</span>}
      {children}
    </button>
  )
}

export const DropdownSeparator = () => (
  <div className="my-1 h-px bg-sand-200" />
)
