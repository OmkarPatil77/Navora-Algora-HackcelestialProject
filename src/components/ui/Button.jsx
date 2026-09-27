import React from 'react'
import { cn } from '@/lib/utils'

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none"
  
  const variants = {
    default: "bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-sm hover:shadow-soft-sm",
    secondary: "bg-charcoal-900 text-white hover:bg-charcoal-800 shadow-sm",
    outline: "border border-sand-300 bg-white/80 hover:bg-sand-50 text-charcoal-800 hover:border-sand-400",
    ghost: "text-charcoal-700 hover:bg-sand-100 hover:text-charcoal-900",
    subtle: "bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100 border border-terracotta-200/60",
    dark: "bg-charcoal-950 text-sand-50 hover:bg-charcoal-900 border border-charcoal-800",
    destructive: "bg-rose-600 text-white hover:bg-rose-700"
  }

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-10 px-4 text-sm rounded-lg gap-2",
    lg: "h-12 px-6 text-base rounded-xl gap-2.5",
    icon: "h-10 w-10 rounded-lg p-0"
  }

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      
      {children}

      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  )
})

Button.displayName = "Button"
