import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Edit3, MapPin, Calendar, Users, 
  Heart, Compass, Wallet, ArrowRight, CheckCircle2, ShieldCheck, Zap 
} from 'lucide-react'
import { interestCatalogue } from '@/data/mockData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const StepReview = ({
  preferences,
  onEditStep,
  onGenerateJourney,
  isGenerating = false
}) => {
  const {
    destination,
    startDate,
    endDate,
    duration,
    travelers,
    interests,
    travelStyle,
    budget
  } = preferences

  const formatInterestLabels = (ids) => {
    return ids.map(id => {
      const match = interestCatalogue.find(i => i.id === id)
      return match ? match.label : id
    }).join(' · ')
  }

  const formatTransportLabels = (transports) => {
    const map = {
      flight: "Flight",
      "private-car": "Private Car",
      train: "Train",
      "rental-car": "Rental Car",
      bus: "Bus",
      "public-transport": "Public Transit"
    }
    return transports.map(t => map[t] || t).join(' · ')
  }

  const reviewSections = [
    {
      stepIndex: 1,
      label: "Destination",
      value: destination.name || `${destination.city}, ${destination.country}`,
      icon: MapPin,
      badge: destination.region
    },
    {
      stepIndex: 2,
      label: "Dates & Duration",
      value: `${duration.formatted || '4 Days / 3 Nights'} (${startDate} → ${endDate})`,
      icon: Calendar
    },
    {
      stepIndex: 3,
      label: "Travelers",
      value: `${travelers.total} Traveler${travelers.total > 1 ? 's' : ''} (${travelers.composition || `${travelers.adults} Adults`})`,
      icon: Users
    },
    {
      stepIndex: 4,
      label: "Interests",
      value: formatInterestLabels(interests),
      icon: Heart,
      highlight: true
    },
    {
      stepIndex: 5,
      label: "Travel Style",
      value: `Pace: ${travelStyle.pace.charAt(0).toUpperCase() + travelStyle.pace.slice(1)} • Stay: ${travelStyle.accommodation.charAt(0).toUpperCase() + travelStyle.accommodation.slice(1)} • Transit: ${formatTransportLabels(travelStyle.transportation)}`,
      icon: Compass,
      subvalue: `Priority: ${travelStyle.priority.charAt(0).toUpperCase() + travelStyle.priority.slice(1)}`
    },
    {
      stepIndex: 6,
      label: "Target Budget",
      value: `${formatCurrency(budget.total)} (${budget.currency})`,
      icon: Wallet,
      badge: "Estimated Allocation Ready"
    }
  ]

  const flowSteps = [
    { label: "Your preferences", desc: "6 dimensions captured" },
    { label: "Experience matching", desc: "100+ local spots filtered" },
    { label: "Schedule optimization", desc: "Dynamic route balancing" },
    { label: "Budget calibration", desc: "Estimated buffers applied" },
    { label: "Personalized journey", desc: "Adaptive & resilient plan" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Final Step • Blueprint Review</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          Your journey, at a glance.
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Review your travel blueprint before Navora builds your adaptive itinerary.
        </p>
      </div>

      {/* Review Summary Card */}
      <Card className="p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sand-100">
          <span className="font-serif font-bold text-base text-charcoal-950">
            Journey Details
          </span>
          <Badge variant="outline" size="sm">Preferences Confirmed</Badge>
        </div>

        <div className="divide-y divide-sand-100">
          {reviewSections.map((sec) => {
            const Icon = sec.icon
            return (
              <div key={sec.label} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sand-100 text-charcoal-700 mt-0.5 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {sec.label}
                      </span>
                      {sec.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sand-100 text-charcoal-700 border border-sand-200">
                          {sec.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-semibold mt-0.5 ${sec.highlight ? "text-terracotta-800" : "text-charcoal-950"}`}>
                      {sec.value}
                    </p>
                    {sec.subvalue && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sec.subvalue}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEditStep(sec.stepIndex)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600 px-2.5 py-1 rounded-md hover:bg-sand-100 transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Preparation Card with Visual Flow */}
      <Card className="p-6 sm:p-8 bg-charcoal-950 text-white border-charcoal-800 shadow-soft-md rounded-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-terracotta-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Ready to explore</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Ready to discover experiences?
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-300 mt-2 leading-relaxed max-w-2xl">
            We will use your preferences to match authentic activities, keep your budget balanced, and create an itinerary tailored to your pace.
          </p>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
            {flowSteps.map((step, idx) => (
              <div
                key={step.label}
                className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center flex flex-col justify-between space-y-1 relative"
              >
                <span className="text-[10px] font-mono text-terracotta-400 block font-semibold">
                  0{idx + 1}
                </span>
                <span className="font-serif font-bold text-xs text-white block">
                  {step.label}
                </span>
                <span className="text-[10px] text-charcoal-400 block">
                  {step.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Big Action CTA */}
        <div className="pt-4 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-charcoal-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Schedule flexibility buffer enabled</span>
          </div>

          <Button
            size="lg"
            onClick={onGenerateJourney}
            isLoading={isGenerating}
            className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-sm px-8 py-3.5 text-base font-semibold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Find Experiences
          </Button>
        </div>
      </Card>
    </div>
  )
}
