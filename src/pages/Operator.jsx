import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Users, Store, ShieldAlert, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, TrendingUp, 
  Sparkles, Plane, RotateCcw, Eye, Compass, Phone, Check, RefreshCw
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { initialOperatorKPIs, initialOperatorTours } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { OperatorImpactGraph } from '@/components/operator/OperatorImpactGraph'
import { AffectedOperationsTable } from '@/components/operator/AffectedOperationsTable'
import { VendorImpactPanel } from '@/components/operator/VendorImpactPanel'
import { OperatorRecoveryPanel } from '@/components/operator/OperatorRecoveryPanel'
import { OperatorAttentionQueue } from '@/components/operator/OperatorAttentionQueue'
import { OperatorEventTimeline } from '@/components/operator/OperatorEventTimeline'
import OperatorJourneyHealth from '@/components/operator/OperatorJourneyHealth'
import { RecoveryPreviewModal } from '@/components/traveler/RecoveryPreviewModal'
import { WeatherTwinDashboardModal } from '@/components/traveler/itinerary/WeatherTwinDashboardModal'
import PageTransition from '@/components/motion/PageTransition'

export const Operator = () => {
  const navigate = useNavigate()
  const {
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    itinerary,
    operatorVendors,
    operatorAttentionItems,
    disruptionEventLog,
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    triggerDisruption,
    resetDisruptionSimulation
  } = useTripPlan()

  const [previewPlan, setPreviewPlan] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [showWeatherTwinModal, setShowWeatherTwinModal] = useState(false)

  // Dynamic KPI numbers based on active state
  const openActionsCount = operatorAttentionItems?.filter(i => i.status === 'pending').length || 0
  const activeDisruptionsCount = activeDisruption && !appliedRecovery ? 1 : 0
  const vendorConfirmationPct = Math.round(
    ((operatorVendors?.filter(v => v.status === 'confirmed').length || 5) / (operatorVendors?.length || 6)) * 100
  )

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleApplyRecovery = (planId) => {
    const success = applyDisruptionRecovery(planId)
    if (success) {
      showToast("Recovery strategy applied. Vendor allocations & traveler itinerary updated.")
    }
  }

  const handleConfirmVendor = (vendorId, note) => {
    confirmOperatorVendor(vendorId, note)
    showToast(`Vendor ${vendorId} confirmed and schedule verified.`)
  }

  const handleSendNotification = (tourId) => {
    sendOperatorTravelerNotification(tourId)
    showToast(`Simulated traveler notification dispatched to Tour ${tourId}.`)
  }

  const handleResolveItem = (itemId) => {
    resolveOperatorAttentionItem(itemId)
    showToast("Attention item acknowledged and marked resolved.")
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-charcoal-900 text-white shadow-soft-xl border border-charcoal-700 flex items-center gap-3 text-xs max-w-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Command Center Header */}
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
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Operations Command
              </span>
              <span className="text-xs text-muted-foreground">• Active Fleet Monitor</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-950">
              Operations Command Center
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              Monitor active journeys, coordinate vendors and resolve disruptions before they affect travelers.
            </p>
          </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {activeDisruption && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetDisruptionSimulation()}
              className="text-xs bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Simulation
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => navigate('/operator/tours')}
            className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs shadow-soft-xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All 12 Tours
          </Button>
        </div>
      </div>

      {/* 2. KPI Strip (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Active Tours</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">12</p>
          <p className="text-[11px] text-emerald-700 font-medium">Across 5 Hubs</p>
        </Card>

        <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Travelers Today</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">28</p>
          <p className="text-[11px] text-sky-700 font-medium">Live Guests Monitored</p>
        </Card>

        <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Vendor Fidelity</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{vendorConfirmationPct}%</p>
          <p className="text-[11px] text-emerald-700 font-medium">Allocations Confirmed</p>
        </Card>

        <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Open Actions</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{openActionsCount}</p>
          <p className="text-[11px] text-amber-700 font-medium">In Attention Queue</p>
        </Card>

        <Card className={`p-4 border shadow-soft-xs space-y-1 transition-all ${
          activeDisruptionsCount > 0
            ? "bg-rose-50/80 border-rose-300 ring-1 ring-rose-300"
            : "bg-white border-sand-200"
        }`}>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Active Disruptions</span>
            <AlertTriangle className={`w-4 h-4 ${activeDisruptionsCount > 0 ? "text-rose-600 animate-pulse" : "text-emerald-600"}`} />
          </div>
          <p className={`text-2xl sm:text-3xl font-bold font-serif ${activeDisruptionsCount > 0 ? "text-rose-950" : "text-charcoal-950"}`}>
            {activeDisruptionsCount}
          </p>
          <p className={`text-[11px] font-medium ${activeDisruptionsCount > 0 ? "text-rose-800" : "text-emerald-700"}`}>
            {activeDisruptionsCount > 0 ? "Tour GOA-2048 Delay" : "0 Unresolved"}
          </p>
        </Card>
      </div>

      {/* ⚠️ WEATHER TWIN OPERATOR ALERT BANNER (Requirement 13) */}
      <Card className="p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-sky-950 text-white border border-amber-500/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xl animate-pulse">
              🌧️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  WEATHER TWIN ALERT
                </span>
                <span className="text-xs text-amber-300/80">Trip: Goa Adventure — GOA-2048</span>
              </div>
              <h3 className="text-lg font-bold font-serif text-amber-100 flex items-center gap-2 mt-0.5">
                Dynamic Weather Impact Monitoring Active
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-sans font-semibold border border-rose-400/30">
                  Risk: HIGH
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowWeatherTwinModal(true)}
              className="border-amber-400/40 text-amber-200 hover:bg-amber-500/20 text-xs font-semibold"
            >
              🌧️ Simulate Impact
            </Button>
            <Button
              size="sm"
              onClick={() => setShowWeatherTwinModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              📡 View Impact Radius & Replan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
            <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider block">Direct & Indirect Affected Entities</span>
            <ul className="space-y-1 text-slate-300">
              <li className="flex items-center gap-2">🔴 <span className="font-semibold text-white">Baga Water Sports</span> — Disruption probability 87% (High Rain Sensitivity)</li>
              <li className="flex items-center gap-2">🟠 <span className="font-semibold text-white">Transport Route 2</span> — Estimated delay 25–40 min</li>
              <li className="flex items-center gap-2">🟡 <span className="font-semibold text-white">Beach Shack Restaurant</span> — Reservation timing shift requested</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
            <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider block">Estimated Cascade Impact Summary</span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-rose-950/40 p-2 rounded border border-rose-800/40">
                <span className="text-rose-400 text-base font-bold block">2</span>
                <span className="text-[10px] text-rose-200">Activities Disrupted</span>
              </div>
              <div className="bg-amber-950/40 p-2 rounded border border-amber-800/40">
                <span className="text-amber-400 text-base font-bold block">1</span>
                <span className="text-[10px] text-amber-200">Transport Delay</span>
              </div>
              <div className="bg-sky-950/40 p-2 rounded border border-sky-800/40">
                <span className="text-sky-400 text-base font-bold block">1</span>
                <span className="text-[10px] text-sky-200">Timing Change</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Real-time Journey Health Assessment for Active Fleet */}
      <OperatorJourneyHealth tourId="GOA-2048" />

      {/* 3. Hero Live Operations Panel for Tour GOA-2048 */}
      <Card className="p-6 bg-white border-sand-200 shadow-soft-md space-y-6 relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta-500 via-amber-500 to-emerald-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sand-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-charcoal-900 text-white">
                TOUR GOA-2048
              </span>
              <span className="text-xs text-muted-foreground">Goa Coastal Escape • 2 Travelers (Aryan & Riya) • 4D / 3N</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-950">
              Live Tour Operations: Goa Hub
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <StatusIndicator
              status={activeDisruption && !appliedRecovery ? "disruption" : appliedRecovery ? "active" : "active"}
              label={activeDisruption && !appliedRecovery ? "DISRUPTION ACTIVE" : appliedRecovery ? "JOURNEY ADAPTED" : "ON TRACK"}
              pulse={activeDisruption && !appliedRecovery}
            />

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/operator/tours/GOA-2048')}
              className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Tour Control Details
            </Button>
          </div>
        </div>

        {/* Disruption Context Banner if Active */}
        {activeDisruption && (
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900">
                    Synthetic Disruption Detected
                  </span>
                  <span className="text-xs text-rose-800 font-semibold">• Flight 6E-204 (+90m Delay)</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">
                  Inbound flight <strong>Mumbai (BOM) → Goa (GOI)</strong> delayed from <strong>09:20</strong> to <strong>10:50</strong> (touchdown <strong>12:05</strong>).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  const el = document.getElementById('operator-recovery-section')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs shrink-0"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Review Recovery Solution
              </Button>
            </div>

            {/* Derived Stats */}
            {disruptionAnalysis && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-rose-200/80 text-xs">
                <div className="p-2 rounded-lg bg-white/80 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Schedule Conflicts</span>
                  <span className="font-bold text-rose-950 font-serif text-sm">
                    {disruptionAnalysis.counts?.conflicts || 1} Activity (Scuba Dive)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white/80 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Downstream Shifts</span>
                  <span className="font-bold text-amber-950 font-serif text-sm">
                    {disruptionAnalysis.counts?.impacted || 2} Transit & Check-in
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white/80 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Protected Bookings</span>
                  <span className="font-bold text-emerald-950 font-serif text-sm">
                    {disruptionAnalysis.counts?.protected || 2} Evening Cruise & Dinner
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white/80 border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-800 uppercase block">Flexible Blocks</span>
                  <span className="font-bold text-sky-950 font-serif text-sm">
                    {disruptionAnalysis.counts?.flexible || 2} Lunch & Rest Buffers
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 4. Causal Disruption Impact Graph */}
      {activeDisruption && (
        <OperatorImpactGraph
          disruption={activeDisruption}
          analysis={disruptionAnalysis}
          appliedRecovery={appliedRecovery}
        />
      )}

      {/* 5. AI Recovery Recommendation Panel */}
      <OperatorRecoveryPanel
        activeDisruption={activeDisruption}
        recoveryPlans={recoveryPlans}
        appliedRecovery={appliedRecovery}
        onPreviewPlan={(plan) => setPreviewPlan(plan)}
        onApplyPlan={handleApplyRecovery}
      />

      {/* 6. Affected Operations Timetable */}
      <AffectedOperationsTable
        itinerary={itinerary}
        disruption={activeDisruption}
        analysis={disruptionAnalysis}
        appliedRecovery={appliedRecovery}
      />

      {/* 7. Vendor Coordination & Attention Queue (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Vendor Impact Panel (2 cols) */}
        <div className="lg:col-span-2">
          <VendorImpactPanel
            vendors={operatorVendors}
            onConfirmVendor={handleConfirmVendor}
          />
        </div>

        {/* Right: Operator Attention Queue (1 col) */}
        <div className="space-y-6">
          <OperatorAttentionQueue
            items={operatorAttentionItems}
            onConfirmVendor={handleConfirmVendor}
            onResolveItem={handleResolveItem}
            onSendNotification={handleSendNotification}
          />

          <OperatorEventTimeline events={disruptionEventLog} />
        </div>
      </div>

      {/* 8. Today's Tours Summary */}
      <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sand-100">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950">
              Today's Tour Operations Roster
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time monitoring across Indian travel corridors
            </p>
          </div>
          <Badge variant="outline" size="sm">
            12 Scheduled Tours
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-sand-200/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-sand-50/50">
                <th className="py-2.5 px-3">Tour ID</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Guests</th>
                <th className="py-2.5 px-3">Dates</th>
                <th className="py-2.5 px-3">Lead Guide</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {initialOperatorTours.map((tour, idx) => {
                const isDisrupted = tour.id === 'GOA-2048' && activeDisruption && !appliedRecovery
                const isAdapted = tour.id === 'GOA-2048' && appliedRecovery

                return (
                  <tr
                    key={tour.id}
                    onClick={() => navigate(`/operator/tours/${tour.id}`)}
                    className="hover:bg-sand-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-charcoal-900">
                      {tour.id}
                    </td>

                    <td className="py-3 px-3 font-semibold text-charcoal-900">
                      {tour.title}
                      <span className="block text-[11px] font-normal text-muted-foreground">{tour.destination}</span>
                    </td>

                    <td className="py-3 px-3 text-charcoal-700">
                      {tour.travelersCount} Pax
                    </td>

                    <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">
                      {tour.startDate}
                    </td>

                    <td className="py-3 px-3 text-charcoal-700 font-medium">
                      {tour.leadGuide}
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          isDisrupted ? "danger" :
                          isAdapted ? "success" : "default"
                        }
                        size="sm"
                      >
                        {isDisrupted ? "Disruption Active" :
                         isAdapted ? "Journey Adapted" : "On Track"}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/operator/tours/${tour.id}`)
                        }}
                        className="text-[11px] py-1 px-2.5 h-auto"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Weather Twin Modal */}
      <WeatherTwinDashboardModal
        isOpen={showWeatherTwinModal}
        onClose={() => setShowWeatherTwinModal(false)}
        itinerary={itinerary}
        onApplyAdaptation={(analysis, rec, adaptedItinerary) => {
          if (adaptedItinerary) {
            setItinerary(adaptedItinerary)
          }
          setShowWeatherTwinModal(false)
          showToast("Weather Twin Adaptation applied to active tour fleet (TRIP-1024)!")
        }}
      />

      {/* Preview Changes Modal */}
      <RecoveryPreviewModal
        open={Boolean(previewPlan)}
        onOpenChange={(isOpen) => !isOpen && setPreviewPlan(null)}
        plan={previewPlan}
        currentItinerary={itinerary}
        onApplyPlan={handleApplyRecovery}
      />

      </div>
    </PageTransition>
  )
}

export default Operator
