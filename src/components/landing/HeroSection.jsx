import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import { LiveAdaptationModal } from './LiveAdaptationModal'

export const HeroSection = () => {
  const navigate = useNavigate()
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 bg-[#FFFDF9]">
      
      {/* Background soft ambient warm aura */}
      <div className="absolute top-0 right-0 -z-10 w-[620px] h-[620px] rounded-full bg-gradient-to-b from-[#FFF1DA]/90 via-[#FFE7C4]/50 to-transparent blur-3xl pointer-events-none transform translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 -z-10 w-[380px] h-[380px] rounded-full bg-coral-50/50 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Human Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 sm:space-y-7 text-left"
          >
            {/* Eyebrow: Matches user reference style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2"
            >
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-coral-500 font-sans">
                Best Destinations Around The World
              </span>
            </motion.div>

            {/* Main Headline: Warm serif with playful brush underline under "enjoy" */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold tracking-tight text-navy-900 font-serif leading-[1.12]">
              Travel,{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">enjoy</span>
                {/* Hand-drawn brush highlighter underline accent */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
                  className="absolute -bottom-1 sm:-bottom-2 -left-2 w-[112%] h-4 sm:h-5 text-coral-500 -z-0 pointer-events-none"
                  viewBox="0 0 250 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M3 13C60 4 150 2 245 12C180 18 80 17 20 15"
                    stroke="#DF6951"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </motion.svg>
              </span>
              <br />
              and live a new <br className="hidden sm:inline" />
              and full life
            </h1>

            {/* Supporting Copy: Thoughtful, airy, human-centered */}
            <p className="text-base sm:text-lg text-[#5E6282] leading-relaxed max-w-xl font-normal font-sans">
              Built for genuine spontaneous explorers. Navora crafts your dream itinerary around your pace, taste, and budget — with an intelligent safety net that gracefully adapts whenever flights, weather, or plans shift.
            </p>

            {/* CTAs: Warm Honey Button + Circular Coral Play Demo Button */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-2">
              {/* Primary CTA: Warm Honey / Amber button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/plan')}
                className="bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-xl shadow-warm-honey transition-all flex items-center gap-2 select-none"
              >
                <span>Find out more</span>
                <ArrowRight className="w-4 h-4 text-navy-950" />
              </motion.button>

              {/* Secondary CTA: Play Demo with circular coral button */}
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setDemoOpen(true)}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Pulsing ring aura */}
                  <span className="absolute w-12 h-12 rounded-full bg-coral-400/25 animate-ping" />
                  
                  {/* Play circle */}
                  <div className="w-12 h-12 rounded-full bg-coral-500 text-white flex items-center justify-center shadow-warm-coral transition-transform group-hover:bg-coral-600 relative z-10">
                    <Play className="w-4 h-4 fill-white ml-0.5 text-white" />
                  </div>
                </motion.div>

                <div className="text-left">
                  <span className="text-sm font-semibold text-[#5E6282] group-hover:text-navy-900 transition-colors block">
                    Play Demo
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Live dynamic adaptation
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Human-Touch Metrics */}
            <div className="pt-6 sm:pt-8 border-t border-[#F1ECE1] grid grid-cols-3 gap-3 sm:gap-6 text-left">
              <div>
                <p className="text-lg sm:text-xl font-bold text-navy-900 font-serif">100%</p>
                <p className="text-xs text-[#5E6282] mt-0.5">Dynamic Rerouting</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-navy-900 font-serif">Zero-Stress</p>
                <p className="text-xs text-[#5E6282] mt-0.5">Disruption Shield</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-navy-900 font-serif">Dual Care</p>
                <p className="text-xs text-[#5E6282] mt-0.5">Traveler & Local Hosts</p>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Authentic Traveler Visual + Organic Warm Blob + Airplanes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            {/* The Big Organic Warm Peach/Sand Blob (Matches reference shape aesthetic) */}
            <div className="absolute w-[92%] sm:w-[500px] h-[92%] sm:h-[500px] bg-[#FFF1DA] rounded-[80px_40px_100px_50px] -z-10 transform rotate-1 transition-all duration-700 pointer-events-none" />

            {/* Hand-drawn accent dots cluster behind */}
            <div className="absolute -top-4 -right-2 w-28 h-28 opacity-30 pointer-events-none bg-dot-pattern" />

            {/* Flying Paper Airplanes with curved dashed flight contrails */}
            {/* Airplane 1: Top flying towards right */}
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                x: [0, 4, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -top-4 right-10 sm:right-16 z-20 pointer-events-none"
            >
              {/* Airplane SVG */}
              <div className="relative">
                <svg className="w-12 h-12 text-[#24A69A] drop-shadow-sm transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.42 10.92l-18-9a1 1 0 0 0-1.39 1.13l2.42 7.25a1 1 0 0 0 .7.65L12 12l-6.85 1.05a1 1 0 0 0-.7.65l-2.42 7.25a1 1 0 0 0 1.39 1.13l18-9a1 1 0 0 0 0-1.78z" />
                </svg>
                {/* Dashed curved contrail */}
                <svg className="absolute -left-16 top-6 w-20 h-10 pointer-events-none text-sand-400" fill="none" viewBox="0 0 80 40">
                  <path d="M75 10 C50 15, 25 35, 5 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>
            </motion.div>

            {/* Airplane 2: Lower right flying outwards */}
            <motion.div
              animate={{ 
                y: [0, 7, 0],
                x: [0, -3, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-4 sm:-right-8 z-20 pointer-events-none"
            >
              <div className="relative">
                <svg className="w-10 h-10 text-[#4E71FF] drop-shadow-sm transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.42 10.92l-18-9a1 1 0 0 0-1.39 1.13l2.42 7.25a1 1 0 0 0 .7.65L12 12l-6.85 1.05a1 1 0 0 0-.7.65l-2.42 7.25a1 1 0 0 0 1.39 1.13l18-9a1 1 0 0 0 0-1.78z" />
                </svg>
                <svg className="absolute -left-12 -top-4 w-16 h-12 pointer-events-none text-sand-400" fill="none" viewBox="0 0 60 40">
                  <path d="M55 35 C40 20, 20 15, 5 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>
            </motion.div>

            {/* Main Visual: Happy Traveler Image */}
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white/40">
              <img
                src="/images/traveler-hero.jpg"
                alt="Joyful traveler sitting on luggage ready for a spontaneous journey"
                className="w-full h-auto object-cover object-top select-none transform hover:scale-102 transition-transform duration-500"
                loading="eager"
              />

              {/* Soft vignette at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 via-transparent to-transparent pointer-events-none" />
            </div>


            {/* Floating Card 3: Social Proof / Community Counter (Bottom-Right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-3 -right-2 sm:-right-4 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-sand-200 rounded-full px-3.5 py-1.5 shadow-soft-md z-20"
            >
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block h-6 w-6 rounded-full bg-coral-400 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">P</span>
                <span className="inline-block h-6 w-6 rounded-full bg-honey-400 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">R</span>
                <span className="inline-block h-6 w-6 rounded-full bg-emerald-400 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">A</span>
              </div>
              <span className="text-[11px] font-bold text-navy-900">
                1,200+ Journeys Adapted
              </span>
            </motion.div>

          </motion.div>

        </div>
      </div>

      {/* Interactive Live Demo Modal */}
      <LiveAdaptationModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

    </section>
  )
}
export default HeroSection
