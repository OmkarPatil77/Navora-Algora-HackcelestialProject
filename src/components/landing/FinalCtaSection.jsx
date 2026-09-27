import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, MapPin, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const FinalCtaSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FAF6F0] border-t border-[#F1ECE1]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Playful Floating Paper Airplane */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="mx-auto w-14 h-14 rounded-2xl bg-coral-50 border border-coral-200/80 flex items-center justify-center text-coral-500 shadow-soft-sm mb-6"
        >
          <svg className="w-7 h-7 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </motion.div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EFEAE0] text-coral-600 text-xs font-bold uppercase tracking-wider shadow-soft-xs mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Spontaneous Travel, Reimagined</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-navy-900 leading-[1.15]">
          Ready to experience a journey <br />
          <span className="text-coral-500 italic font-normal">that breathes with you?</span>
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[#5E6282] max-w-xl mx-auto leading-relaxed">
          Tell us where you want to go, set your budget, and let Navora craft a resilient itinerary that adapts to every unpredictable moment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/plan')}
            className="w-full sm:w-auto bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold text-base px-9 py-4 rounded-2xl shadow-warm-honey transition-all flex items-center justify-center gap-2.5"
          >
            <span>Plan My Trip Now</span>
            <ArrowRight className="w-4 h-4 text-navy-950" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/itinerary')}
            className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] text-navy-900 border border-[#EFEAE0] font-bold text-base px-8 py-4 rounded-2xl shadow-soft-xs transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-coral-500" />
            <span>View Itinerary</span>
          </motion.button>
        </div>

        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5E6282]">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-coral-500" />
            Goa • Rajasthan • Kerala & beyond
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="font-handwriting text-base text-coral-600 font-bold">
            Zero setup friction ~ Free to start
          </span>
        </div>

      </div>
    </section>
  )
}
export default FinalCtaSection
