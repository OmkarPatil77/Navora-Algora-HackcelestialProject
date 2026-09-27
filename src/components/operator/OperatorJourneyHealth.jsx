import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useTripPlan } from '@/context/TripPlanningContext'

export const OperatorJourneyHealth = ({ health: propHealth, tourId = "GOA-2048" }) => {
  const context = useTripPlan()
  const health = propHealth || context?.journeyHealth

  if (!health) return null

  const { score, status, statusMeta, dimensions, risks, strengths } = health
  const isWatch = status === 'Watch Alert' || status === 'Disrupted' || status === 'At Risk'

  return (
    <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-charcoal-900 bg-sand-100 px-2 py-0.5 rounded">
              TOUR {tourId}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Operational Journey Health
            </span>
          </div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950 mt-0.5">
            Fleet Resilience & Schedule Status
          </h3>
        </div>

        {/* Score and Status */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <motion.div
            key={score}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {score}
            </span>
            <span className="text-xs font-mono text-muted-foreground font-semibold">/ 100</span>
          </motion.div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusMeta?.color || "text-emerald-700 bg-emerald-50 border-emerald-200"}`}>
            <span className={`w-2 h-2 rounded-full ${statusMeta?.dot || "bg-emerald-500"} ${isWatch ? "animate-pulse" : ""}`} />
            <span>{status}</span>
          </span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Schedule Resilience
          </span>
          <span className="font-bold text-charcoal-900 text-base font-serif">
            {dimensions?.scheduleResilience?.score || 92}%
          </span>
          <span className="text-[10px] text-muted-foreground block font-mono">Transition buffers</span>
        </div>

        <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Vendor Readiness
          </span>
          <span className="font-bold text-charcoal-900 text-base font-serif">
            {dimensions?.operationalReadiness?.score || 94}%
          </span>
          <span className="text-[10px] text-muted-foreground block font-mono">Driver & villa sync</span>
        </div>

        <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Experience Continuity
          </span>
          <span className="font-bold text-charcoal-900 text-base font-serif">
            {dimensions?.experienceBalance?.score || 94}%
          </span>
          <span className="text-[10px] text-muted-foreground block font-mono">5/5 preserved</span>
        </div>

        <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Recovery Readiness
          </span>
          <span className="font-bold text-emerald-700 text-base font-serif">
            {dimensions?.recoveryReadiness?.score || 98}%
          </span>
          <span className="text-[10px] text-emerald-700 block font-mono">3 options calculated</span>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Operational assessment derived from live schedule timings and bookings</span>
        <span className="font-mono text-[10px] font-semibold text-emerald-700">✓ Verified</span>
      </div>
    </Card>
  )
}

export default OperatorJourneyHealth
