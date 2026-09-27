import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Sparkles, Check, ArrowRight, Clock, MapPin, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const DynamicDisruptionSection = ({
  disruptedItem = {
    title: "Water Sports & Jet Ski Safari",
    time: "2:00 PM • Oct 13",
    reason: "The vendor cancelled this activity due to wave turbulence.",
    affectedTravelers: 6
  },
  alternatives = [
    {
      id: "alt-scuba",
      title: "Scuba Diving & Coral Exploration",
      priceDiff: 500,
      priceDiffText: "₹500 extra",
      distance: "15 min away",
      duration: "2 hrs",
      preferenceMatch: 95,
      features: [
        "Matches Adventure preference",
        "Available on Oct 13",
        "Fits current schedule"
      ]
    },
    {
      id: "alt-kayak",
      title: "Guided Kayaking in Mangrove Estuary",
      priceDiff: 0,
      priceDiffText: "Same price",
      distance: "10 min away",
      duration: "2 hrs",
      preferenceMatch: 88,
      features: [
        "Available on Oct 13",
        "No schedule conflict",
        "High safety rating"
      ]
    },
    {
      id: "alt-cruise",
      title: "Sunset River Catamaran Cruise",
      priceDiff: 300,
      priceDiffText: "₹300 extra",
      distance: "20 min away",
      duration: "2 hrs",
      preferenceMatch: 91,
      features: [
        "Matches Photography preference",
        "Available on Oct 13",
        "Complimentary beverages"
      ]
    }
  ],
  onCompareOptions,
  onSelectAlternative
}) => {
  return (
    <div className="relative pl-10 sm:pl-14 py-4 select-none">
      {/* Red alert line track */}
      <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-rose-400" />
      <div className="absolute left-[13px] sm:left-[21px] top-8 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-xs flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-rose-300 shadow-soft-md space-y-5">
        
        {/* Disruption Alert Header */}
        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" />
                ⚠ Activity Cancelled
              </span>
              <span className="text-xs font-semibold text-rose-900">{disruptedItem.time}</span>
            </div>

            <h3 className="font-serif font-bold text-lg text-charcoal-950 mt-1">
              {disruptedItem.title}
            </h3>

            <p className="text-xs text-rose-800">
              {disruptedItem.reason} • <span className="font-semibold">{disruptedItem.affectedTravelers} travelers are affected</span>.
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
              Action Required
            </span>
          </div>
        </div>

        {/* AI Resolution Sub-header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal-950">
                AI analyzed your itinerary and found 3 alternatives
              </h4>
              <p className="text-xs text-muted-foreground">
                Evaluated against your preferences, location buffers, and downstream dinner reservation.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onCompareOptions}
            className="border-sand-300 bg-sand-50 hover:bg-white text-charcoal-900 font-semibold text-xs shadow-soft-xs"
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-600" />}
          >
            Compare Options
          </Button>
        </div>

        {/* 3 Alternative Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alternatives.map((opt, i) => (
            <motion.div
              key={opt.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl border border-sand-200 bg-sand-50/40 hover:bg-white hover:border-terracotta-300 hover:shadow-soft-sm transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider">
                    Option {i + 1}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    opt.priceDiff === 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {opt.priceDiffText}
                  </span>
                </div>

                <h5 className="font-serif font-bold text-sm text-charcoal-950">
                  {opt.title}
                </h5>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-charcoal-500" />
                    <span>{opt.distance}</span>
                  </span>
                  <span>•</span>
                  <span>{opt.duration}</span>
                </div>

                {/* Features / Matches */}
                <div className="space-y-1 pt-1 text-[11px] text-charcoal-700">
                  {opt.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-sand-200/80">
                <Button
                  size="sm"
                  onClick={() => onSelectAlternative(opt)}
                  className="w-full bg-white hover:bg-sand-100 text-charcoal-900 border border-sand-300 hover:border-terracotta-400 text-xs font-semibold h-8 shadow-soft-xs"
                >
                  Select & Analyze Impact
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
