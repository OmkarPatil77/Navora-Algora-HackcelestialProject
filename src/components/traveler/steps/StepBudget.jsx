import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Wallet, Shield, PieChart, 
  Hotel, Plane, Ticket, UtensilsCrossed, HelpCircle 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const StepBudget = ({
  budget,
  onBudgetChange
}) => {
  const { total = 35000, breakdown } = budget

  const handleSliderChange = (e) => {
    onBudgetChange(Number(e.target.value))
  }

  const budgetPresets = [
    { label: "₹20,000 (Budget)", val: 20000 },
    { label: "₹35,000 (Balanced)", val: 35000 },
    { label: "₹65,000 (Comfort)", val: 65000 },
    { label: "₹1,20,000 (Luxury)", val: 120000 },
  ]

  const items = [
    { label: "Stays & Boutique Accommodation", amount: breakdown?.accommodation || Math.round(total * 0.35), percentage: "35%", icon: Hotel, color: "text-amber-700 bg-amber-50" },
    { label: "Flights & Local Transit", amount: breakdown?.transport || Math.round(total * 0.25), percentage: "25%", icon: Plane, color: "text-sky-700 bg-sky-50" },
    { label: "Curated Experiences & Passes", amount: breakdown?.activities || Math.round(total * 0.18), percentage: "18%", icon: Ticket, color: "text-terracotta-700 bg-terracotta-50" },
    { label: "Authentic Dining & Tastings", amount: breakdown?.food || Math.round(total * 0.14), percentage: "14%", icon: UtensilsCrossed, color: "text-emerald-700 bg-emerald-50" },
    { label: "Safety Net & Anomaly Buffer", amount: breakdown?.buffer || Math.round(total * 0.08), percentage: "8%", icon: Shield, color: "text-purple-700 bg-purple-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 06 • Budget Calibration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          What's your comfort zone?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Set your target budget so Navora can balance stays, transit, and experiences.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Why this matters: </span>
          Navora uses mathematical constraint balancing to ensure you experience authentic high-rating highlights while reserving a dynamic buffer for flight or weather disruptions.
        </div>
      </div>

      {/* Main Budget Card */}
      <Card className="p-6 bg-white border-sand-200 shadow-soft-sm space-y-6">
        
        {/* Prominent Budget Display */}
        <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/90 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Total Journey Investment
          </span>
          <div className="text-4xl sm:text-5xl font-bold font-serif text-charcoal-950 tracking-tight">
            {formatCurrency(total)}
          </div>
          <p className="text-xs text-muted-foreground">For all travelers across entire duration</p>
        </div>

        {/* Range Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-charcoal-700">
            <span>₹10,000 (Minimum)</span>
            <span>₹2,00,000 (Luxury Cap)</span>
          </div>

          <input
            type="range"
            min="10000"
            max="200000"
            step="2500"
            value={total}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
          />

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {budgetPresets.map(preset => (
              <button
                key={preset.val}
                type="button"
                onClick={() => onBudgetChange(preset.val)}
                className={`py-1.5 px-2 text-xs rounded-lg border transition-all ${
                  total === preset.val
                    ? "bg-terracotta-600 text-white border-terracotta-600 font-semibold shadow-soft-xs"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Approximate Allocation Preview */}
        <div className="pt-4 border-t border-sand-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-serif font-bold text-sm text-charcoal-950">
                Preliminary Allocation Breakdown
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sand-200 text-charcoal-700">
              Estimated planning allocation
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {items.map((it, idx) => {
              const Icon = it.icon
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sand-50/60 border border-sand-200/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${it.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-medium text-charcoal-900">{it.label}</span>
                      <span className="text-muted-foreground ml-1.5 text-[11px]">({it.percentage})</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-charcoal-950">
                    {formatCurrency(it.amount)}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-muted-foreground italic text-center pt-1">
            * This breakdown is a planning estimate. Real-time API pricing will be matched during final reservation.
          </p>
        </div>

      </Card>
    </div>
  )
}
