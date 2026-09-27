import React from 'react'
import { AlertTriangle, CheckCircle2, Info, Clock, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export const StatusIndicator = ({
  status = 'active', // active, warning, disruption, success, pending, adapting
  label,
  showIcon = true,
  pulse = false,
  className
}) => {
  const config = {
    active: {
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
      defaultLabel: "On Track"
    },
    warning: {
      color: "text-amber-800 bg-amber-50 border-amber-200",
      dot: "bg-amber-500",
      icon: AlertTriangle,
      defaultLabel: "Watch Alert"
    },
    disruption: {
      color: "text-rose-800 bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
      icon: AlertTriangle,
      defaultLabel: "Disruption Detected"
    },
    adapting: {
      color: "text-terracotta-800 bg-terracotta-50 border-terracotta-200",
      dot: "bg-terracotta-500",
      icon: RefreshCw,
      defaultLabel: "AI Adapting"
    },
    pending: {
      color: "text-charcoal-700 bg-sand-100 border-sand-300",
      dot: "bg-charcoal-400",
      icon: Clock,
      defaultLabel: "Scheduled"
    },
    info: {
      color: "text-sky-800 bg-sky-50 border-sky-200",
      dot: "bg-sky-500",
      icon: Info,
      defaultLabel: "Info"
    }
  }

  const current = config[status] || config.active
  const Icon = current.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none",
        current.color,
        className
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {(pulse || status === 'disruption' || status === 'adapting') && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", current.dot)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", current.dot)} />
      </span>

      {showIcon && <Icon className={cn("w-3.5 h-3.5", status === 'adapting' && "animate-spin")} />}
      <span>{label || current.defaultLabel}</span>
    </div>
  )
}
