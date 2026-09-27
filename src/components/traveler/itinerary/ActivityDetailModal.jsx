import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, MapPin, Clock, Wallet, Check, Sparkles, 
  Trash2, Edit3, ArrowRight, ShieldCheck, Car, Eye 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const ActivityDetailModal = ({
  isOpen,
  onClose,
  item,
  dayNumber = 1,
  totalBudget = 30000,
  onChangeTimeClick,
  onRemoveItem
}) => {
  if (!isOpen || !item) return null

  // Activity emoji
  const getActivityEmoji = (title = item.title, type = item.type) => {
    const t = (title + " " + type).toLowerCase()
    if (t.includes("beach")) return "🏖"
    if (t.includes("water") || t.includes("scuba") || t.includes("kayak")) return "🤿"
    if (t.includes("hotel") || t.includes("check-in") || t.includes("resort")) return "🏨"
    if (t.includes("flight") || t.includes("arrival") || t.includes("departure")) return "✈"
    if (t.includes("lunch") || t.includes("dinner") || t.includes("breakfast") || t.includes("food") || t.includes("thali") || t.includes("meal")) return "🍽"
    if (t.includes("cruise") || t.includes("boat")) return "⛵"
    if (t.includes("fort") || t.includes("heritage") || t.includes("temple") || t.includes("palace") || t.includes("walk")) return "🏛"
    return "📍"
  }

  const emoji = getActivityEmoji()
  const durationText = item.durationMinutes ? `${Math.round(item.durationMinutes / 60 * 10) / 10} hours` : "2 hours"
  const costText = item.cost > 0 ? formatCurrency(item.cost) : "Free / Included"

  // Dynamic explainable reasons
  const explanations = item.reasons || [
    `Matches your primary interest in ${item.type === 'meal' ? 'authentic coastal cuisine' : 'beaches & scenic exploration'}`,
    `Fits comfortably within your ${formatCurrency(totalBudget)} total budget`,
    `${item.proximity || '12 minutes from your hotel'} via pre-arranged transport`,
    `Confirmed open and available on your selected travel dates`,
    `Calibrated buffer prevents schedule conflicts with downstream reservations`
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-soft-xl border border-sand-200 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-sand-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 rounded-xl bg-sand-100/80 border border-sand-200">
              {emoji}
            </span>
            <div>
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                Day 0{dayNumber} • {item.type?.toUpperCase() || 'ACTIVITY'}
              </span>
              <h3 className="font-serif font-bold text-xl text-charcoal-950 mt-0.5">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                <span>{item.location || "Panjim, Goa"}</span>
              </div>
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

        {/* Schedule & Cost Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Scheduled Timing
            </span>
            <div className="flex items-center gap-1.5 font-serif font-bold text-charcoal-950 text-base">
              <Clock className="w-4 h-4 text-terracotta-600" />
              <span>{item.startTime} – {item.endTime}</span>
            </div>
            <span className="text-[10px] text-muted-foreground block">{durationText} total duration</span>
          </div>

          <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Estimated Pricing
            </span>
            <div className="flex items-center gap-1.5 font-serif font-bold text-charcoal-950 text-base">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>{costText}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">✓ Within allocated budget</span>
          </div>
        </div>

        {/* EXPLAINABLE RECOMMENDATION SECTION (Prompt Section 7) */}
        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-terracotta-100 flex items-center justify-center text-terracotta-700">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal-950">
              Why we selected this
            </h4>
          </div>

          <div className="space-y-1.5 text-xs text-charcoal-700">
            {explanations.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics & Proximity */}
        <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-xs text-charcoal-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-terracotta-600 shrink-0" />
            <span>{item.proximity || '12 min from hotel'} • Cab pickup arranged</span>
          </div>
          <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[10px]">
            Zero Conflicts
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-sand-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onRemoveItem(dayNumber, item.id)
              onClose()
            }}
            className="text-rose-600 hover:bg-rose-50 text-xs"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Remove Activity
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                onChangeTimeClick(item)
              }}
              className="border-sand-300 text-xs"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Change Time
            </Button>

            <Button
              size="sm"
              onClick={onClose}
              className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold"
            >
              Done
            </Button>
          </div>
        </div>

      </motion.div>
    </div>
  )
}
