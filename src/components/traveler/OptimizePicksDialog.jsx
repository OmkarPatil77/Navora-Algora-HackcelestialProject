import React from 'react'
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  RefreshCw, Check, Layers, Compass, ShieldCheck 
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const OptimizePicksDialog = ({
  isOpen,
  onClose,
  optimizationResults,
  onApplySwap
}) => {
  if (!optimizationResults) return null

  const { status, suggestions = [], message } = optimizationResults

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent maxWidth="max-w-xl" onClose={onClose}>
        
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Navora Schedule Optimizer</span>
            </span>
          </div>
          <DialogTitle>Deterministic Pick Optimization</DialogTitle>
          <DialogDescription>
            We evaluated your selected activities against trip pacing, category diversity, and rest intervals.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {status === "insufficient_picks" && (
            <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-200 text-center text-xs text-charcoal-700 space-y-2">
              <Layers className="w-6 h-6 text-charcoal-500 mx-auto" />
              <p className="font-semibold text-charcoal-900">{message}</p>
              <p className="text-muted-foreground">Select a few activities first to enable smart schedule balancing.</p>
            </div>
          )}

          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-3 text-xs ${
                sug.severity === 'success'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sug.severity === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="font-serif font-bold text-sm">{sug.title}</span>
                </div>
                <Badge variant={sug.severity === 'success' ? 'success' : 'warning'} size="sm">
                  {sug.severity === 'success' ? 'Optimized' : 'Opportunity'}
                </Badge>
              </div>

              <p className="leading-relaxed">{sug.insight}</p>

              {/* Suggested Swap Card Comparison */}
              {sug.currentExperience && sug.suggestedReplacement && (
                <div className="pt-2 border-t border-amber-200/80 space-y-2">
                  <span className="font-semibold block text-[11px] uppercase tracking-wider text-amber-900">
                    {sug.actionDescription}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Current item to replace */}
                    <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200 space-y-1">
                      <span className="text-[10px] text-rose-700 font-bold uppercase block">Current Activity</span>
                      <p className="font-serif font-bold text-charcoal-900">{sug.currentExperience.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {sug.currentExperience.category} • {sug.currentExperience.durationHours}h
                      </p>
                    </div>

                    {/* Replacement Candidate */}
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Suggested Swap</span>
                      <p className="font-serif font-bold text-charcoal-900">{sug.suggestedReplacement.title}</p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        {sug.suggestedReplacement.category} • {sug.suggestedReplacement.durationHours}h ({sug.suggestedReplacement.matchScore}% Match)
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        onApplySwap(sug.currentExperience.id, sug.suggestedReplacement)
                        onClose()
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-soft-xs"
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      Apply Suggested Replacement
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
