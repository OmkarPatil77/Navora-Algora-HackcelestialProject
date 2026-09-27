import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, 
  Sparkles, Activity, Clock, Wallet, Compass, HelpCircle 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useTripPlan } from '@/context/TripPlanningContext'

export const JourneyHealthCard = ({ health: propHealth, onExplain }) => {
  const context = useTripPlan()
  const health = propHealth || context?.journeyHealth

  if (!health) return null

  const { score, status, statusMeta, dimensions, risks, strengths, summary } = health

  const isDisrupted = status === 'Watch Alert' || status === 'Disrupted' || status === 'At Risk'

  return (
    <Card className={`p-5 sm:p-6 bg-white border transition-all relative overflow-hidden ${
      isDisrupted 
        ? "border-amber-300 ring-1 ring-amber-300/40 shadow-soft-md"
        : "border-sand-200 shadow-soft-sm"
    }`}>
      {/* Top Health Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-terracotta-600" />
              Journey Health
            </span>
            <span className="text-xs text-muted-foreground">• Live Schedule Diagnostics</span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950">
            Journey Health & Status
          </h3>
        </div>

        {/* Score & Badge Display */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-950">
              {score}
            </span>
            <span className="text-xs font-semibold text-muted-foreground font-mono">/ 100</span>
          </motion.div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusMeta?.color || "text-emerald-700 bg-emerald-50 border-emerald-200"}`}>
            <span className={`w-2 h-2 rounded-full ${statusMeta?.dot || "bg-emerald-500"} ${isDisrupted ? "animate-pulse" : ""}`} />
            <span>{status}</span>
          </span>
        </div>
      </div>

      {/* Summary Narrative */}
      <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed pt-1">
        {summary}
      </p>

      {/* 5 Multidimensional Health Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {Object.entries(dimensions || {}).map(([key, dim], idx) => {
          const dimScore = dim.score
          const isWarning = dimScore < 75

          return (
            <div
              key={key}
              className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-charcoal-800 truncate">{dim.name}</span>
                <span className={`font-mono font-bold ${isWarning ? "text-amber-700" : "text-emerald-700"}`}>
                  {dimScore}%
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full h-1.5 bg-sand-200 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dimScore}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`h-full rounded-full ${
                    dimScore >= 85 ? "bg-emerald-500" :
                    dimScore >= 70 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                />
              </div>

              <span className="text-[10px] text-muted-foreground font-mono block text-right">
                Weight {dim.weight}
              </span>
            </div>
          )
        })}
      </div>

      {/* Strengths & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
        {strengths?.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Journey Strengths
            </span>
            <ul className="space-y-1 text-[11px] text-emerald-950">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {risks?.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Active Attention Points
            </span>
            <ul className="space-y-1 text-[11px] text-amber-950">
              {risks.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Explainability Action Trigger */}
      {onExplain && (
        <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-muted-foreground">
            Transparency Engine • Computed directly from your real trip plan
          </span>
          <button
            type="button"
            onClick={onExplain}
            className="text-terracotta-700 hover:text-terracotta-800 font-semibold text-xs flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why this score?</span>
          </button>
        </div>
      )}
    </Card>
  )
}

export default JourneyHealthCard
