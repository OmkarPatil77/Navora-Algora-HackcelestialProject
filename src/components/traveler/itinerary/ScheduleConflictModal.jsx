import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, ArrowRight, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const ScheduleConflictModal = ({
  isOpen,
  onClose,
  activityTitle = "Baga Beach Sunset Exploration",
  requestedTime = "5:00 PM",
  conflictingActivity = "Dinner at Fisherman's Wharf — 5:30 PM",
  onResolveMoveDownstream,
  onResolveAdjustTime
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft-xl border border-sand-200 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-950">
                ⚠ Schedule Conflict
              </h3>
              <p className="text-xs text-muted-foreground">Overlap Detected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-charcoal-800 space-y-2">
          <p>
            Moving <strong className="text-charcoal-950">{activityTitle}</strong> to <strong className="text-amber-900">{requestedTime}</strong> will overlap with:
          </p>
          <div className="p-2.5 bg-white rounded-lg border border-amber-200 font-serif font-bold text-charcoal-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{conflictingActivity}</span>
          </div>
        </div>

        {/* Suggested Alternatives */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700 block">
            Suggested alternatives:
          </span>

          {/* Option 1: Move Dinner downstream */}
          <button
            type="button"
            onClick={onResolveMoveDownstream}
            className="w-full p-3 text-left rounded-xl bg-sand-50 hover:bg-white border border-sand-200 hover:border-terracotta-400 hover:shadow-soft-xs transition-all flex items-center justify-between group text-xs"
          >
            <div>
              <span className="font-semibold text-charcoal-900 block">
                {requestedTime} → Move Dinner to 7:30 PM
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Auto-reschedule downstream reservations
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-terracotta-600 transition-colors shrink-0 ml-2" />
          </button>

          {/* Option 2: Keep Dinner unchanged */}
          <button
            type="button"
            onClick={onResolveAdjustTime}
            className="w-full p-3 text-left rounded-xl bg-sand-50 hover:bg-white border border-sand-200 hover:border-charcoal-400 hover:shadow-soft-xs transition-all flex items-center justify-between group text-xs"
          >
            <div>
              <span className="font-semibold text-charcoal-900 block">
                4:00 PM → Keep Dinner unchanged
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Shifts activity 30 min earlier with 1h buffer
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-charcoal-900 transition-colors shrink-0 ml-2" />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="border-sand-300">
            Cancel
          </Button>
        </div>

      </motion.div>
    </div>
  )
}
