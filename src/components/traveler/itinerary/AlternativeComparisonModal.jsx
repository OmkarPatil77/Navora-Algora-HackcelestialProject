import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const AlternativeComparisonModal = ({
  isOpen,
  onClose,
  alternatives = [],
  onSelectOption
}) => {
  if (!isOpen) return null

  const rows = [
    { label: "Price Impact", key: "priceDiffText" },
    { label: "Distance from Hotel", key: "distance" },
    { label: "Duration", key: "duration" },
    { label: "Availability", key: "availability", defaultVal: "Confirmed Available" },
    { label: "Preference Match", key: "preferenceMatch", format: val => `${val}%` },
    { label: "Schedule Impact", key: "scheduleImpact", defaultVal: "No downstream conflict ✓" }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl rounded-2xl bg-white p-6 sm:p-7 shadow-soft-xl border border-sand-200 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-700">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-charcoal-950">
                Compare Alternative Options
              </h3>
              <p className="text-xs text-muted-foreground">
                Side-by-side comparison. Select the option that best fits your travel preference and budget.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-sand-200">
                <th className="py-3 px-4 font-bold text-charcoal-500 uppercase tracking-wider text-[11px] w-1/4">
                  Feature
                </th>
                {alternatives.map((opt, i) => (
                  <th key={opt.id} className="py-3 px-4 font-serif font-bold text-base text-charcoal-950 w-1/4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-terracotta-600 uppercase block">
                        Option 0{i + 1}
                      </span>
                      <span>{opt.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-sand-50/40" : "bg-white"}>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-700 text-xs">
                    {row.label}
                  </td>
                  {alternatives.map(opt => {
                    let val = opt[row.key] ?? row.defaultVal
                    if (row.format && opt[row.key] != null) {
                      val = row.format(opt[row.key])
                    }
                    return (
                      <td key={opt.id} className="py-3.5 px-4 text-charcoal-900 font-medium">
                        {row.key === "preferenceMatch" ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {val}
                          </span>
                        ) : row.key === "priceDiffText" ? (
                          <span className="font-bold text-charcoal-950">
                            {val}
                          </span>
                        ) : row.key === "scheduleImpact" ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>✓ No conflict</span>
                          </span>
                        ) : (
                          val
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-sand-200">
                <td className="py-4 px-4 font-bold text-charcoal-700">
                  Select Decision
                </td>
                {alternatives.map(opt => (
                  <td key={opt.id} className="py-4 px-4">
                    <Button
                      size="sm"
                      onClick={() => onSelectOption(opt)}
                      className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold h-9 shadow-soft-xs"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Choose Option
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs text-charcoal-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-terracotta-600 shrink-0" />
          <span>
            Selecting an alternative will open an <strong>Impact Analysis</strong> so you can inspect budget, schedule, and transit updates before confirming.
          </span>
        </div>
      </motion.div>
    </div>
  )
}
