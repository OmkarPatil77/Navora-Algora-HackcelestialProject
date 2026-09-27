import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowRight, ShieldCheck, Clock, Wallet, Car, Hotel, Utensils, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const ImpactAnalysisModal = ({
  isOpen,
  onClose,
  originalActivity = "Water Sports & Jet Ski Safari",
  selectedAlternative,
  currentTripCost = 29450,
  onApplyChange
}) => {
  if (!isOpen || !selectedAlternative) return null

  const costDifference = selectedAlternative.priceDiff || 0
  const newTripCost = currentTripCost + costDifference
  const newPreferenceMatch = selectedAlternative.preferenceMatch || 94

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-soft-xl border border-sand-200 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div>
            <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
              Platform Orchestration Engine
            </span>
            <h3 className="font-serif font-bold text-xl text-charcoal-950">
              IMPACT ANALYSIS
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Replacing <span className="font-semibold text-charcoal-900">{originalActivity}</span> with <span className="font-semibold text-terracotta-700">{selectedAlternative.title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Pipeline Diagram */}
        <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-[10px] text-charcoal-600 flex items-center justify-between font-mono">
          <span>Change</span>
          <span>→</span>
          <span className="font-bold text-terracotta-700">Impact Analysis</span>
          <span>→</span>
          <span>Constraint Check</span>
          <span>→</span>
          <span>Repricing</span>
          <span>→</span>
          <span>Live Sync</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          
          {/* Time Impact */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Clock className="w-3 h-3 text-charcoal-600" />
              <span>Time Impact</span>
            </div>
            <div className="text-base font-serif font-bold text-charcoal-950">
              +10 minutes
            </div>
            <p className="text-[10px] text-muted-foreground">Fits smoothly in 2:00 PM slot</p>
          </div>

          {/* Cost Impact */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Wallet className="w-3 h-3 text-charcoal-600" />
              <span>Cost Impact</span>
            </div>
            <div className="text-base font-serif font-bold text-charcoal-950">
              {costDifference === 0 ? "₹0 (Same Price)" : `+${formatCurrency(costDifference)}`}
            </div>
            <p className="text-[10px] text-muted-foreground">Within existing budget buffer</p>
          </div>

          {/* Transportation */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Car className="w-3 h-3 text-charcoal-600" />
              <span>Transportation</span>
            </div>
            <div className="text-base font-serif font-bold text-emerald-700">
              Updated ✓
            </div>
            <p className="text-[10px] text-muted-foreground">Cab pickup routed to jetty</p>
          </div>

          {/* Dinner Conflict */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Utensils className="w-3 h-3 text-charcoal-600" />
              <span>Dinner Schedule</span>
            </div>
            <div className="text-base font-serif font-bold text-emerald-700">
              No conflict ✓
            </div>
            <p className="text-[10px] text-muted-foreground">1h 15m relaxation before dinner</p>
          </div>

          {/* Hotel Impact */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Hotel className="w-3 h-3 text-charcoal-600" />
              <span>Hotel Logistics</span>
            </div>
            <div className="text-base font-serif font-bold text-emerald-700">
              No impact ✓
            </div>
            <p className="text-[10px] text-muted-foreground">Check-in and stay unchanged</p>
          </div>

          {/* Preference Match */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-500 text-[10px] uppercase font-bold">
              <Sparkles className="w-3 h-3 text-charcoal-600" />
              <span>Preference Match</span>
            </div>
            <div className="text-base font-serif font-bold text-emerald-700">
              {newPreferenceMatch}%
            </div>
            <p className="text-[10px] text-muted-foreground">High adventure compatibility</p>
          </div>

        </div>

        {/* Repricing Summary Card */}
        <div className="p-4 rounded-xl bg-charcoal-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-sand-300 uppercase tracking-wider block">
              New Trip Cost Calculation
            </span>
            <span className="text-xs text-charcoal-300">
              {formatCurrency(currentTripCost)} + {formatCurrency(costDifference)} =
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-sand-100">
              {formatCurrency(newTripCost)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="border-sand-300 text-charcoal-700"
          >
            Cancel
          </Button>

          <Button
            size="md"
            onClick={() => onApplyChange(selectedAlternative, newTripCost)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft-sm font-semibold"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Change
          </Button>
        </div>

      </motion.div>
    </div>
  )
}
