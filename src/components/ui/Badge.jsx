import React from 'react'
import { cn } from '@/lib/utils'

export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: "bg-terracotta-50 text-terracotta-700 border-terracotta-200/70",
    secondary: "bg-sand-100 text-charcoal-700 border-sand-300",
    outline: "border-border text-charcoal-700 bg-white",
    dark: "bg-charcoal-900 text-sand-50 border-charcoal-700",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    teal: "bg-teal-50 text-teal-800 border-teal-200",
    spark: "bg-gradient-to-r from-terracotta-50 to-amber-50 text-terracotta-800 border-terracotta-200"
  }

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] rounded-full",
    md: "px-2.5 py-1 text-xs rounded-full",
    lg: "px-3.5 py-1.5 text-sm rounded-full"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border select-none transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === 'success' && "bg-emerald-500",
            variant === 'warning' && "bg-amber-500 animate-pulse",
            variant === 'danger' && "bg-rose-500 animate-pulse",
            variant === 'info' && "bg-sky-500",
            variant === 'default' && "bg-terracotta-500",
            variant === 'secondary' && "bg-charcoal-400"
          )}
        />
      )}
      {children}
    </span>
  )
}
