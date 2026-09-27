import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Sparkles, Sun, Moon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const StepDates = ({
  startDate,
  endDate,
  duration,
  onDatesChange
}) => {
  const handleStartChange = (e) => {
    const newStart = e.target.value
    // If end date is before new start date, shift end date accordingly
    let newEnd = endDate
    if (new Date(newStart) >= new Date(endDate)) {
      const d = new Date(newStart)
      d.setDate(d.getDate() + (duration.days || 4))
      newEnd = d.toISOString().split('T')[0]
    }
    onDatesChange(newStart, newEnd)
  }

  const handleEndChange = (e) => {
    const newEnd = e.target.value
    if (new Date(newEnd) <= new Date(startDate)) {
      return
    }
    onDatesChange(startDate, newEnd)
  }

  const setPresetDays = (numDays) => {
    const start = new Date(startDate || "2026-10-12")
    const end = new Date(start)
    end.setDate(start.getDate() + numDays)
    onDatesChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
  }

  // Dynamic context message based on days
  const getContextMessage = (days) => {
    if (days <= 2) {
      return "A compact weekend getaway—we will prioritize signature highlights and minimize transfer overhead."
    }
    if (days >= 3 && days <= 4) {
      return "Four days gives us enough time to balance exploration, food and downtime without rushing the journey."
    }
    if (days >= 5 && days <= 7) {
      return "A well-rounded week allows for both deep regional immersion and scenic day trips."
    }
    return "An extended journey—plenty of room for slow travel, hidden coves, and restorative downtime."
  }

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 02 • Dates & Duration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          How long should we make it?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Set your journey dates to calculate optimal day pacing.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Pacing Insight: </span>
          {getContextMessage(duration.days)}
        </div>
      </div>

      {/* Main Dates Card */}
      <Card className="p-6 bg-white border-sand-200 shadow-soft-sm space-y-6">
        
        {/* Dynamic Big Duration Badge */}
        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-terracotta-50 border border-terracotta-200/70 flex items-center justify-center text-terracotta-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Calculated Duration
              </span>
              <span className="text-2xl font-bold font-serif text-charcoal-950">
                {duration.formatted || `${duration.days} Days / ${duration.nights} Nights`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-sand-200 text-xs font-semibold text-charcoal-800">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              {duration.days} Days
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-sand-200 text-xs font-semibold text-charcoal-800">
              <Moon className="w-3.5 h-3.5 text-sky-600" />
              {duration.nights} Nights
            </span>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Departure / Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={handleStartChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-soft-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Return / End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={handleEndChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-soft-xs"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-sand-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Presets:</span>
          {[
            { label: "3 Days (Weekend)", days: 3 },
            { label: "4 Days (Ideal)", days: 4 },
            { label: "5 Days (Full)", days: 5 },
            { label: "7 Days (Week)", days: 7 },
          ].map(preset => (
            <button
              key={preset.days}
              type="button"
              onClick={() => setPresetDays(preset.days)}
              className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                duration.days === preset.days
                  ? "bg-terracotta-600 text-white border-terracotta-600 font-semibold"
                  : "bg-sand-50 border-sand-200 text-charcoal-700 hover:bg-sand-100"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

      </Card>
    </div>
  )
}
