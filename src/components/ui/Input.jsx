import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-muted-foreground/70 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
})
Input.displayName = "Input"

export const Textarea = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border border-input bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-muted-foreground/70 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
})
Textarea.displayName = "Textarea"
