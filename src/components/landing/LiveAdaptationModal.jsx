import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, RefreshCw, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Plane, CloudRain, MapPin, Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const LiveAdaptationModal = ({ isOpen, onClose }) => {
  const [simulationState, setSimulationState] = useState('idle') // 'idle' | 'disrupted' | 'adapting' | 'resolved'
  const [activeScenario, setActiveScenario] = useState('flight') // 'flight' | 'rain'

  const resetDemo = () => {
    setSimulationState('idle')
  }

  const triggerSimulation = (scenario) => {
    setActiveScenario(scenario)
    setSimulationState('disrupted')
    setTimeout(() => {
      setSimulationState('adapting')
      setTimeout(() => {
        setSimulationState('resolved')
      }, 1200)
    }, 900)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden z-10 my-8"
        >
          {/* Top Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-sand-50 via-white to-amber-50/40 border-b border-sand-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-warm-coral">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-navy-900">Navora Live Demo</h3>
                  <Badge variant="secondary" size="sm">Live Preview</Badge>
                </div>
                <p className="text-xs text-muted-foreground">See how an itinerary dynamically recovers without human stress</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            
            {/* Scenario Picker */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2.5">
                1. Select a real-world disruption scenario:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => triggerSimulation('flight')}
                  disabled={simulationState === 'adapting'}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    activeScenario === 'flight' && simulationState !== 'idle'
                      ? 'border-coral-400 bg-coral-50/60 ring-2 ring-coral-400/30 shadow-soft-xs'
                      : 'border-sand-200 bg-sand-50/50 hover:bg-sand-100/70'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center shrink-0">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">Flight Delay (2h 15m)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      Air traffic in Mumbai delays arrival at Dabolim Airport.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('rain')}
                  disabled={simulationState === 'adapting'}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    activeScenario === 'rain' && simulationState !== 'idle'
                      ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/30 shadow-soft-xs'
                      : 'border-sand-200 bg-sand-50/50 hover:bg-sand-100/70'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">Sudden Monsoon Downpour</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      Outdoor Fontainhas heritage walk rained out at 16:00.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Timeline Simulator Display */}
            <div className="rounded-2xl border border-sand-200 bg-sand-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-coral-500" />
                  <span className="text-xs font-bold text-navy-900 font-serif">Goa Day 1 • Afternoon Timeline</span>
                </div>
                
                {/* State Badge */}
                <div>
                  {simulationState === 'idle' && (
                    <span className="text-[11px] font-semibold text-charcoal-600 bg-sand-100 px-2.5 py-0.5 rounded-full border border-sand-200">
                      Standard Itinerary
                    </span>
                  )}
                  {simulationState === 'disrupted' && (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Disruption Injected!
                    </span>
                  )}
                  {simulationState === 'adapting' && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-600" /> Syncing Schedule...
                    </span>
                  )}
                  {simulationState === 'resolved' && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Itinerary Harmonized (1.2s)
                    </span>
                  )}
                </div>
              </div>

              {/* Stops list */}
              <div className="space-y-2 pt-1">
                {/* Item 1 */}
                <motion.div
                  layout
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    simulationState === 'disrupted' || simulationState === 'adapting'
                      ? 'bg-rose-50/70 border-rose-200'
                      : simulationState === 'resolved'
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-white border-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[11px] font-bold text-charcoal-600 bg-sand-100 px-2 py-1 rounded">
                      {simulationState === 'resolved' ? '15:15' : '13:00'}
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">
                        {activeScenario === 'flight' ? 'Airport Pickup & Hotel Check-in' : 'Hotel Rest & Refresh'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {simulationState === 'resolved' 
                          ? 'Driver notified & rescheduled automatically • No wait fee'
                          : 'Private sedan with Goa Chauffeur Services'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold ${simulationState === 'resolved' ? 'text-emerald-700' : 'text-charcoal-500'}`}>
                    {simulationState === 'resolved' ? 'Protected' : 'On Track'}
                  </span>
                </motion.div>

                {/* Item 2 */}
                <motion.div
                  layout
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    simulationState === 'disrupted'
                      ? 'bg-amber-50/70 border-amber-200'
                      : simulationState === 'resolved'
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-white border-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[11px] font-bold text-charcoal-600 bg-sand-100 px-2 py-1 rounded">
                      {simulationState === 'resolved' 
                        ? (activeScenario === 'flight' ? 'Day 2 (10:00)' : '16:30')
                        : '17:00'}
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">
                        {activeScenario === 'flight' 
                          ? 'Mandovi River Sunset Cruise'
                          : (simulationState === 'resolved' ? 'Mario Miranda Art Gallery & Indoor Tea' : 'Fontainhas Walking Tour')}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {simulationState === 'resolved'
                          ? (activeScenario === 'flight' ? 'Swapped to Day 2 morning slot • Ticket validity preserved' : 'Swapped outdoor walk for indoor cultural gallery & heritage tea')
                          : 'Pre-booked 90-minute experience'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold ${simulationState === 'resolved' ? 'text-emerald-700 font-bold' : 'text-charcoal-500'}`}>
                    {simulationState === 'resolved' ? 'Optimized' : 'Confirmed'}
                  </span>
                </motion.div>

                {/* Item 3 */}
                <motion.div
                  layout
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    simulationState === 'resolved' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[11px] font-bold text-charcoal-600 bg-sand-100 px-2 py-1 rounded">
                      {simulationState === 'resolved' ? '20:30' : '19:45'}
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Dinner at Viva Panjim (Authentic Goan)</p>
                      <p className="text-[11px] text-muted-foreground">
                        {simulationState === 'resolved' ? 'Table reservation delayed 45 mins • Chef notified' : 'Table confirmed for 2'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold ${simulationState === 'resolved' ? 'text-emerald-700' : 'text-charcoal-500'}`}>
                    {simulationState === 'resolved' ? 'Confirmed' : 'Reserved'}
                  </span>
                </motion.div>
              </div>

              {/* Result explanation box */}
              {simulationState === 'resolved' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Total Stress Relieved: 100%</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      No calls to hotel, driver, or cruise vendor required. Zero cancellation fees. Enjoy your trip with total peace of mind.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDemo}
                className="text-xs text-muted-foreground hover:text-navy-900"
              >
                Reset Simulator
              </Button>
              <div className="flex gap-2.5">
                <Button
                  size="md"
                  onClick={onClose}
                  className="bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold px-6 shadow-warm-honey"
                >
                  Close & Plan Trip
                </Button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default LiveAdaptationModal
