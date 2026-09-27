import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, CheckCircle2, ShieldCheck, Clock, 
  Wallet, ArrowRight, Check, AlertCircle 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const RecoveryPlanCard = ({
  plan,
  isApplied = false,
  onPreview,
  onApply
}) => {
  if (!plan) return null

  const isRecommended = plan.recommended || plan.id === 'PLAN-B-BALANCED'

  return (
    <Card 
      className={`p-5 sm:p-6 bg-white border transition-all relative flex flex-col justify-between ${
        isApplied
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-soft-md"
          : isRecommended
          ? "border-terracotta-400 ring-2 ring-terracotta-500/15 shadow-soft-md"
          : "border-sand-200 shadow-soft-xs hover:border-sand-300"
      }`}
    >
      {/* Top badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge 
            variant={isApplied ? "success" : isRecommended ? "default" : "outline"} 
            size="sm"
          >
            {isApplied ? "✓ Active / Applied" : plan.badge || "Strategy"}
          </Badge>

          {plan.validation?.valid && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Valid
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold font-serif text-charcoal-950">
            {plan.title}
          </h3>
          <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* 4 Core Value Metric Tags */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-sand-50/70 border border-sand-200/80 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Experiences
            </span>
            <span className="font-bold text-charcoal-900">
              {plan.experiencesPreserved}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-sand-50/70 border border-sand-200/80 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Flexibility
            </span>
            <span className={`font-bold ${plan.flexibilityDelta >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
              {plan.flexibilityImpact}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-sand-50/70 border border-sand-200/80 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Budget Impact
            </span>
            <span className={`font-bold ${plan.costDelta < 0 ? "text-emerald-700" : "text-charcoal-900"}`}>
              {plan.costImpact}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-sand-50/70 border border-sand-200/80 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Pace / Intensity
            </span>
            <span className="font-bold text-charcoal-900">
              {plan.intensity}
            </span>
          </div>
        </div>

        {/* Changes Bullet List */}
        <div className="space-y-1.5 pt-2 border-t border-sand-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Plan Adjustments:
          </span>
          {plan.changes?.map((c, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-charcoal-700">
              <span className="text-terracotta-600 font-bold text-xs mt-0.5">•</span>
              <span className="leading-snug">{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-5 mt-4 border-t border-sand-100 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(plan)}
          className="flex-1 text-xs"
        >
          Preview Changes
        </Button>

        {isApplied ? (
          <Button
            size="sm"
            disabled
            className="flex-1 bg-emerald-600 text-white text-xs cursor-default"
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Applied
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onApply(plan.id)}
            className={`flex-1 text-xs ${
              isRecommended
                ? "bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs"
                : "bg-charcoal-900 hover:bg-charcoal-800 text-white"
            }`}
          >
            Apply Option
          </Button>
        )}
      </div>
    </Card>
  )
}
