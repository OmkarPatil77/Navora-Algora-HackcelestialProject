import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plane, Clock, AlertTriangle, CheckCircle2, ArrowRight, 
  Sparkles, RefreshCw, MapPin, Phone, ShieldCheck, Check, 
  Navigation, RotateCcw, AlertOctagon, Car, Hotel, Compass, Utensils,
  CloudRain, Eye
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { DisruptionSimulationModal } from '@/components/traveler/DisruptionSimulationModal'
import { DisruptionImpactBanner } from '@/components/traveler/DisruptionImpactBanner'
import { RecoveryPlanCard } from '@/components/traveler/RecoveryPlanCard'
import { RecoveryPreviewModal } from '@/components/traveler/RecoveryPreviewModal'
import { DisruptionEventLogWidget } from '@/components/traveler/DisruptionEventLogWidget'
import JourneyHealthCard from '@/components/traveler/JourneyHealthCard'
import JourneyMemoryWidget from '@/components/traveler/JourneyMemoryWidget'
import ExplainabilityModal from '@/components/shared/ExplainabilityModal'
import PageTransition from '@/components/motion/PageTransition'
import { WeatherTwinDashboardModal } from '@/components/traveler/itinerary/WeatherTwinDashboardModal'
import { 
  explainDisruptionImpact, 
  explainRecoveryDecision, 
  explainProtectedNode 
} from '@/services/decisionExplanationEngine'

export const Trip = () => {
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    disruptionEventLog,
    triggerDisruption,
    applyDisruptionRecovery,
    resetDisruptionSimulation,
    getDisruptionImpactForNode,
    journeyHealth,
    journeyMemory,
    setItinerary
  } = useTripPlan()

  const [isSimModalOpen, setIsSimModalOpen] = useState(false)
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false)
  const [weatherAlertDismissed, setWeatherAlertDismissed] = useState(false)
  const [previewPlan, setPreviewPlan] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [toastMessage, setToastMessage] = useState(null)
  const [explainModalData, setExplainModalData] = useState(null)

  // Determine current telemetry status
  const currentStatus = activeDisruption && !appliedRecovery 
    ? 'disruption' 
    : appliedRecovery 
    ? 'active' 
    : 'active'

  const statusLabel = activeDisruption && !appliedRecovery
    ? 'DISRUPTION ACTIVE'
    : appliedRecovery
    ? 'JOURNEY ADAPTED'
    : 'TRIP ON TRACK'

  const day1 = itinerary?.days?.find(d => d.day === 1) || itinerary?.days?.[0]
  const day1Items = day1?.items || []

  // Simulated Animation Handler
  const handleTriggerSimulation = (delayMinutes) => {
    setIsAnalyzing(true)
    setAnalysisStep(1)

    setTimeout(() => setAnalysisStep(2), 350)
    setTimeout(() => setAnalysisStep(3), 700)
    setTimeout(() => setAnalysisStep(4), 1050)
    setTimeout(() => {
      triggerDisruption(delayMinutes)
      setIsAnalyzing(false)
      setAnalysisStep(0)
      setToastMessage(`Synthetic Flight Delay (+${delayMinutes}m) activated. Navora analyzed dependencies.`)
      setTimeout(() => setToastMessage(null), 4000)
    }, 1400)
  }

  const handleApplyRecovery = (planId) => {
    const success = applyDisruptionRecovery(planId)
    if (success) {
      setToastMessage("Your itinerary has been adapted. All schedule conflicts resolved.")
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const handleReset = () => {
    resetDisruptionSimulation()
    setToastMessage("Simulation reset. Your original baseline itinerary has been restored.")
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Helper for timeline icon
  const getNodeIcon = (type) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-terracotta-600" />
      case 'transport':
        return <Car className="w-4 h-4 text-sky-600" />
      case 'hotel':
        return <Hotel className="w-4 h-4 text-amber-600" />
      case 'experience':
        return <Compass className="w-4 h-4 text-emerald-600" />
      case 'meal':
        return <Utensils className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-charcoal-500" />
    }
  }

  return (
    <PageTransition>
      <div className="py-10 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-charcoal-900 text-white shadow-soft-xl border border-charcoal-700 flex items-center gap-3 text-xs max-w-md"
              >
                <Sparkles className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Header & Status Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    activeDisruption && !appliedRecovery ? "bg-rose-400" : "bg-emerald-400"
                  } opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    activeDisruption && !appliedRecovery ? "bg-rose-500" : "bg-emerald-500"
                  }`}></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                  Tour in Progress
                </span>
                <span className="text-xs text-muted-foreground">• {itinerary?.tripId || 'TS-108'}</span>
                <span className="text-xs text-muted-foreground">• {tripPreferences.destination?.name || 'Goa'} · Day 1 of 4</span>
                <span className="text-xs text-muted-foreground">• {tripPreferences.travelers?.total || 2} Travelers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-950">
                Live Journey
              </h1>
            </div>

            {/* Action Bar */}
            <div className="flex items-center flex-wrap gap-2.5">
              <StatusIndicator
                status={currentStatus}
                label={statusLabel}
                pulse={activeDisruption && !appliedRecovery}
              />

              {(activeDisruption || appliedRecovery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs border-sand-300 hover:bg-sand-100"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset Simulation
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => setIsSimModalOpen(true)}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs text-xs"
                leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
              >
                Simulate Disruption
              </Button>
            </div>
          </div>

          {/* Dynamic Journey Health Card */}
          <JourneyHealthCard />

          {/* TRAVELER MOBILE WEATHER ALERT (Requirement 12) */}
          {!weatherAlertDismissed && (
            <Card className="p-5 sm:p-6 bg-gradient-to-r from-sky-950 via-slate-900 to-navy-950 text-white border-2 border-amber-400 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 text-xl animate-pulse">
                    🌧️
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        Weather disruption detected
                      </span>
                      <span className="text-xs text-amber-300 font-mono">
                        Live Forecast: Heavy Rainfall Detected (~80mm)
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      Heavy rainfall may affect 3 activities in your itinerary
                    </h3>
                    <p className="text-xs text-sand-200 leading-relaxed max-w-2xl">
                      Simulated coastal squall affects outdoor activities. NAVORA Digital Twin has calculated risk, secondary transit delays, and an adaptive replan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                    Risk: HIGH (85%)
                  </span>
                </div>
              </div>

              {/* Detail Grid: Affected, Alternatives, Expected Changes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
                    Affected Activity
                  </span>
                  <p className="font-semibold text-white">Baga Beach Water Sports</p>
                  <span className="text-[11px] text-rose-300 block">Wave swell & rain exposure (85% risk)</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
                    Alternative Activity
                  </span>
                  <p className="font-semibold text-white">Fontainhas Latin Quarter Walk</p>
                  <span className="text-[11px] text-emerald-300 block">Sheltered heritage & culinary tasting</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
                    Expected Changes
                  </span>
                  <p className="font-semibold text-white">Transit +30m & Dinner Shift</p>
                  <span className="text-[11px] text-sand-300 block">Buffers downstream reservation timing</span>
                </div>
              </div>

              {/* AI Explanation snippet */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Gemini Explanation:</strong> Replacing water sports with Fontainhas preserves your cultural interest DNA with zero rain hazard, saves ₹600, and ensures smooth arrival.
                </span>
              </div>

              {/* Buttons: View Impact, View Alternatives, Apply New Plan, Keep Current Plan */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsWeatherModalOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold text-xs"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Impact
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsWeatherModalOpen(true)}
                    className="border-white/30 text-white hover:bg-white/10 text-xs font-semibold"
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  >
                    View Alternatives
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setWeatherAlertDismissed(true)}
                    className="text-xs text-sand-300 hover:text-white"
                  >
                    Keep Current Plan
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsWeatherModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs px-4"
                    rightIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Apply New Plan
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Live Analysis Processing Animation */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 rounded-2xl bg-charcoal-950 text-white border border-charcoal-800 shadow-soft-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-terracotta-400 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta-400">
                      Analyzing Schedule Dependencies
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-400 font-mono">Live Check</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3 rounded-lg border transition-all ${
                    analysisStep >= 1 ? "bg-charcoal-900 border-terracotta-500/50 text-white" : "border-charcoal-800 text-charcoal-500"
                  }`}>
                    <span className="block font-bold">1. Flight Touchdown Shift</span>
                    <span className="text-[11px] text-charcoal-400">09:20 → 10:50 (+90 min)</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${
                    analysisStep >= 2 ? "bg-charcoal-900 border-amber-500/50 text-white" : "border-charcoal-800 text-charcoal-500"
                  }`}>
                    <span className="block font-bold">2. Dependency Check</span>
                    <span className="text-[11px] text-charcoal-400">Airport transit & hotel shift</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${
                    analysisStep >= 3 ? "bg-charcoal-900 border-rose-500/50 text-white" : "border-charcoal-800 text-charcoal-500"
                  }`}>
                    <span className="block font-bold">3. Conflict Detection</span>
                    <span className="text-[11px] text-charcoal-400">Scuba dive time window overlap</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${
                    analysisStep >= 4 ? "bg-charcoal-900 border-emerald-500/50 text-white" : "border-charcoal-800 text-charcoal-500"
                  }`}>
                    <span className="block font-bold">4. Recovery Options</span>
                    <span className="text-[11px] text-charcoal-400">3 valid options calculated</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Disruption Active Impact Banner */}
        {activeDisruption && !appliedRecovery && disruptionAnalysis && (
          <DisruptionImpactBanner
            disruption={activeDisruption}
            analysis={disruptionAnalysis}
            onOpenRecovery={() => {
              const el = document.getElementById('recovery-plans-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        )}

        {/* Applied Recovery Success Banner */}
        {appliedRecovery && (
          <Card className="p-5 sm:p-6 bg-emerald-50/70 border-emerald-200 shadow-soft-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">Adapted & Synchronized</Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      Applied at {itinerary?.adaptedAt || 'Just now'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-charcoal-950 mt-0.5">
                    {appliedRecovery.title} Applied
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const exp = explainRecoveryDecision(appliedRecovery, activeDisruption)
                    setExplainModalData(exp)
                  }}
                  className="text-xs bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold"
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Why this change?
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs bg-white border-sand-200"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Restore Original Itinerary
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Budget Outcome
                </span>
                <span className="font-bold text-emerald-800 text-sm">
                  {appliedRecovery.costImpact}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Flexibility Buffer
                </span>
                <span className="font-bold text-emerald-800 text-sm">
                  {appliedRecovery.flexibilityImpact}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Schedule Integrity
                </span>
                <span className="font-bold text-emerald-800 text-sm">
                  Zero Conflicts • Evening Protected
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* 3 Recovery Plans Section (When Disruption Active or Reviewing) */}
        {activeDisruption && (
          <div id="recovery-plans-section" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                    Adjustments Ready
                  </span>
                  <Badge variant="outline" size="sm">3 Options Available</Badge>
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal-950">
                  {appliedRecovery ? "Recovery Strategies" : "Select Your Preferred Recovery Option"}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                3 options to keep your trip on track
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recoveryPlans.map((plan) => (
                <RecoveryPlanCard
                  key={plan.id}
                  plan={plan}
                  isApplied={appliedRecovery?.id === plan.id}
                  onPreview={(p) => setPreviewPlan(p)}
                  onApply={handleApplyRecovery}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid: Live Timeline Breakdown (Left) + Operations Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Day 1 Live Timeline with Visual Impact Nodes (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white border-sand-200 shadow-soft-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal-950">
                    Day 1 Live Journey Timeline
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connected dependency graph with live impact telemetry
                  </p>
                </div>
                <Badge variant="outline" size="sm">
                  {day1Items.length} Connected Nodes
                </Badge>
              </div>

              {/* Timeline Sequence */}
              <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-sand-200">
                {day1Items.map((item, idx) => {
                  const impact = getDisruptionImpactForNode(item.id)
                  const isFlight = item.type === 'flight'
                  const isConflict = impact?.status === 'CONFLICT'
                  const isImpacted = impact?.status === 'IMPACTED'
                  const isProtected = impact?.status === 'PROTECTED'

                  return (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className={`relative pl-10 p-4 rounded-xl border transition-all ${
                        isConflict
                          ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300"
                          : isImpacted
                          ? "bg-amber-50/60 border-amber-200"
                          : isProtected
                          ? "bg-emerald-50/40 border-emerald-200"
                          : "bg-sand-50/40 border-sand-200 hover:bg-sand-50"
                      }`}
                    >
                      {/* Node Circle */}
                      <div className={`absolute left-2.5 top-4 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                        isConflict
                          ? "border-rose-600 bg-rose-50"
                          : isImpacted
                          ? "border-amber-500 bg-amber-50"
                          : isProtected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-charcoal-400"
                      }`} />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-white border border-sand-200">
                              {getNodeIcon(item.type)}
                            </span>
                            <span className="font-bold text-sm text-charcoal-950 font-serif">
                              {item.title}
                            </span>
                          </div>

                          <p className="text-xs text-charcoal-600">
                            {item.location || item.type}
                            {item.durationMinutes ? ` • ${Math.floor(item.durationMinutes/60)}h ${item.durationMinutes%60}m` : ''}
                          </p>

                          {impact?.rationale && (
                            <p className="text-[11px] font-medium text-charcoal-700 italic pt-0.5">
                              ↳ {impact.rationale}
                            </p>
                          )}
                        </div>

                        {/* Right: Time Slot & Impact Badge */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                          <div className="font-mono text-xs font-bold text-charcoal-900">
                            {item.startTime} – {item.endTime}
                          </div>

                          {isConflict && (
                            <button
                              type="button"
                              onClick={() => setExplainModalData(explainDisruptionImpact(item, activeDisruption))}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <AlertOctagon className="w-3 h-3" /> Conflict • Why?
                            </button>
                          )}

                          {isImpacted && (
                            <button
                              type="button"
                              onClick={() => setExplainModalData(explainDisruptionImpact(item, activeDisruption))}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              ⚠️ Impacted • Why?
                            </button>
                          )}

                          {isProtected && (
                            <button
                              type="button"
                              onClick={() => setExplainModalData(explainProtectedNode(item, appliedRecovery))}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              🟢 Protected • Why?
                            </button>
                          )}

                          {!impact && appliedRecovery && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Synchronized
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Operations Telemetry Log + Journey Memory + Concierge Info (1 col) */}
          <div className="space-y-6">
            
            {/* Live Event Log */}
            <DisruptionEventLogWidget logs={disruptionEventLog} />

            {/* Journey Memory Widget */}
            <JourneyMemoryWidget />

            {/* Assigned Transits & Concierge Contact Card */}
            <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-4">
              <h3 className="font-serif font-bold text-sm text-charcoal-950">
                Assigned Transits & Concierge
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-sand-50 border border-sand-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal-900">Airport Pickup Cab</span>
                    <Badge variant={activeDisruption && !appliedRecovery ? "warning" : "success"} size="sm">
                      {activeDisruption && !appliedRecovery ? "Delay Re-timing" : "Assigned"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Innova Crysta • GA-03-Z-8891</p>
                  <p className="text-charcoal-800 font-medium">Driver: Rajesh Naik (+91 98221 44021)</p>
                </div>

                <div className="p-3 rounded-lg bg-sand-50 border border-sand-200 space-y-1">
                  <span className="font-semibold text-charcoal-900 block">Navora Operator Mesh</span>
                  <p className="text-muted-foreground text-[11px]">Real-time synchronization with local driver dispatch and hotel reception.</p>
                </div>
              </div>
            </Card>

            {/* Guarantee Card */}
            <Card className="p-5 bg-charcoal-950 text-white border-charcoal-800 space-y-2.5">
              <div className="flex items-center gap-2 text-terracotta-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Friction Guarantee</span>
              </div>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                All rescheduling notifications, gate re-timings, and vendor slot swaps are automatically negotiated by Navora's operations engine with zero cancellation penalties.
              </p>
            </Card>

          </div>

        </div>

        {/* Simulation Launcher Modal */}
        <DisruptionSimulationModal
          open={isSimModalOpen}
          onOpenChange={setIsSimModalOpen}
          onTriggerSimulation={handleTriggerSimulation}
        />

        {/* Preview Changes Modal */}
        <RecoveryPreviewModal
          open={Boolean(previewPlan)}
          onOpenChange={(isOpen) => !isOpen && setPreviewPlan(null)}
          plan={previewPlan}
          currentItinerary={itinerary}
          onApplyPlan={handleApplyRecovery}
        />

        {/* Decision Explainability Modal */}
        <ExplainabilityModal
          isOpen={Boolean(explainModalData)}
          onClose={() => setExplainModalData(null)}
          explanation={explainModalData}
        />

        {/* Weather Twin Dashboard & What-If Simulator Modal */}
        <WeatherTwinDashboardModal
          isOpen={isWeatherModalOpen}
          onClose={() => setIsWeatherModalOpen(false)}
          itinerary={itinerary}
          tripPreferences={tripPreferences}
          onApplyWeatherChanges={(analysis, rec, adaptedItinerary) => {
            if (adaptedItinerary) {
              setItinerary(adaptedItinerary)
            }
            setIsWeatherModalOpen(false)
            setWeatherAlertDismissed(true)
            setToastMessage(`✓ Weather adaptation applied: Water Sports replaced with Fontainhas Heritage Walk.`)
            setTimeout(() => setToastMessage(null), 4500)
          }}
        />

        </div>
      </div>
    </PageTransition>
  )
}

export default Trip
