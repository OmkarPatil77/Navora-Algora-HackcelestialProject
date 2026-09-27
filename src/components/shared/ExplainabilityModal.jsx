import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldAlert, Clock, ArrowRight, X, Layers, Lightbulb, Compass } from 'lucide-react';

/**
 * Universal Explainability Modal for Navora Decisions
 * Displays deterministic reasons, constraint satisfaction, and AI transparent provenance.
 */
export default function ExplainabilityModal({ isOpen, onClose, explanation }) {
  if (!isOpen || !explanation) return null;

  const {
    title = 'Why Navora made this decision',
    reason = '',
    factors = [],
    constraintsSatisfied = [],
    alternative = null,
    outcome = null,
    source = 'Based on your itinerary, timing and trip preferences.',
    category = 'decision'
  } = explanation;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-warm-ivory rounded-2xl shadow-2xl border border-charcoal/10 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 bg-warm-ivory border-b border-charcoal/10 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
                  Journey Rationale
                </span>
                <h3 className="font-serif text-lg font-bold text-charcoal leading-tight">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Primary Reason */}
            {reason && (
              <div className="p-3.5 bg-white/80 rounded-xl border border-charcoal/5 text-sm text-charcoal leading-relaxed">
                <p className="font-medium">{reason}</p>
              </div>
            )}

            {/* Key Factors */}
            {factors && factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-charcoal/60 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-terracotta" />
                  Key Factors & Constraints
                </h4>
                <div className="space-y-1.5">
                  {factors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-charcoal/80 bg-white/50 p-2 rounded-lg border border-charcoal/5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints Satisfied */}
            {constraintsSatisfied && constraintsSatisfied.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold tracking-wider text-charcoal/60 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  Constraints Satisfied
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {constraintsSatisfied.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative & Outcome */}
            {(alternative || outcome) && (
              <div className="p-3.5 bg-terracotta/5 border border-terracotta/15 rounded-xl space-y-2 text-xs">
                {alternative && (
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal/60 font-medium">Adapted Solution:</span>
                    <span className="font-bold text-terracotta">{alternative}</span>
                  </div>
                )}
                {outcome && (
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal/60 font-medium">Resulting Benefit:</span>
                    <span className="font-semibold text-emerald-700">{outcome}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with AI Source Transparency */}
          <div className="px-5 py-3.5 bg-charcoal/[0.03] border-t border-charcoal/10 flex items-center justify-between text-[11px] text-charcoal/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{source}</span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1 bg-charcoal text-warm-ivory rounded-lg text-xs font-medium hover:bg-charcoal/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
