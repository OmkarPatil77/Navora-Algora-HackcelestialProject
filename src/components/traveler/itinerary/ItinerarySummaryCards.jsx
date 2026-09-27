import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Compass, BookmarkCheck, Clock, CheckCircle2, Info, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const ItinerarySummaryCards = ({
  estimatedCost = 29450,
  activitiesCount = 12,
  bookingsCount = 4,
  travelTimePerDay = "2.4 hrs/day",
  planCompatibility = 92,
  compatibilityDetails = {
    preferences: 95,
    budget: 91,
    travelStyle: 94,
    activityInterests: 90,
    scheduleConstraints: 100
  }
}) => {
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false)

  const cards = [
    {
      label: "Estimated Cost",
      value: formatCurrency(estimatedCost),
      icon: Wallet,
      color: "text-charcoal-900",
      bg: "bg-white",
      highlight: null
    },
    {
      label: "Activities",
      value: activitiesCount,
      icon: Compass,
      color: "text-charcoal-900",
      bg: "bg-white",
      highlight: null
    },
    {
      label: "Bookings",
      value: bookingsCount,
      icon: BookmarkCheck,
      color: "text-charcoal-900",
      bg: "bg-white",
      highlight: null
    },
    {
      label: "Travel Time",
      value: travelTimePerDay,
      icon: Clock,
      color: "text-charcoal-900",
      bg: "bg-white",
      highlight: null
    },
    {
      label: "Plan Compatibility",
      value: `${planCompatibility}%`,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50/50 hover:bg-emerald-50/80 cursor-pointer border-emerald-200",
      highlight: "Explainable Metric ⓘ",
      onClick: () => setShowCompatibilityModal(true)
    }
  ]

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={card.onClick}
              className={`p-4 rounded-2xl border transition-all ${card.bg} ${
                card.onClick ? 'shadow-soft-xs hover:shadow-soft-md cursor-pointer group' : 'border-sand-200 bg-white shadow-soft-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.highlight ? 'text-emerald-600' : 'text-sand-400'}`} />
              </div>

              <div className={`text-xl sm:text-2xl font-serif font-bold ${card.color}`}>
                {card.value}
              </div>

              {card.highlight ? (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 group-hover:underline">
                  {card.highlight}
                </span>
              ) : (
                <span className="mt-1.5 block text-[10px] text-muted-foreground">
                  Synchronized
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Plan Compatibility Explanation Modal */}
      <AnimatePresence>
        {showCompatibilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft-xl border border-sand-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-charcoal-950">Plan Compatibility Score</h3>
                    <p className="text-xs text-muted-foreground">Explainable Orchestration Metric</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompatibilityModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-2 bg-sand-50 rounded-xl border border-sand-200">
                <span className="text-4xl font-serif font-bold text-emerald-700">{planCompatibility}%</span>
                <p className="text-xs font-semibold text-charcoal-700 mt-1">Excellent Personalized Alignment</p>
                <p className="text-[11px] text-charcoal-500 px-4 mt-0.5">
                  Represents how precisely this itinerary balances your preferences, budget constraints, travel pace, and scheduled transit.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-charcoal-900 uppercase tracking-wider text-[10px]">
                  Breakdown by Dimensions
                </h4>

                {[
                  { label: "Preferences & Travel Style", value: compatibilityDetails.preferences, desc: "Matches your selected relaxed pace and beach orientation" },
                  { label: "Budget Adherence", value: compatibilityDetails.budget, desc: "91% optimal cost distribution with healthy buffer" },
                  { label: "Activity Interests Alignment", value: compatibilityDetails.activityInterests, desc: "High density of photography, coastal, and culinary stops" },
                  { label: "Schedule Constraints & Logistics", value: compatibilityDetails.scheduleConstraints, desc: "Zero double bookings and healthy transit buffers" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-charcoal-800">{item.label}</span>
                      <span className="font-bold text-emerald-700">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground block">{item.desc}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCompatibilityModal(false)}
                className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs transition-colors"
              >
                Close Explanation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
