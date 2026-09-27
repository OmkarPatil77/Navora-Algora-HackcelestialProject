import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, AlertCircle } from 'lucide-react'
import { interestCatalogue } from '@/data/mockData'
import { InterestIcon } from '@/components/traveler/InterestIcon'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const StepInterests = ({
  selectedInterests,
  onInterestsChange
}) => {
  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 2) {
        onInterestsChange(selectedInterests.filter(i => i !== id))
      }
    } else {
      if (selectedInterests.length < 6) {
        onInterestsChange([...selectedInterests, id])
      }
    }
  }

  const isValid = selectedInterests.length >= 2 && selectedInterests.length <= 6

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 04 • Travel Interests</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          What makes a trip feel like a great trip to you?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Your trip will be optimized around these interests.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">AI Personalization: </span>
          Choose 2 to 6 interests. Navora uses these to match specific culinary trails, scenic vantage points, and activity pacing.
        </div>
      </div>

      {/* Counter and selection status */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-charcoal-800">
            Selected: {selectedInterests.length} / 6
          </span>
          {selectedInterests.length < 2 && (
            <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Please select at least 2
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">Min 2 • Max 6</span>
      </div>

      {/* 12 Interests Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {interestCatalogue.map((item) => {
          const isSelected = selectedInterests.includes(item.id)
          const isMaxReached = selectedInterests.length >= 6 && !isSelected

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: isMaxReached ? 1 : 1.02 }}
              whileTap={{ scale: isMaxReached ? 1 : 0.98 }}
              onClick={() => toggleInterest(item.id)}
              disabled={isMaxReached}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between min-h-[105px] transition-all relative ${
                isSelected
                  ? "bg-terracotta-50/90 border-terracotta-500 shadow-soft-xs text-terracotta-950 ring-1 ring-terracotta-500/30"
                  : isMaxReached
                  ? "bg-sand-50/40 border-sand-200/60 text-muted-foreground opacity-50 cursor-not-allowed"
                  : "bg-white border-sand-200 hover:border-sand-300 text-charcoal-800 hover:bg-sand-50/80 shadow-soft-xs"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-terracotta-600 text-white shadow-xs"
                    : "bg-sand-100 text-charcoal-700"
                }`}>
                  <InterestIcon name={item.iconName} className="w-4 h-4" />
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-terracotta-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <span className="font-serif font-bold text-xs block leading-tight">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5 line-clamp-1">
                  {item.desc}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
