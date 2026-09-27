import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Check, Plane, Train, Bus, Car, Key, 
  Compass, Heart, Wallet, ShieldCheck, Hotel, Zap 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const StepTravelStyle = ({
  travelStyle,
  onTravelStyleChange
}) => {
  const { 
    pace = "balanced", 
    accommodation = "comfort", 
    transportation = ["flight", "private-car"], 
    priority = "experiences" 
  } = travelStyle

  const paceOptions = [
    { id: "relaxed", title: "Relaxed", desc: "1-2 stops/day • Slow mornings, coffee breaks & calm evenings" },
    { id: "balanced", title: "Balanced", desc: "3-4 stops/day • Harmonious blend of sights, food & downtime" },
    { id: "fast-paced", title: "Fast-Paced", desc: "5+ stops/day • High-energy, see-it-all bucket list exploration" }
  ]

  const accommodationOptions = [
    { id: "budget", title: "Budget", desc: "Cozy verified homestays, boutique hostels & guesthouses" },
    { id: "comfort", title: "Comfort", desc: "3-4★ heritage boutiques, seaside villas & modern hotels" },
    { id: "premium", title: "Premium", desc: "4-5★ curated upscale resorts, beach clubs & private suites" },
    { id: "luxury", title: "Luxury", desc: "5★ ultra-luxury estates, butler service & private villas" }
  ]

  const transportOptions = [
    { id: "flight", label: "Flight", icon: Plane },
    { id: "private-car", label: "Private Car", icon: Car },
    { id: "train", label: "Train", icon: Train },
    { id: "rental-car", label: "Self-Drive Rental", icon: Key },
    { id: "bus", label: "Bus / Coach", icon: Bus },
    { id: "public-transport", label: "Public Transit", icon: Compass }
  ]

  const priorityOptions = [
    { id: "experiences", label: "Experiences", desc: "Memorable activities, local food & hidden spots", icon: Sparkles },
    { id: "comfort", label: "Comfort", desc: "Premium stays, effortless transfers & relaxed vibe", icon: Heart },
    { id: "saving-money", label: "Saving Money", desc: "Smart budget hacks & maximum value per rupee", icon: Wallet },
    { id: "convenience", label: "Convenience", desc: "Zero-stress logistics & pre-booked VIP access", icon: ShieldCheck }
  ]

  const toggleTransport = (id) => {
    if (transportation.includes(id)) {
      if (transportation.length > 1) {
        onTravelStyleChange({ transportation: transportation.filter(t => t !== id) })
      }
    } else {
      onTravelStyleChange({ transportation: [...transportation, id] })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 05 • Travel Style</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          How do you like to travel?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Calibrate the rhythm, stay comfort, and transit preferences of your trip.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Why this matters: </span>
          Pacing determines whether days start at 7:30 AM with action sports or 10:30 AM with leisurely poolside brunch.
        </div>
      </div>

      {/* 1. Pace Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
          1. Journey Pacing
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paceOptions.map(p => {
            const isSelected = pace === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onTravelStyleChange({ pace: p.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-terracotta-50/90 border-terracotta-500 shadow-soft-xs text-charcoal-950 ring-1 ring-terracotta-500/30"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm text-charcoal-950">{p.title}</span>
                  {isSelected && <Check className="w-4 h-4 text-terracotta-600" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Accommodation Tier */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
          2. Accommodation Standard
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {accommodationOptions.map(acc => {
            const isSelected = accommodation === acc.id
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onTravelStyleChange({ accommodation: acc.id })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-terracotta-50/90 border-terracotta-500 shadow-soft-xs text-charcoal-950 ring-1 ring-terracotta-500/30"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm text-charcoal-950">{acc.title}</span>
                  {isSelected && <Check className="w-4 h-4 text-terracotta-600" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{acc.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Transportation (Multi) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
            3. Preferred Transportation (Select Multiple)
          </label>
          <span className="text-xs text-muted-foreground">Select at least 1</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {transportOptions.map(t => {
            const isSelected = transportation.includes(t.id)
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTransport(t.id)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-charcoal-900 text-white border-charcoal-800 shadow-soft-xs font-semibold"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-terracotta-400" : "text-charcoal-500"}`} />
                  <span>{t.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. What matters most? (Single) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
          4. What matters most to you?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {priorityOptions.map(pr => {
            const isSelected = priority === pr.id
            const Icon = pr.icon
            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => onTravelStyleChange({ priority: pr.id })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? "bg-terracotta-50/90 border-terracotta-500 shadow-soft-xs ring-1 ring-terracotta-500/30"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  isSelected ? "bg-terracotta-600 text-white" : "bg-sand-100 text-charcoal-600"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-charcoal-950">{pr.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-600" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{pr.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
