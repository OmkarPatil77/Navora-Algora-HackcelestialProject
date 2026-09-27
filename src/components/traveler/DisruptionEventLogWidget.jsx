import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldAlert, GitBranch, Sparkles, CheckCircle2, RotateCcw, Radio } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const DisruptionEventLogWidget = ({ logs = [] }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'DISRUPTION':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
      case 'ANALYSIS':
      case 'GRAPH':
        return <GitBranch className="w-3.5 h-3.5 text-amber-600" />
      case 'RECOVERY':
        return <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
      case 'APPLIED':
      case 'METRICS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      case 'RESET':
        return <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
      default:
        return <Radio className="w-3.5 h-3.5 text-charcoal-500" />
    }
  }

  return (
    <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-sand-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-terracotta-600" />
          <h3 className="font-serif font-bold text-sm text-charcoal-950">
            Navora Operations Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Log Stream
        </span>
      </div>

      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            All operations quiet. Live monitoring active.
          </p>
        ) : (
          logs.slice(0, 10).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="p-2.5 rounded-lg border border-sand-200/80 bg-sand-50/50 flex items-start gap-2.5 text-xs"
            >
              <div className="mt-0.5 shrink-0">
                {getEventIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-charcoal-800 leading-snug font-medium">
                  {log.text}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="font-mono">{log.time}</span>
                  <span>•</span>
                  <span className="uppercase tracking-wider font-semibold">{log.type}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  )
}
