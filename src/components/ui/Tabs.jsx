import React from 'react'
import { cn } from '@/lib/utils'

export const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return null
        return React.cloneElement(child, { activeValue: value, onValueChange })
      })}
    </div>
  )
}

export const TabsList = ({ children, activeValue, onValueChange, className }) => {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl bg-sand-200/60 p-1 border border-sand-300/60", className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return null
        return React.cloneElement(child, {
          isActive: child.props.value === activeValue,
          onClick: () => onValueChange && onValueChange(child.props.value)
        })
      })}
    </div>
  )
}

export const TabsTrigger = ({ children, value, isActive, onClick, className, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all select-none",
        isActive
          ? "bg-white text-charcoal-900 shadow-soft-xs font-semibold"
          : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/50",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

export const TabsContent = ({ value, activeValue, children, className }) => {
  if (value !== activeValue) return null
  return <div className={cn("outline-none animate-in fade-in duration-200", className)}>{children}</div>
}
