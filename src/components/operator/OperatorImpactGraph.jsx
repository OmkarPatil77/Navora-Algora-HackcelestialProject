import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, Car, Hotel, Compass, Utensils, 
  ArrowRight, ShieldCheck, AlertOctagon, AlertTriangle, CheckCircle2 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const OperatorImpactGraph = ({ disruption, analysis, appliedRecovery }) => {
  const delayMinutes = disruption?.delayMinutes || 90

  const nodes = [
    {
      id: "node-flight",
      title: "Flight BOM → GOI",
      type: "DIRECT_IMPACT",
      timeOrig: "09:20",
      timeNew: "10:50",
      statusText: `+${delayMinutes}m Flight Delay`,
      icon: Plane,
      color: "bg-rose-50 border-rose-400 text-rose-950",
      badgeVariant: "danger",
      description: "Air traffic departure delay; touchdown pushed to 12:05."
    },
    {
      id: "node-transfer",
      title: "Airport Transfer Cab",
      type: "DOWNSTREAM",
      timeOrig: "10:55",
      timeNew: "12:15",
      statusText: "Downstream Shift",
      icon: Car,
      color: "bg-amber-50 border-amber-400 text-amber-950",
      badgeVariant: "warning",
      description: "Depends on gate exit. Driver Rajesh Naik held at Gate 2."
    },
    {
      id: "node-checkin",
      title: "Casa Sol Villa Check-in",
      type: "DOWNSTREAM",
      timeOrig: "12:00",
      timeNew: "13:15",
      statusText: "Downstream Shift",
      icon: Hotel,
      color: "bg-amber-50 border-amber-400 text-amber-950",
      badgeVariant: "warning",
      description: "Check-in window adjusted. Welcome drinks held."
    },
    {
      id: "node-experience",
      title: appliedRecovery ? "Fontainhas Heritage Walk" : "Grand Island Scuba",
      type: appliedRecovery ? "ADAPTED" : "CONFLICT",
      timeOrig: "12:30",
      timeNew: appliedRecovery ? "16:00" : "Overlap",
      statusText: appliedRecovery ? "Adapted Slot" : "Schedule Conflict",
      icon: Compass,
      color: appliedRecovery ? "bg-emerald-50 border-emerald-400 text-emerald-950" : "bg-rose-100/80 border-rose-500 text-rose-950",
      badgeVariant: appliedRecovery ? "success" : "danger",
      description: appliedRecovery 
        ? "Replaced with gentle 2.5h cultural walk (₹1,200 saved)." 
        : "4.5h daylight dive directly conflicts with 12:05 arrival + transit."
    },
    {
      id: "node-dinner",
      title: "Sunset Cruise & Dinner",
      type: "PROTECTED",
      timeOrig: "18:45",
      timeNew: "18:45",
      statusText: "Guarded Booking",
      icon: Utensils,
      color: "bg-emerald-50 border-emerald-400 text-emerald-950",
      badgeVariant: "success",
      description: "Mandovi Catamaran & Fisherman's Wharf 100% safeguarded."
    }
  ]

  return (
    <Card id="operator-impact-section" className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Live Dependency Traversal
            </span>
            <Badge variant="spark" size="sm">Causal Propagation Graph</Badge>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-0.5">
            Disruption Impact & Dependency Chain
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-rose-800 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" /> Direct / Conflict
          </span>
          <span className="flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> Downstream Shift
          </span>
          <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> 100% Protected
          </span>
        </div>
      </div>

      {/* Horizontal Flow Graph */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {nodes.map((node, idx) => {
          const Icon = node.icon
          const isLast = idx === nodes.length - 1

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.08 }}
              className={`p-3.5 rounded-xl border relative flex flex-col justify-between space-y-2.5 transition-all shadow-soft-xs ${node.color}`}
            >
              {/* Top Node Type Badge */}
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-white/80 border border-sand-200/60 shadow-xs">
                  <Icon className="w-4 h-4 text-charcoal-800" />
                </div>
                <Badge variant={node.badgeVariant} size="sm">
                  {node.statusText}
                </Badge>
              </div>

              {/* Title & Timing */}
              <div>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal-950 line-clamp-1">
                  {node.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] font-mono mt-0.5">
                  <span className="line-through text-muted-foreground">{node.timeOrig}</span>
                  <ArrowRight className="w-3 h-3 text-charcoal-400" />
                  <span className="font-bold text-charcoal-900">{node.timeNew}</span>
                </div>
              </div>

              {/* Causal Note */}
              <p className="text-[11px] text-charcoal-700 leading-tight">
                {node.description}
              </p>

              {/* Step indicator */}
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground pt-1 border-t border-black/5">
                Node 0{idx + 1}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
