import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Compass, Users, Calendar, Wallet, MapPin, 
  Plane, Hotel, Car, Utensils, ShieldCheck, AlertTriangle, 
  CheckCircle2, Send, Check, Phone, Store, RotateCcw, Sparkles 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { initialOperatorTours } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorTourDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    appliedRecovery,
    operatorVendors,
    operatorNotifications,
    confirmOperatorVendor,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    resetDisruptionSimulation
  } = useTripPlan()

  const [notificationSent, setNotificationSent] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const defaultTour = initialOperatorTours.find(t => t.id === id) || initialOperatorTours[0]
  const day1 = itinerary?.days?.find(d => d.day === 1) || itinerary?.days?.[0]
  const day1Items = day1?.items || []

  const isDisrupted = activeDisruption && !appliedRecovery
  const isAdapted = Boolean(appliedRecovery)

  const defaultDraftMessage = "Hi Aryan & Riya! Your inbound flight 6E-204 to Goa has been delayed by 90 minutes. Navora has automatically adjusted your afternoon schedule: your private cab will meet you at Gate 2 at 12:15, check-in is held, and we swapped Scuba Diving for a relaxed Fontainhas Heritage & Culinary Walk (16:00 – 18:30) to preserve your evening Sunset Cruise & Dinner. Zero hassle, zero lost bookings!"

  const handleSendNotification = () => {
    sendOperatorTravelerNotification(id || "GOA-2048", defaultDraftMessage)
    setNotificationSent(true)
    showToast("Simulated notification dispatched to traveler WhatsApp & App feed.")
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
            <Sparkles className="w-4 h-4 text-terracotta-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/operator')}
            className="p-2 rounded-lg bg-white border border-sand-200 hover:bg-sand-50 text-charcoal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-charcoal-900 bg-sand-100 px-2 py-0.5 rounded">
                TOUR {defaultTour.id}
              </span>
              <StatusIndicator
                status={isDisrupted ? "disruption" : isAdapted ? "active" : "active"}
                label={isDisrupted ? "DISRUPTION ACTIVE" : isAdapted ? "JOURNEY ADAPTED" : "ON TRACK"}
                pulse={isDisrupted}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950 mt-1">
              {defaultTour.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeDisruption && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetDisruptionSimulation()
                showToast("Tour simulation reset to original baseline.")
              }}
              className="text-xs bg-white border-sand-300"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Simulation
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => navigate('/trip')}
            className="bg-charcoal-900 text-white hover:bg-charcoal-800 text-xs"
          >
            Open Traveler View
          </Button>
        </div>
      </div>

      {/* 2-Column Grid: Left (Overview & Itinerary) / Right (Vendor Ops & Guest Comms) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tour Profile Overview Card */}
          <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-950">
              Tour Profile & Guest Preferences
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Guests</span>
                <span className="font-bold text-charcoal-900">{defaultTour.travelersName}</span>
                <span className="text-[11px] text-muted-foreground block">2 Adults</span>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Dates</span>
                <span className="font-bold text-charcoal-900">{defaultTour.startDate}</span>
                <span className="text-[11px] text-muted-foreground block">4 Days / 3 Nights</span>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Budget</span>
                <span className="font-bold text-charcoal-900">₹{defaultTour.budgetTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block">Balanced</span>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Pacing Style</span>
                <span className="font-bold text-charcoal-900">Balanced Pace</span>
                <span className="text-[11px] text-muted-foreground block">Experiences Focus</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 pt-1 border-t border-sand-100 text-xs">
              <span className="text-muted-foreground font-semibold text-[11px]">Interests:</span>
              {(tripPreferences?.interests || ["Adventure", "Food", "Beaches"]).map((int, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-sand-100 text-charcoal-700 text-[11px] font-medium border border-sand-200">
                  {int}
                </span>
              ))}
            </div>
          </Card>

          {/* Master Itinerary Timeline */}
          <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-sand-100">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950">
                  Day 1 Master Schedule (Operational View)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Synchronized live itinerary with real-time arrival and activity time slots
                </p>
              </div>

              <Badge variant={isAdapted ? "success" : isDisrupted ? "danger" : "default"} size="sm">
                {isAdapted ? "Adapted Schedule" : isDisrupted ? "Disrupted Schedule" : "Baseline"}
              </Badge>
            </div>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-sand-200">
              {day1Items.map((item, idx) => {
                const isConflict = !isAdapted && isDisrupted && (item.type === 'experience' && item.id?.includes('scuba'))
                const isShifted = isDisrupted && (item.type === 'transport' || item.type === 'hotel')

                return (
                  <div
                    key={item.id || idx}
                    className={`relative pl-10 p-3.5 rounded-xl border text-xs transition-all ${
                      isConflict
                        ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300"
                        : isShifted
                        ? "bg-amber-50/60 border-amber-200"
                        : "bg-sand-50/50 border-sand-200"
                    }`}
                  >
                    <div className={`absolute left-2.5 top-3.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                      isConflict ? "border-rose-600 bg-rose-50" : isShifted ? "border-amber-500" : "border-emerald-500"
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-charcoal-950 font-serif">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-600">
                          {item.location || item.type}
                          {item.durationMinutes ? ` • ${Math.floor(item.durationMinutes/60)}h ${item.durationMinutes%60}m` : ''}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                        <span className="font-mono text-xs font-bold text-charcoal-900">
                          {item.startTime} – {item.endTime}
                        </span>

                        {isConflict && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                            Conflict
                          </span>
                        )}

                        {isAdapted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            ✓ On Time
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Disruption History Audit */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-charcoal-950">
              Disruption & Recovery Audit Trail
            </h3>

            <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal-900">Inbound Flight Delay (+90m BOM → GOI)</span>
                <span className="font-mono text-[11px] text-muted-foreground">Logged 09:20 IST</span>
              </div>
              <p className="text-[11px] text-charcoal-600 leading-relaxed">
                Departure shifted to 10:50 with 12:05 touchdown. Causal traversal detected 1 activity conflict (Scuba Dive) and 2 downstream transit shifts.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="text-muted-foreground">Recovery Strategy:</span>
                <span className="font-bold text-charcoal-900">Plan B (Balanced Recovery)</span>
                <span className="text-emerald-700 font-semibold">• ₹1,200 saved, +45m buffer</span>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column (1 Col): Vendor Coordination & Traveler Communication */}
        <div className="space-y-6">
          
          {/* Traveler Communication Box (Simulated WhatsApp/Push) */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand-100">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-serif font-bold text-sm text-charcoal-950">
                  Guest Journey Notification
                </h3>
              </div>
              <Badge variant={notificationSent || operatorNotifications?.length > 0 ? "success" : "warning"} size="sm">
                {notificationSent || operatorNotifications?.length > 0 ? "Dispatched" : "Pending"}
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>To: Aryan & Riya Sharma</span>
                <span>WhatsApp & In-App</span>
              </div>
              <p className="text-[11px] text-charcoal-800 leading-relaxed bg-white p-2.5 rounded-lg border border-sand-200/80">
                "{defaultDraftMessage}"
              </p>
            </div>

            <div className="flex items-center gap-2">
              {notificationSent || operatorNotifications?.length > 0 ? (
                <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Notification Dispatched to Guests</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSendNotification}
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Simulated Journey Update
                </Button>
              )}
            </div>
          </Card>

          {/* Assigned Vendors Summary */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-sand-100">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-serif font-bold text-sm text-charcoal-950">
                  Assigned Vendor Partners
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {operatorVendors.slice(0, 4).map((v) => (
                <div key={v.id} className="p-2.5 rounded-lg bg-sand-50/60 border border-sand-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal-900">{v.name}</span>
                    <Badge variant={v.status === 'confirmed' ? "success" : v.status === 'requires_action' ? "warning" : "default"} size="sm">
                      {v.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{v.service} • {v.phone}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Zero-Friction SLA Guarantee */}
          <Card className="p-5 bg-charcoal-950 text-white border-charcoal-800 space-y-2">
            <div className="flex items-center gap-2 text-terracotta-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Operator SLA Shield</span>
            </div>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              All vendor cancellation fees and slot swap penalties for Tour GOA-2048 are waived under the Navora Coastal Master Operator Agreement.
            </p>
          </Card>

        </div>

      </div>

    </div>
    </PageTransition>
  )
}

export default OperatorTourDetail
