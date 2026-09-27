import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, ShieldCheck, Clock, CheckCircle2, 
  ChevronDown, ChevronUp, Sparkles, Plane, HelpCircle, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const DisruptionImpactBanner = ({
  disruption,
  analysis,
  onOpenRecovery
}) => {
  const [showExplanation, setShowExplanation] = useState(true)

  if (!disruption || !analysis) return null

  const delayMins = disruption.delayMinutes || 90
  const counts = analysis.counts || { conflicts: 1, impacted: 2, protected: 2, flexible: 2 }

  return (
    <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-md space-y-6 overflow-hidden relative">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

      {/* Header with Live Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Simulated Disruption
            </span>
            <span className="text-xs text-muted-foreground">• Inbound Flight Delay</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-950 flex items-center gap-2">
            <span>Flight Delayed by {delayMins} Minutes</span>
          </h2>
          <p className="text-xs text-charcoal-600">
            Mumbai (BOM) → Goa (GOI) shifted from <strong className="text-charcoal-900">{disruption.originalStartTime}</strong> to <strong className="text-rose-700">{disruption.newStartTime}</strong> (Touchdown {disruption.newEndTime}).
          </p>
        </div>

        <Button
          onClick={onOpenRecovery}
          className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs text-xs sm:text-sm self-start sm:self-center"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View 3 Recovery Options
        </Button>
      </div>

      {/* 4 Impact Category Metrics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Conflicts */}
        <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 space-y-1">
          <div className="flex items-center justify-between text-rose-800 font-bold text-xs uppercase tracking-wider">
            <span>Schedule Conflict</span>
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-serif text-rose-950">
            {counts.conflicts} <span className="text-xs font-normal text-rose-700 font-sans">Activity</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-tight">
            Direct time collision with arrival window.
          </p>
        </div>

        {/* Impacted */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
          <div className="flex items-center justify-between text-amber-800 font-bold text-xs uppercase tracking-wider">
            <span>Downstream Shifts</span>
            <span className="h-2 w-2 rounded-full bg-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-950">
            {counts.impacted} <span className="text-xs font-normal text-amber-700 font-sans">Nodes</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Transfers and check-in delayed safely.
          </p>
        </div>

        {/* Protected */}
        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <span>100% Protected</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-950">
            {counts.protected} <span className="text-xs font-normal text-emerald-700 font-sans">Bookings</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-tight">
            Evening dinner & sunset cruise guarded.
          </p>
        </div>

        {/* Flexible */}
        <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 space-y-1">
          <div className="flex items-center justify-between text-sky-800 font-bold text-xs uppercase tracking-wider">
            <span>Flexible Buffer</span>
            <Clock className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-sky-950">
            {counts.flexible} <span className="text-xs font-normal text-sky-700 font-sans">Blocks</span>
          </div>
          <p className="text-[11px] text-sky-800 leading-tight">
            Absorbs schedule slack with zero loss.
          </p>
        </div>
      </div>

      {/* Causal Chain Explanation Accordion ("Why is this affected?") */}
      <div className="rounded-xl border border-sand-200 bg-sand-50/50 p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-terracotta-600" />
            <span className="font-serif font-bold text-sm text-charcoal-900">
              Why is this affected? Schedule Timeline Impact
            </span>
          </div>
          <div className="text-xs font-medium text-terracotta-700 flex items-center gap-1 group-hover:underline">
            <span>{showExplanation ? "Hide Details" : "Show Details"}</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pt-2 border-t border-sand-200/80 text-xs text-charcoal-700 leading-relaxed"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-sand-200 space-y-1">
                  <div className="font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    1. Airport Transfer Shift
                  </div>
                  <p className="text-[11px] text-charcoal-600">
                    Your private cab pickup depends strictly on flight touchdown. Delayed from <strong>10:45</strong> to <strong>12:15</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-sand-200 space-y-1">
                  <div className="font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    2. Hotel Check-In Window
                  </div>
                  <p className="text-[11px] text-charcoal-600">
                    The 90-minute delay pushes your resort check-in to <strong>13:15</strong>, directly encroaching on the original afternoon activity slot.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-rose-200 bg-rose-50/40 space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    3. Scuba Dive Conflict
                  </div>
                  <p className="text-[11px] text-rose-800">
                    Grand Island Scuba requires a 4.5-hour daylight commitment. Starting after 13:30 leaves insufficient daylight and creates a conflict.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2 text-emerald-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Safe Boundaries:</strong> Your Mandovi River Sunset Cruise & dinner reservations at 19:30 remain completely guarded.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
