import React from 'react'
import { Sparkles, MapPin, Wallet, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const ItineraryContextualSuggestion = ({
  timeWindow = "between 3 PM and 5 PM",
  interests = ["Beach", "Photography"],
  suggestion = {
    title: "Sunset Point & Coastal Cliffs",
    distance: "12 minutes from your hotel",
    cost: 300,
    durationMinutes: 90
  },
  onAdd,
  onIgnore
}) => {
  return (
    <div className="relative pl-10 sm:pl-14 py-3 select-none">
      {/* Vertical line through */}
      <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-sand-300" />
      {/* Sparkle node on line */}
      <div className="absolute left-[13px] sm:left-[21px] top-7 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs flex items-center justify-center">
        <Sparkles className="w-2 h-2 text-white" />
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-sand-50 border border-amber-200 shadow-soft-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>✨ AI Contextual Suggestion</span>
          </div>
          <button
            type="button"
            onClick={onIgnore}
            className="text-amber-800/70 hover:text-amber-950 text-xs flex items-center gap-1 p-1 hover:bg-amber-100/50 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        </div>

        <p className="text-xs text-charcoal-700 leading-relaxed">
          You have <strong className="text-charcoal-900 font-semibold">2 free hours {timeWindow}</strong>.
          <br />
          Based on your selected interests in <span className="font-semibold text-terracotta-800">{interests.join(" + ")}</span>, you could visit:
        </p>

        <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal-950">{suggestion.title}</h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-terracotta-600" />
                <span>{suggestion.distance}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-600" />
                <span>{formatCurrency(suggestion.cost)} est. cost</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button
              size="sm"
              onClick={onAdd}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 shadow-soft-xs font-semibold"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add to Itinerary
            </Button>
            <button
              type="button"
              onClick={onIgnore}
              className="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 px-2 py-1"
            >
              Ignore
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
