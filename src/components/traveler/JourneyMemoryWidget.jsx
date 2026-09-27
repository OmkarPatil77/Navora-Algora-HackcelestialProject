import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, Compass, History } from 'lucide-react';
import { useTripPlan } from '../../context/TripPlanningContext';
import { getMemorySummaryInsights } from '../../services/journeyMemoryEngine';

export default function JourneyMemoryWidget() {
  const { journeyMemory } = useTripPlan();
  const [isExpanded, setIsExpanded] = useState(false);

  const insights = getMemorySummaryInsights(journeyMemory);
  const events = journeyMemory?.timeline || [];

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-charcoal/[0.01] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sand-100 border border-sand-300 text-terracotta-700 flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-charcoal">
                Trip Preferences & Memory
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sand-200 text-charcoal-800">
                Session Active
              </span>
            </div>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Learned preferences from your choices during this trip
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-terracotta hidden sm:inline-block">
            {insights.length} insights captured
          </span>
          <button className="p-1.5 rounded-lg text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="px-5 pb-4 pt-0">
        <div className="space-y-2">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-2.5 text-xs text-charcoal/80 bg-warm-ivory/60 p-2.5 rounded-xl border border-charcoal/5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{insight}</span>
            </motion.div>
          ))}
        </div>
        
        <p className="text-[11px] text-charcoal/50 italic mt-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
          This helps Navora fine-tune recommendations and recoveries for the rest of your trip.
        </p>
      </div>

      {/* Collapsible Timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-charcoal/10 bg-warm-ivory/30 px-5 py-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-charcoal/60" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
                Decision History ({events.length} events)
              </h4>
            </div>

            {events.length === 0 ? (
              <p className="text-xs text-charcoal/50 italic">No explicit decisions recorded yet.</p>
            ) : (
              <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-charcoal/10">
                {events.slice(-6).reverse().map((ev, i) => (
                  <div key={ev.id || i} className="relative flex items-start gap-3 pl-6 text-xs">
                    <span className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-terracotta ring-4 ring-warm-ivory" />
                    <div className="flex-1 bg-white p-2.5 rounded-lg border border-charcoal/5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-charcoal">{ev.label || ev.type}</span>
                        <span className="text-[10px] text-charcoal/40 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </div>
                      {ev.details && (
                        <p className="text-[11px] text-charcoal/70 mt-0.5">{ev.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-between text-[10px] text-charcoal/40">
              <span>Trip-scoped session storage</span>
              <span>Navora Contextual Intelligence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
