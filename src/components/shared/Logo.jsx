import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const Logo = ({ className, showTagline = false, isDark = false, to = "/" }) => {
  return (
    <Link to={to} className={cn("group flex items-center gap-2.5 select-none", className)}>
      {/* Brand Icon: Abstract Travel Path + AI Spark */}
      <div className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 shadow-soft-xs",
        isDark ? "bg-charcoal-800 border border-charcoal-700 text-white" : "bg-charcoal-900 border border-charcoal-800 text-white"
      )}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Path */}
          <path
            d="M5 18C8 18 10 14 12 11C14 8 16 7 19 7"
            stroke="#E05A47"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Origin dot */}
          <circle cx="5" cy="18" r="1.7" fill="#E05A47" />
          {/* Spark at destination */}
          <path
            d="M18 4L18.8 6.2L21 7L18.8 7.8L18 10L17.2 7.8L15 7L17.2 6.2L18 4Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={cn(
            "text-lg font-bold tracking-tight font-sans transition-colors",
            isDark ? "text-white" : "text-charcoal-900 group-hover:text-charcoal-950"
          )}>
            Nav<span className="text-terracotta-600">ora</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Plan • Personalize • Adapt
          </span>
        )}
      </div>
    </Link>
  )
}
