import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ArrowRight, Sparkles, Check, AlertCircle, PieChart, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export const ItineraryBudgetView = ({
  totalEstimatedCost = 29450,
  targetBudget = 30000,
  breakdown = {
    accommodation: 12000,
    transportation: 5500,
    activities: 6450,
    food: 4000,
    other: 1500
  },
  proposedChange = {
    active: true,
    activityTitle: "Scuba Diving Alternative",
    currentCost: 29450,
    afterCost: 29950,
    difference: 500
  }
}) => {
  const remainingBudget = Math.max(0, targetBudget - totalEstimatedCost)
  const percentUsed = Math.min(100, Math.round((totalEstimatedCost / targetBudget) * 100))

  const categories = [
    { label: "Accommodation", amount: breakdown.accommodation || 12000, color: "bg-teal-600", light: "bg-teal-50 text-teal-800" },
    { label: "Transportation", amount: breakdown.transportation || 5500, color: "bg-amber-600", light: "bg-amber-50 text-amber-800" },
    { label: "Activities", amount: breakdown.activities || 6450, color: "bg-terracotta-600", light: "bg-terracotta-50 text-terracotta-800" },
    { label: "Food & Dining", amount: breakdown.food || 4000, color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-800" },
    { label: "Other & Buffer", amount: breakdown.other || 1500, color: "bg-purple-600", light: "bg-purple-50 text-purple-800" }
  ]

  const totalCalculated = categories.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Total Trip Cost & Remaining Budget */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider block">
              Budget Allocation & Adherence
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal-950 mt-1">
              TOTAL TRIP COST
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-charcoal-900">
                {formatCurrency(totalEstimatedCost)}
              </span>
              <span className="text-charcoal-400 font-medium">/</span>
              <span className="text-sm font-semibold text-charcoal-600">
                {formatCurrency(targetBudget)} Target Budget
              </span>
            </div>
          </div>

          {/* Remaining Card */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 sm:text-right">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Remaining Buffer
            </span>
            <span className="text-2xl font-serif font-bold text-emerald-700 block mt-0.5">
              {formatCurrency(remainingBudget)}
            </span>
            <span className="text-[10px] text-emerald-800 font-medium">
              {percentUsed}% of target budget utilized
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-3 rounded-full bg-sand-200 overflow-hidden flex">
            {categories.map((cat, i) => {
              const widthPct = (cat.amount / targetBudget) * 100
              return (
                <div
                  key={cat.label}
                  className={`${cat.color} transition-all duration-500`}
                  style={{ width: `${widthPct}%` }}
                  title={`${cat.label}: ${formatCurrency(cat.amount)}`}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>₹0</span>
            <span>Target: {formatCurrency(targetBudget)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Categories Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <h4 className="font-serif font-bold text-base text-charcoal-950">
              Expense Category Breakdown
            </h4>
            <span className="text-xs font-semibold text-charcoal-500">
              {categories.length} Categories
            </span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const pctOfTotal = Math.round((cat.amount / totalEstimatedCost) * 100)
              return (
                <div key={cat.label} className="p-3 rounded-xl bg-sand-50/60 border border-sand-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                    <span className="font-semibold text-charcoal-900">{cat.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[11px] font-mono">{pctOfTotal}%</span>
                    <span className="font-serif font-bold text-charcoal-950 text-sm">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Proposed Itinerary Change Impact Simulator (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-4">
          <div className="flex items-center gap-2 text-terracotta-700">
            <Sparkles className="w-4 h-4 text-terracotta-600" />
            <h4 className="font-serif font-bold text-base text-charcoal-950">
              Proposed Change Impact
            </h4>
          </div>

          <p className="text-xs text-charcoal-600">
            Preview how proposed alternative activities or what-if scenarios shift your baseline budget.
          </p>

          {/* Before & After comparison card */}
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3 text-xs">
            <div className="flex items-center justify-between text-charcoal-700">
              <span className="text-muted-foreground">Current Baseline:</span>
              <span className="font-serif font-bold text-charcoal-950">{formatCurrency(proposedChange.currentCost)}</span>
            </div>

            <div className="flex items-center justify-between text-charcoal-700">
              <span className="text-muted-foreground">After Alternative Activity:</span>
              <span className="font-serif font-bold text-terracotta-700">{formatCurrency(proposedChange.afterCost)}</span>
            </div>

            <div className="pt-2 border-t border-sand-200 flex items-center justify-between font-bold">
              <span className="text-charcoal-900">Net Difference:</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                +{formatCurrency(proposedChange.difference)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              Even with +₹500 for Scuba Diving, total cost remains well under your ₹30,000 budget cap with ₹50 reserved buffer.
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}
