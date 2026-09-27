import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Check, Eye, Clock, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const OperatorRecoveryPanel = ({
  activeDisruption,
  recoveryPlans = [],
  appliedRecovery,
  onPreviewPlan,
  onApplyPlan
}) => {
  if (!activeDisruption) {
    return (
      <Card id="operator-recovery-section" className="p-6 bg-white border-sand-200 shadow-soft-sm text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="font-serif font-bold text-base text-charcoal-950">
          No Active Recovery Required
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          All tour schedules, transits, and vendor allocations are on track with zero detected schedule conflicts.
        </p>
      </Card>
    )
  }

  const recommendedPlan = recoveryPlans.find(p => p.id === 'PLAN-B-BALANCED') || recoveryPlans[0]

  return (
    <Card id="operator-recovery-section" className="p-5 sm:p-6 bg-white border-terracotta-200 ring-1 ring-terracotta-500/15 shadow-soft-md space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-100">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="spark" size="sm">Autonomous AI Constraint Solver</Badge>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700">
              Navora Operations Recommendation
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-0.5">
            {appliedRecovery ? `Applied Solution: ${appliedRecovery.title}` : `Recommended Action: ${recommendedPlan?.title || 'Balanced Recovery'}`}
          </h3>
        </div>

        <Badge variant={appliedRecovery ? "success" : "default"} size="sm">
          {appliedRecovery ? "✓ Applied & Synchronized" : "Ready to Apply"}
        </Badge>
      </div>

      {/* Main Strategy Details */}
      {recommendedPlan && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {recommendedPlan.description}
          </p>

          {/* 4 Outcome Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                Experiences Preserved
              </span>
              <span className="font-bold text-charcoal-950 text-sm">
                {recommendedPlan.experiencesPreserved}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                Estimated Savings
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                {recommendedPlan.costImpact}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                Flexibility Gained
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                {recommendedPlan.flexibilityImpact}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                Conflicts Remaining
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                0 (Zero Conflicts)
              </span>
            </div>
          </div>

          {/* Operational Changes */}
          <div className="p-3.5 rounded-xl bg-sand-50/50 border border-sand-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Automated Schedule & Vendor Adjustments:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
              {recommendedPlan.changes?.map((change, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-terracotta-600 font-bold text-xs mt-0.5">•</span>
                  <span className="leading-snug">{change.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreviewPlan(recommendedPlan)}
                className="text-xs"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Preview Schedule Comparison
              </Button>
            </div>

            {appliedRecovery ? (
              <Button
                size="sm"
                disabled
                className="bg-emerald-600 text-white text-xs cursor-default"
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                ✓ Recovery Applied & Synced with Traveler
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onApplyPlan(recommendedPlan.id)}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Apply Balanced Recovery to Tour GOA-2048
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
