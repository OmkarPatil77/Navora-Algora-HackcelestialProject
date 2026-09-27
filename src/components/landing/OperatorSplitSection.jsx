import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Activity, Layers, ArrowUpRight, Compass, BellRing, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const OperatorSplitSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 md:py-28 bg-[#FAF6F0]/60 border-t border-[#F1ECE1]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-honey-100 text-honey-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Unified Travel Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 font-serif leading-[1.18]">
            Two connected experiences. <br />
            <span className="text-coral-500 italic font-normal">One intelligent engine.</span>
          </h2>
          <p className="mt-3 text-base text-[#5E6282]">
            Navora bridges the gap between individual travelers crafting bespoke holidays and agency operators managing complex fleets at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Traveler Side Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280 }}
            className="flex"
          >
            <div className="flex flex-col justify-between p-8 sm:p-10 bg-white border border-[#EFEAE0] shadow-soft-md rounded-3xl w-full">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 p-3 rounded-2xl bg-coral-50 border border-coral-200/60 flex items-center justify-center text-coral-600 shadow-xs">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-coral-600 bg-coral-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        For Travelers
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-navy-900 mt-1">Design your journey.</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#5E6282] leading-relaxed">
                  Experience spontaneous, stress-free travel planning from inspiration to live on-ground adaptation.
                </p>

                {/* Feature checklist */}
                <ul className="space-y-3.5 text-xs text-navy-900">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Tailored day-by-day itineraries based on personal vibe & budget</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Dynamic cost tracking and automatic route optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Instant automatic adaptation when flights, rain, or plans change</span>
                  </li>
                </ul>

                {/* Preview pill */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFEAE0] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-900 block font-serif">Goa 4D/3N Explorer</span>
                    <span className="text-muted-foreground text-[11px]">Budget ₹35,000 • 2 Travelers</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Ready to Explore
                  </span>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-[#F5F2EA]">
                <button
                  type="button"
                  onClick={() => navigate('/plan')}
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-warm-coral transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Traveler Experience</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Operator Side Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280 }}
            className="flex"
          >
            <div className="flex flex-col justify-between p-8 sm:p-10 bg-navy-900 text-white border border-navy-800 shadow-2xl rounded-3xl w-full relative overflow-hidden">
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-honey-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-honey-400 shadow-xs">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-honey-400 bg-honey-400/15 border border-honey-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        For Tour Operators
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-white mt-1">Orchestrate every moving part.</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-navy-200 leading-relaxed">
                  Real-time command center for tour operators and agencies to oversee multiple fleets, detect delays, and approve automated resolutions.
                </p>

                {/* Feature checklist */}
                <ul className="space-y-3.5 text-xs text-navy-200">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Live multi-group monitoring and guest status tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-honey-500/20 text-honey-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Proactive anomaly detection across flights, weather & local vendors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-coral-500/20 text-coral-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>1-Click incident recovery dispatch with instant partner synchronization</span>
                  </li>
                </ul>

                {/* Preview pill */}
                <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block font-serif">Operator Fleet Telemetry</span>
                    <span className="text-navy-300 text-[11px]">18 Active Tours • 1 Urgent Recovery Solved</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Live Stream
                  </span>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-navy-800 relative z-10">
                <button
                  type="button"
                  onClick={() => navigate('/operator')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Operator Command Center</span>
                  <ArrowUpRight className="w-4 h-4 text-honey-400" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
export default OperatorSplitSection
