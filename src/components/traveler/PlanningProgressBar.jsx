import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const PlanningProgressBar = ({ currentStep, maxVisitedStep, onStepClick }) => {
  const steps = [
    { num: 1, label: "Destination", key: "01" },
    { num: 2, label: "Dates", key: "02" },
    { num: 3, label: "Travelers", key: "03" },
    { num: 4, label: "Interests", key: "04" },
    { num: 5, label: "Travel Style", key: "05" },
    { num: 6, label: "Budget", key: "06" },
    { num: 7, label: "Review", key: "07" },
  ]

  return (
    <div className="w-full bg-white border border-sand-200/90 rounded-2xl p-3 sm:p-4 shadow-soft-xs">
      {/* Step Numbers & Labels Horizontal Scrollable on Mobile */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
        {steps.map((step) => {
          const isCurrent = currentStep === step.num
          const isCompleted = step.num < currentStep
          const isClickable = step.num <= maxVisitedStep

          return (
            <button
              key={step.num}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.num)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl transition-all shrink-0 text-left select-none",
                isCurrent && "bg-sand-200/80 font-bold shadow-soft-xs text-charcoal-950 ring-1 ring-sand-300",
                isCompleted && !isCurrent && "text-charcoal-700 hover:bg-sand-100/70 cursor-pointer",
                !isClickable && "opacity-40 cursor-not-allowed text-muted-foreground"
              )}
            >
              {/* Step indicator badge */}
              <span className={cn(
                "w-6 h-6 rounded-lg text-xs font-mono flex items-center justify-center font-bold transition-all",
                isCurrent && "bg-terracotta-600 text-white shadow-xs",
                isCompleted && !isCurrent && "bg-sand-200 text-charcoal-800",
                !isClickable && "bg-sand-100 text-muted-foreground"
              )}>
                {isCompleted ? <Check className="w-3.5 h-3.5 text-charcoal-800" /> : step.key}
              </span>

              {/* Step Label */}
              <span className={cn(
                "text-xs hidden md:inline-block",
                isCurrent ? "font-bold text-charcoal-950" : "font-medium text-charcoal-600"
              )}>
                {step.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Thin Progress bar */}
      <div className="w-full bg-sand-100 h-1 rounded-full overflow-hidden mt-3">
        <div 
          className="bg-terracotta-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
        />
      </div>
    </div>
  )
}
