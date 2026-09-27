import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Clock, Wallet, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const RecoveryPreviewModal = ({
  open,
  onOpenChange,
  plan,
  currentItinerary,
  onApplyPlan
}) => {
  if (!plan) return null

  const day1Current = currentItinerary?.days?.find(d => d.day === 1) || currentItinerary?.days?.[0]
  const currentItems = day1Current?.items || []
  const proposedItems = plan.modifiedItems || []

  const handleConfirmApply = () => {
    onApplyPlan(plan.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-3xl" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={plan.recommended ? "spark" : "default"} size="sm">
              {plan.badge || "Strategy Preview"}
            </Badge>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Constraint Validated
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-charcoal-950 font-serif">
            Preview Recovery: {plan.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-charcoal-600">
            Compare your baseline timetable against Navora's proposed adapted schedule before applying changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Key Impact Summary Highlights */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-sand-50/70 border border-sand-200 text-xs text-center">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Experiences Preserved
              </span>
              <span className="font-bold text-charcoal-950 text-sm">
                {plan.experiencesPreserved}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Flexibility Buffer
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                {plan.flexibilityImpact}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Cost Delta
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                {plan.costImpact}
              </span>
            </div>
          </div>

          {/* Before vs Proposed Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Column 1: Current / Baseline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-sand-200">
                <span className="font-bold uppercase tracking-wider text-[11px] text-charcoal-700">
                  Current Schedule
                </span>
                <span className="text-[10px] text-rose-700 font-medium">Overlaps Present</span>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {currentItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg border border-sand-200 bg-sand-50/50 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900 line-clamp-1">{item.title}</span>
                      <span className="font-mono text-[11px] text-muted-foreground shrink-0">{item.startTime}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item.location || item.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Proposed Adapted */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
                <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                  Proposed Adapted Schedule
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">✓ Zero Conflict</span>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {proposedItems.map((item, idx) => {
                  const isModified = item.id.includes('fontainhas') || item.title.includes('Adapted') || item.title.includes('Express') || item.startTime !== currentItems[idx]?.startTime
                  return (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-lg border space-y-1 ${
                        isModified
                          ? "bg-emerald-50/60 border-emerald-200 shadow-soft-xs"
                          : "bg-white border-sand-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold line-clamp-1 ${isModified ? "text-emerald-950" : "text-charcoal-900"}`}>
                          {item.title}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-emerald-800 shrink-0">
                          {item.startTime}
                        </span>
                      </div>
                      <p className="text-[10px] text-charcoal-600 line-clamp-1">
                        {item.location || item.type}
                        {item.durationMinutes ? ` • ${Math.floor(item.durationMinutes/60)}h ${item.durationMinutes%60}m` : ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Keep Current Plan
          </Button>
          <Button
            size="sm"
            onClick={handleConfirmApply}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Recovery Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
