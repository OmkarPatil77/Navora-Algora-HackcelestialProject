import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, AlertTriangle, CalendarCheck, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Compass, Coffee, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const AdaptationFlow = () => {
  const [activeTab, setActiveTab] = useState('flight') // 'flight' | 'weather'

  const flows = {
    flight: [
      {
        step: "01",
        title: "Flight Delay Trigger",
        subtitle: "Real-time Telemetry",
        desc: "Flight 6E-204 delayed by 135 mins due to Mumbai air congestion.",
        icon: Plane,
        accent: "border-rose-200 bg-rose-50/80 text-rose-700",
        badge: "Disruption Caught",
        badgeColor: "bg-rose-100 text-rose-800"
      },
      {
        step: "02",
        title: "Impact Analysis",
        subtitle: "Timeline Solver",
        desc: "Pickup at 13:00 missed; Mandovi Sunset Cruise at 17:30 at high risk.",
        icon: AlertTriangle,
        accent: "border-amber-200 bg-amber-50/80 text-amber-800",
        badge: "Timeline Re-checked",
        badgeColor: "bg-amber-100 text-amber-800"
      },
      {
        step: "03",
        title: "Autonomous Recovery",
        subtitle: "Harmonization Engine",
        desc: "Airport cab pushed automatically. Sunset Cruise moved to Day 2 morning.",
        icon: RefreshCw,
        accent: "border-coral-200 bg-coral-50/80 text-coral-700",
        badge: "Slots Rebalanced",
        badgeColor: "bg-coral-100 text-coral-800"
      },
      {
        step: "04",
        title: "Peaceful Continuation",
        subtitle: "Zero Panic",
        desc: "Dinner booking shifted to 20:30. Zero missed experiences, 0 lost rupee.",
        icon: CalendarCheck,
        accent: "border-emerald-200 bg-emerald-50/80 text-emerald-800",
        badge: "Itinerary Synced",
        badgeColor: "bg-emerald-100 text-emerald-800"
      }
    ],
    weather: [
      {
        step: "01",
        title: "Sudden Monsoon Storm",
        subtitle: "Live Radar Feed",
        desc: "Heavy tropical downpour forecasted across Old Goa churches at 15:30.",
        icon: AlertTriangle,
        accent: "border-sky-200 bg-sky-50/80 text-sky-800",
        badge: "Weather Warning",
        badgeColor: "bg-sky-100 text-sky-800"
      },
      {
        step: "02",
        title: "Outdoor Route At Risk",
        subtitle: "Comfort Optimization",
        desc: "Walking trail flooded. Outdoor photography ruined if kept as-is.",
        icon: Compass,
        accent: "border-amber-200 bg-amber-50/80 text-amber-800",
        badge: "Experience Preserved",
        badgeColor: "bg-amber-100 text-amber-800"
      },
      {
        step: "03",
        title: "Indoor Cultural Pivot",
        subtitle: "Curated Local Alternative",
        desc: "Automatically swapped for indoor Mario Miranda art gallery & heritage spice tea tasting.",
        icon: Coffee,
        accent: "border-coral-200 bg-coral-50/80 text-coral-700",
        badge: "Alternative Selected",
        badgeColor: "bg-coral-100 text-coral-800"
      },
      {
        step: "04",
        title: "Sun Returns Tomorrow",
        subtitle: "Rescheduled",
        desc: "Walking tour moved to clear sunny tomorrow morning. Dry, warm, and happy.",
        icon: CalendarCheck,
        accent: "border-emerald-200 bg-emerald-50/80 text-emerald-800",
        badge: "Delight Secured",
        badgeColor: "bg-emerald-100 text-emerald-800"
      }
    ]
  }

  const currentSteps = flows[activeTab]

  return (
    <section className="py-20 md:py-28 bg-[#FFFDF9] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Human Polish */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#EFEAE0] text-coral-600 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real-Time Travel Protection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 font-serif leading-[1.18]">
            Plans change. <br className="sm:hidden" />
            <span className="italic text-coral-500 font-normal">Your journey shouldn't fall apart.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5E6282] leading-relaxed">
            When disruptions strike, standard travel itineraries collapse into frantic phone calls and forfeited deposits. Navora catches anomalies instantly and reorganizes your day with zero friction.
          </p>

          {/* Interactive Scenario Tabs */}
          <div className="mt-8 inline-flex p-1.5 bg-[#FAF6F0] rounded-2xl border border-[#EFEAE0] shadow-soft-xs">
            <button
              type="button"
              onClick={() => setActiveTab('flight')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'flight'
                  ? 'bg-white text-navy-900 shadow-soft-sm'
                  : 'text-[#5E6282] hover:text-navy-900'
              }`}
            >
              Scenario A: Flight Delayed 2h+
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('weather')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'weather'
                  ? 'bg-white text-navy-900 shadow-soft-sm'
                  : 'text-[#5E6282] hover:text-navy-900'
              }`}
            >
              Scenario B: Sudden Monsoon Downpour
            </button>
          </div>
        </div>

        {/* 4-Step Adaptation Visual Language Flow */}
        <div className="relative">
          {/* Subtle connecting line across cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-rose-200 via-amber-200 via-coral-200 to-emerald-300 -translate-y-6 z-0" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
            >
              {currentSteps.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="h-full bg-white rounded-3xl border border-[#EFEAE0] shadow-soft-sm hover:shadow-soft-lg transition-all p-6 flex flex-col justify-between">
                      <div>
                        {/* Top Step + Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-serif font-bold text-muted-foreground">
                            Step {item.step}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 shadow-xs ${item.accent}`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <h3 className="font-serif font-bold text-base text-navy-900 mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-semibold text-coral-500 uppercase tracking-wide mb-2.5">
                          {item.subtitle}
                        </p>
                        <p className="text-xs text-[#5E6282] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Step bottom indicator */}
                      <div className="mt-5 pt-3.5 border-t border-[#F5F2EA] flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Human Intervention</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          0 Panic Calls
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Real-time Human Guarantee Callout Card */}
        <div className="mt-14 rounded-3xl bg-navy-900 text-white p-7 sm:p-10 border border-navy-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle warm glow in corner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-5 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-coral-400 shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-white">The Zero-Friction Travel Promise</h4>
              <p className="text-sm text-navy-200 mt-1.5 max-w-xl leading-relaxed">
                Whether it's monsoon clouds in Goa, delayed baggage at Delhi, or local road diversions in Jaipur — your vacation timeline automatically harmonizes in under 2 seconds.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 relative z-10">
            <div className="text-right">
              <p className="text-xs font-medium text-navy-200 uppercase tracking-wider">Average Re-route Speed</p>
              <p className="text-2xl font-serif font-bold text-honey-400">&lt; 1.8 Seconds</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
export default AdaptationFlow
