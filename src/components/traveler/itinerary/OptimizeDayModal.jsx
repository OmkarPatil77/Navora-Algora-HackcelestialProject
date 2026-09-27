import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check, Clock, TrendingUp, Navigation, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const OptimizeDayModal = ({
  isOpen,
  onClose,
  dayNumber = 2,
  onApplyOptimization
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 shadow-soft-xl border border-sand-200 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-terracotta-600 flex items-center justify-center text-white shadow-soft-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                Algorithmic Route & Flow Rebalancer
              </span>
              <h3 className="font-serif font-bold text-xl text-charcoal-950">
                Optimization Found for Day {dayNumber}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative / Problem Statement */}
        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs text-charcoal-700 leading-relaxed">
          <p>
            Your current Day {dayNumber} schedule has <strong className="text-charcoal-950">7 activities</strong> with <strong className="text-charcoal-950">1h 42m total travel time</strong> due to back-and-forth coastal transit. Navora analyzed the sequence against traffic patterns, sun orientation, and venue opening windows to reorder the stops.
          </p>
        </div>

        {/* Comparison Before / After */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Plan */}
          <div className="p-4 rounded-xl border border-sand-200 bg-white space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Current Plan
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-charcoal-900">7 activities</div>
              <div className="text-sm font-semibold text-charcoal-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                <span>1h 42m travel time</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground pt-1">
              Sub-optimal zig-zag route between North & South coves.
            </p>
          </div>

          {/* Optimized Plan */}
          <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Optimized Itinerary
              </span>
              <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                Recommended
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-emerald-950">6 clustered activities</div>
              <div className="text-sm font-bold text-emerald-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>1h 04m travel time</span>
              </div>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold pt-1">
              Saved: 38 minutes in traffic!
            </p>
          </div>
        </div>

        {/* Constraint Checklist */}
        <div className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">
            Constraint Validation
          </span>
          <div className="grid grid-cols-2 gap-2 text-charcoal-800 font-medium">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No booking conflicts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No additional cost</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Preserves sunset viewpoint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Maintains dinner reservation</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="border-sand-300 text-charcoal-700"
          >
            Keep Current Plan
          </Button>

          <Button
            size="md"
            onClick={() => onApplyOptimization(dayNumber)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft-sm font-semibold"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Apply Optimization
          </Button>
        </div>

      </motion.div>
    </div>
  )
}
