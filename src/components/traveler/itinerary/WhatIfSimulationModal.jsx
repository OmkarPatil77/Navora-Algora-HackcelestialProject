import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, HelpCircle, Sparkles, Check, ArrowRight, Send, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const WhatIfSimulationModal = ({
  isOpen,
  onClose,
  currentTripCost = 29450,
  currentHotelCost = 10000,
  currentCompatibility = 92,
  onApplySimulation
}) => {
  if (!isOpen) return null

  const presets = [
    {
      id: "reduce-hotel",
      label: "Reduce hotel budget",
      prompt: "What if I reduce my hotel budget by ₹5,000?",
      title: "Reduce hotel budget by ₹5,000",
      hotelCostBefore: 10000,
      hotelCostAfter: 5000,
      tripCostBefore: currentTripCost,
      tripCostAfter: Math.max(5000, currentTripCost - 5000),
      compatibilityBefore: currentCompatibility,
      compatibilityAfter: 89,
      impacts: [
        "Hotel upgraded/downgraded to 3-Star Heritage Villa",
        "Travel time +15 min/day to reach beach strip",
        "Existing activities unaffected",
        "Preference compatibility: 92% → 89%"
      ]
    },
    {
      id: "add-day",
      label: "Add one day",
      prompt: "What if I add one more day?",
      title: "Extend Trip by +1 Day (6 Days Total)",
      hotelCostBefore: 10000,
      hotelCostAfter: 12500,
      tripCostBefore: currentTripCost,
      tripCostAfter: currentTripCost + 4800,
      compatibilityBefore: currentCompatibility,
      compatibilityAfter: 96,
      impacts: [
        "Adds relaxed South Goa coastal discovery day",
        "Pace changes from moderate to unhurried relaxation",
        "Extra night stay booked at current resort",
        "Preference compatibility: 92% → 96%"
      ]
    },
    {
      id: "replace-activity",
      label: "Replace an activity",
      prompt: "What if I replace luxury dining with local street food trails?",
      title: "Swap Fine Dining for Authentic Street Food Trails",
      hotelCostBefore: 10000,
      hotelCostAfter: 10000,
      tripCostBefore: currentTripCost,
      tripCostAfter: currentTripCost - 1800,
      compatibilityBefore: currentCompatibility,
      compatibilityAfter: 94,
      impacts: [
        "Replaces 2 fine-dining dinners with Latin Quarter food walks",
        "Saves ₹1,800 on culinary budget",
        "Adds 4 local artisan food tastings",
        "Preference compatibility: 92% → 94%"
      ]
    },
    {
      id: "less-hectic",
      label: "Make the trip less hectic",
      prompt: "Make the trip less hectic and add more buffer time",
      title: "Pacing Adjustment: Low Intensity & Extra Buffers",
      hotelCostBefore: 10000,
      hotelCostAfter: 10000,
      tripCostBefore: currentTripCost,
      tripCostAfter: currentTripCost - 800,
      compatibilityBefore: currentCompatibility,
      compatibilityAfter: 95,
      impacts: [
        "Expands daily buffer windows from 45 min to 1h 30m",
        "Consolidates morning stops to minimize packing and transit",
        "Removes late-night transfer on Day 3",
        "Preference compatibility: 92% → 95%"
      ]
    }
  ]

  const [activeSimulation, setActiveSimulation] = useState(presets[0])
  const [customQuery, setCustomQuery] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSelectPreset = (preset) => {
    setActiveSimulation(preset)
    setCustomQuery(preset.prompt)
  }

  const handleRunCustomQuery = (e) => {
    e?.preventDefault()
    if (!customQuery.trim()) return

    setIsSimulating(true)
    setTimeout(() => {
      // Find matching preset or generate realistic simulation
      const lower = customQuery.toLowerCase()
      if (lower.includes("hotel") || lower.includes("budget") || lower.includes("5,000") || lower.includes("5000")) {
        setActiveSimulation(presets[0])
      } else if (lower.includes("day") || lower.includes("add") || lower.includes("extend")) {
        setActiveSimulation(presets[1])
      } else if (lower.includes("food") || lower.includes("replace") || lower.includes("activity")) {
        setActiveSimulation(presets[2])
      } else {
        setActiveSimulation(presets[3])
      }
      setIsSimulating(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 shadow-soft-xl border border-sand-200 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Sandbox Orchestration Simulator
              </span>
              <h3 className="font-serif font-bold text-xl text-charcoal-950">
                What If...?
              </h3>
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

        {/* Preset Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider block">
            What would you like to change?
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeSimulation.id === preset.id
                    ? 'bg-purple-700 text-white border-purple-800 shadow-soft-xs'
                    : 'bg-sand-50 text-charcoal-800 border-sand-200 hover:bg-sand-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Input */}
        <form onSubmit={handleRunCustomQuery} className="relative">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g. What if I reduce my hotel budget by ₹5,000?"
            className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-sand-50/50 text-xs text-charcoal-900"
          />
          <button
            type="submit"
            disabled={isSimulating}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Simulate</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Simulation Result Preview */}
        {activeSimulation && (
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                WHAT IF?
              </span>
              <h4 className="font-serif font-bold text-base text-charcoal-950 mt-0.5">
                {activeSimulation.title}
              </h4>
            </div>

            {/* Cost & Hotel Delta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  New Hotel Cost
                </span>
                <span className="font-serif font-bold text-charcoal-950 text-sm mt-0.5 block">
                  {formatCurrency(activeSimulation.hotelCostBefore)} → {formatCurrency(activeSimulation.hotelCostAfter)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Estimated Trip Cost
                </span>
                <span className="font-serif font-bold text-purple-900 text-sm mt-0.5 block">
                  {formatCurrency(activeSimulation.tripCostBefore)} → {formatCurrency(activeSimulation.tripCostAfter)}
                </span>
              </div>
            </div>

            {/* Impact Bullet Points */}
            <div className="space-y-1.5 text-xs text-charcoal-800">
              <span className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
                Estimated Impact:
              </span>
              {activeSimulation.impacts.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-sand-100/80 text-[11px] text-charcoal-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>This is a non-destructive simulation. No changes are committed until confirmed.</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-sand-200">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="border-sand-300 text-charcoal-700"
          >
            Dismiss
          </Button>

          <Button
            size="md"
            onClick={() => onApplySimulation(activeSimulation)}
            className="bg-purple-700 hover:bg-purple-800 text-white shadow-soft-sm font-semibold"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Change
          </Button>
        </div>

      </motion.div>
    </div>
  )
}
