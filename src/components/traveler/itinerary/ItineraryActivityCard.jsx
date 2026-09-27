import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Clock, Car, Check, MoreVertical, 
  Sparkles, AlertCircle, Trash2, Edit3, RefreshCw, Eye, CheckCircle2
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const ItineraryActivityCard = ({
  item,
  index,
  onViewDetails,
  onChangeTime,
  onReplaceActivity,
  onRemoveActivity,
  isSelected = false
}) => {
  const [showMenu, setShowMenu] = useState(false)

  // Status mapping
  // 🟢 Confirmed, 🟡 Needs Attention, 🔴 Cancelled, 🔵 AI Suggested
  const getStatusBadge = (status = item.status) => {
    switch (status) {
      case 'Cancelled':
      case 'cancelled':
        return {
          label: 'Cancelled',
          dot: 'bg-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200'
        }
      case 'Needs Attention':
      case 'attention':
      case 'warning':
        return {
          label: 'Needs Attention',
          dot: 'bg-amber-500',
          badge: 'bg-amber-50 text-amber-800 border-amber-200'
        }
      case 'AI Suggested':
      case 'suggested':
        return {
          label: 'AI Suggested',
          dot: 'bg-blue-500',
          badge: 'bg-blue-50 text-blue-700 border-blue-200'
        }
      case 'Confirmed':
      default:
        return {
          label: 'Confirmed',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    }
  }

  const statusInfo = getStatusBadge()

  // Default mock fallback values if missing on item
  const proximity = item.proximity || item.distanceFromHotel || "12 min from hotel"
  const transitMode = item.transitMode || "Cab arranged"
  const matches = item.matches || ["Beaches", "Photography"]
  const durationText = item.durationMinutes ? `${Math.round(item.durationMinutes / 60 * 10) / 10} hours` : "2 hours"
  const costText = item.cost > 0 ? formatCurrency(item.cost) : "Free / Included"
  const categoryText = item.category || item.type || "Experience"

  // Activity type icon or emoji
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

  return (
    <div className={`relative p-5 rounded-2xl bg-white border transition-all ${
      isSelected 
        ? 'border-terracotta-500 shadow-soft-md ring-2 ring-terracotta-200/50' 
        : 'border-sand-200 hover:border-sand-300 shadow-soft-xs hover:shadow-soft-sm'
    }`}>
      {/* Top Header: Title + Status + Time */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{emoji}</span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950 leading-snug">
              {item.title}
            </h3>
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              <span>{statusInfo.label}</span>
            </span>
          </div>

          <p className="text-xs text-charcoal-600 font-medium">
            {categoryText} • {durationText} • {costText}
          </p>
        </div>

        {/* Time display */}
        <div className="shrink-0 text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sand-100 text-charcoal-900 font-serif font-bold text-xs">
            <Clock className="w-3 h-3 text-terracotta-600" />
            <span>{item.startTime || "04:30 PM"}</span>
          </span>
        </div>
      </div>

      {/* Logistics & Proximity row */}
      <div className="flex flex-wrap items-center gap-4 py-2 text-xs text-charcoal-600 border-y border-sand-100 my-2.5">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
          <span>{proximity}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-charcoal-500 shrink-0" />
          <span>🚕 {transitMode}</span>
        </div>
      </div>

      {/* Match Indicators */}
      <div className="space-y-1 my-3 text-[11px] text-emerald-800 font-medium">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Matches: {Array.isArray(matches) ? matches.join(", ") : matches}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Within budget</span>
        </div>
      </div>

      {/* Footer: View Details + ⋯ Menu */}
      <div className="flex items-center justify-between pt-2 border-t border-sand-100 mt-2">
        <button
          type="button"
          onClick={() => onViewDetails(item)}
          className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 hover:underline flex items-center gap-1"
        >
          <span>View Details</span>
          <span className="text-sand-400">→</span>
        </button>

        {/* ⋯ Context Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 hover:bg-sand-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 bottom-full mb-1 z-50 w-44 rounded-xl bg-white shadow-soft-lg border border-sand-200 py-1.5 text-xs text-charcoal-800 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onViewDetails(item)
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-sand-50 flex items-center gap-2 font-medium"
                >
                  <Eye className="w-3.5 h-3.5 text-charcoal-500" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onChangeTime(item)
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-sand-50 flex items-center gap-2 font-medium"
                >
                  <Clock className="w-3.5 h-3.5 text-charcoal-500" />
                  <span>Change Time</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onReplaceActivity(item)
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-sand-50 flex items-center gap-2 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Replace Activity</span>
                </button>

                <div className="border-t border-sand-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onRemoveActivity(item)
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Remove Activity</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
