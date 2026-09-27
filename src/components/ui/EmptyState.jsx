import React from 'react'
import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export const EmptyState = ({
  icon: Icon = Compass,
  title = "No experiences found",
  description = "Try adjusting your travel preferences or budget filters.",
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-sand-300 bg-sand-50/50", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-200/70 text-charcoal-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-charcoal-900 mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5">{description}</p>
      {actionLabel && (
        <Button size="sm" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
