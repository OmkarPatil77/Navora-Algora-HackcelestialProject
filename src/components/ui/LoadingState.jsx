import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-sand-200/70", className)}
      {...props}
    />
  )
}

export const LoadingState = ({
  message = "Building your plan…",
  subtext = "Arranging timing, travel pace, and experiences",
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-50 border border-terracotta-200/60 shadow-soft-xs text-terracotta-600">
        <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: '4s' }} />
      </div>
      <h3 className="text-base font-semibold text-charcoal-900 mb-1">{message}</h3>
      <p className="text-xs text-muted-foreground max-w-sm">{subtext}</p>
    </div>
  )
}
