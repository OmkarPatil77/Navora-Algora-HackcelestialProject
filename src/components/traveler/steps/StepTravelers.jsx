import React from 'react'
import { motion } from 'framer-motion'
import { Users, User, Baby, Sparkles, Plus, Minus, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const StepTravelers = ({
  travelers,
  onTravelersChange
}) => {
  const { adults = 2, children = 0, infants = 0, total = 2 } = travelers

  const updateCount = (type, delta) => {
    const updated = { ...travelers }
    if (type === 'adults') {
      updated.adults = Math.max(1, Math.min(10, adults + delta))
    } else if (type === 'children') {
      updated.children = Math.max(0, Math.min(8, children + delta))
    } else if (type === 'infants') {
      updated.infants = Math.max(0, Math.min(4, infants + delta))
    }
    onTravelersChange(updated)
  }

  const travelerTypes = [
    {
      id: 'adults',
      title: 'Adults',
      subtitle: 'Age 13 and above',
      count: adults,
      min: 1,
      max: 10,
      icon: User
    },
    {
      id: 'children',
      title: 'Children',
      subtitle: 'Ages 2 – 12',
      count: children,
      min: 0,
      max: 8,
      icon: Users
    },
    {
      id: 'infants',
      title: 'Infants',
      subtitle: 'Under 2 years',
      count: infants,
      min: 0,
      max: 4,
      icon: Baby
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 03 • Travelers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          Who's coming along?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Specify your group size so Navora books appropriate room allocations and private vehicle sizes.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Why this matters: </span>
          Party composition dictates vehicle choices (sedan vs Innova vs tempo), bed configurations, and family-friendly activity filters.
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-soft-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-50 border border-terracotta-200/70 flex items-center justify-center text-terracotta-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Total Travel Party
            </span>
            <span className="text-lg font-bold font-serif text-charcoal-950">
              {total} Traveler{total > 1 ? 's' : ''} ({travelers.composition || `${adults} Adults`})
            </span>
          </div>
        </div>

        <Badge variant="default" size="md">
          {adults === 1 && children === 0 ? "Solo Explorer" :
           adults === 2 && children === 0 ? "Couple / Duo" :
           children > 0 ? "Family Group" : "Group Expedition"}
        </Badge>
      </div>

      {/* Increment/Decrement Controls */}
      <Card className="p-6 bg-white border-sand-200 shadow-soft-sm divide-y divide-sand-100">
        {travelerTypes.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-charcoal-700">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-950">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateCount(item.id, -1)}
                  disabled={item.count <= item.min}
                  className="w-9 h-9 rounded-lg border border-sand-300 bg-sand-50 hover:bg-sand-100 text-charcoal-800 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-serif font-bold text-base text-charcoal-950">
                  {item.count}
                </span>

                <button
                  type="button"
                  onClick={() => updateCount(item.id, 1)}
                  disabled={item.count >= item.max}
                  className="w-9 h-9 rounded-lg border border-sand-300 bg-sand-50 hover:bg-sand-100 text-charcoal-800 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
