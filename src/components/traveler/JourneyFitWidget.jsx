import React from 'react'
import { Sparkles, CheckCircle2, TrendingUp, Compass, Wallet, Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const JourneyFitWidget = ({
  metrics,
  tripPreferences,
  totalPlannedActivitiesCost,
  remainingBudget
}) => {
  const {
    overallFit = 92,
    interestAlignment = 94,
    budgetAlignment = 88,
    pacingAlignment = 92,
    diversityScore = 86,
    summary
  } = metrics

  const totalBudget = tripPreferences.budget?.total || 35000
  const activityBudgetEstimate = tripPreferences.budget?.breakdown?.activities || Math.round(totalBudget * 0.18)

  return (
    <Card className="p-6 bg-white border-sand-200/90 shadow-soft-sm space-y-6">
      
      {/* Top Match Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-xs font-semibold border border-terracotta-200">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-600 animate-pulse" />
              <span>Navora Match Analysis</span>
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-charcoal-950">
            Journey Fit Score
          </h3>
          <p className="text-xs text-charcoal-600 max-w-lg">
            {summary}
          </p>
        </div>

        {/* Big Overall % Badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 border border-sand-200/80 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Overall Alignment
            </span>
            <span className="text-3xl font-serif font-bold text-terracotta-600">
              {overallFit}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-xs shadow-soft-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Metric Dimension Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Interest Alignment */}
        <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200/60 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-charcoal-800">Interest Alignment</span>
            <span className="font-serif font-bold text-charcoal-950">{interestAlignment}%</span>
          </div>
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-terracotta-600 h-full transition-all duration-500" style={{ width: `${interestAlignment}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Vibe & category affinity</p>
        </div>

        {/* Budget Fit */}
        <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200/60 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-charcoal-800">Budget Calibration</span>
            <span className="font-serif font-bold text-charcoal-950">{budgetAlignment}%</span>
          </div>
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${budgetAlignment}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Within planned activity buffer</p>
        </div>

        {/* Pacing Harmony */}
        <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200/60 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-charcoal-800">Pacing Harmony</span>
            <span className="font-serif font-bold text-charcoal-950">{pacingAlignment}%</span>
          </div>
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${pacingAlignment}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Rest & activity distribution</p>
        </div>

        {/* Category Diversity */}
        <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200/60 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-charcoal-800">Experience Diversity</span>
            <span className="font-serif font-bold text-charcoal-950">{diversityScore}%</span>
          </div>
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full transition-all duration-500" style={{ width: `${diversityScore}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Variety across days</p>
        </div>

      </div>

      {/* Live Budget Impact Strip */}
      <div className="p-3.5 rounded-xl bg-charcoal-900 text-sand-50 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-terracotta-400 shrink-0" />
          <span className="font-semibold text-white">Estimated Budget Impact:</span>
          <span className="text-charcoal-300">
            Total Trip: <span className="text-white font-bold">{formatCurrency(totalBudget)}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>
            Planned Activities: <span className="text-emerald-400 font-bold">{formatCurrency(totalPlannedActivitiesCost)}</span>
          </span>
          <span className="text-charcoal-600">•</span>
          <span>
            Remaining Buffer: <span className="text-terracotta-400 font-bold">{formatCurrency(remainingBudget)}</span>
          </span>
        </div>
      </div>

    </Card>
  )
}
