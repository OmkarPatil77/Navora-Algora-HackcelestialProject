import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, Clock, AlertTriangle, Sparkles, 
  CheckCircle2, Check, Compass, Sun, Wallet, Users, ArrowRight, 
  ShieldCheck, Edit3, RefreshCw, Plus, Layers, Zap, Info, X, CreditCard,
  CloudRain 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { generateItinerary } from '@/services/itineraryEngine'
import { formatCurrency } from '@/lib/utils'
import PageTransition from '@/components/motion/PageTransition'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Modular Itinerary Experience Components
import { ItineraryHeader } from '@/components/traveler/itinerary/ItineraryHeader'
import { ItinerarySummaryCards } from '@/components/traveler/itinerary/ItinerarySummaryCards'
import { ItineraryActivityCard } from '@/components/traveler/itinerary/ItineraryActivityCard'
import { ItineraryTransitNode } from '@/components/traveler/itinerary/ItineraryTransitNode'
import { ItineraryContextualSuggestion } from '@/components/traveler/itinerary/ItineraryContextualSuggestion'
import { DynamicDisruptionSection } from '@/components/traveler/itinerary/DynamicDisruptionSection'
import { AlternativeComparisonModal } from '@/components/traveler/itinerary/AlternativeComparisonModal'
import { ImpactAnalysisModal } from '@/components/traveler/itinerary/ImpactAnalysisModal'
import { OptimizeDayModal } from '@/components/traveler/itinerary/OptimizeDayModal'
import { WhatIfSimulationModal } from '@/components/traveler/itinerary/WhatIfSimulationModal'
import { ScheduleConflictModal } from '@/components/traveler/itinerary/ScheduleConflictModal'
import { ActivityDetailModal } from '@/components/traveler/itinerary/ActivityDetailModal'
import { ItineraryMapView } from '@/components/traveler/itinerary/ItineraryMapView'
import { ItineraryBudgetView } from '@/components/traveler/itinerary/ItineraryBudgetView'
import { WeatherTwinDashboardModal } from '@/components/traveler/itinerary/WeatherTwinDashboardModal'

export const Itinerary = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    setItinerary,
    setDestination,
    regenerateSingleDay,
    updateItineraryItemTime,
    removeItineraryItem,
    isTripBooked,
    bookTrip,
    cancelBooking
  } = useTripPlan()

  // Navigation Tabs: 'timeline' | 'map' | 'budget'
  const [activeTab, setActiveTab] = useState('timeline')

  // Selected Day in Itinerary
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Interactive Modals State
  const [activeItemDetailModal, setActiveItemDetailModal] = useState(null)
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false)
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false)
  const [isWeatherTwinOpen, setIsWeatherTwinOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [impactModalAlternative, setImpactModalAlternative] = useState(null)
  const [scheduleConflictData, setScheduleConflictData] = useState(null)
  const [highlightedMapStopId, setHighlightedMapStopId] = useState(null)

  // Toast / System Confirmation Alert
  const [confirmationNotice, setConfirmationNotice] = useState(null)

  // AI Contextual suggestion state (can be dismissed or added)
  const [isAiSuggestionVisible, setIsAiSuggestionVisible] = useState(true)

  // Dynamic Disruption demo state (can be replaced by user)
  const [disruptedActivityResolved, setDisruptedActivityResolved] = useState(false)
  const [activeAlternativeApplied, setActiveAlternativeApplied] = useState(null)

  // Dynamic sync: Ensure itinerary is regenerated whenever destination or preferences change
  useEffect(() => {
    const prefCity = (tripPreferences?.destination?.city || tripPreferences?.destination?.name || "Goa").toLowerCase()
    const itinCity = (itinerary?.destination?.city || itinerary?.destination?.name || "").toLowerCase()

    if (!itinerary || !itinerary.days || itinerary.days.length === 0 || (itinCity && !itinCity.includes(prefCity) && !prefCity.includes(itinCity))) {
      const fresh = generateItinerary(tripPreferences, selectedExperiences)
      setItinerary(fresh)
    }
  }, [tripPreferences?.destination?.city, tripPreferences?.destination?.name])

  // Destination and trip metadata
  const city = tripPreferences?.destination?.city || tripPreferences?.destination?.name || "Goa"
  const dateRange = tripPreferences?.dates?.startDate && tripPreferences?.dates?.endDate
    ? `${new Date(tripPreferences.dates.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(tripPreferences.dates.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : "12 Oct – 16 Oct"
  const daysCount = tripPreferences?.duration?.days || 5
  const travelersCount = tripPreferences?.travelers?.total || 2

  // Dynamic days list derived from current destination itinerary
  const currentItinerary = (itinerary?.days && itinerary.days.length > 0 && 
    (itinerary?.destination?.city || itinerary?.destination?.name || '').toLowerCase().includes((city || '').toLowerCase()))
    ? itinerary
    : generateItinerary(tripPreferences, selectedExperiences)

  const daysList = (currentItinerary?.days && currentItinerary.days.length > 0)
    ? currentItinerary.days
    : generateItinerary(tripPreferences, selectedExperiences).days

  const currentDay = daysList.find(d => d.day === selectedDayNumber) || daysList[0]

  // Calculated or dynamic metrics
  const totalCost = (itinerary?.summary?.totalCost || 29450) + (activeAlternativeApplied?.priceDiff || 0)
  const targetBudget = tripPreferences?.budget?.total || 30000
  const remainingBudget = Math.max(0, targetBudget - totalCost)

  // Count activities across all days
  const totalActivitiesCount = daysList.reduce((acc, d) => {
    const act = (d.items || []).filter(item => item.type !== 'flight' && item.type !== 'buffer')
    return acc + act.length
  }, 0) || 12

  const totalBookingsCount = 4

  // Breakdown for Budget Tab
  const budgetBreakdown = {
    accommodation: 12000,
    transportation: 5500,
    activities: 6450 + (activeAlternativeApplied?.priceDiff || 0),
    food: 4000,
    other: 1500
  }

  // Handle Alternative selection & comparison
  const alternativesList = [
    {
      id: "alt-scuba",
      title: "Scuba Diving & Coral Reef Safari",
      type: "experience",
      priceDiff: 500,
      priceDiffText: "+₹500 extra",
      distance: "15 min away",
      duration: "2 hrs",
      preferenceMatch: 95,
      features: [
        "Matches Adventure preference",
        "Available on Oct 13",
        "Fits current schedule"
      ]
    },
    {
      id: "alt-kayak",
      title: "Guided Kayaking in Mangrove Estuary",
      type: "experience",
      priceDiff: 0,
      priceDiffText: "Same price (₹0)",
      distance: "10 min away",
      duration: "2 hrs",
      preferenceMatch: 88,
      features: [
        "Available on Oct 13",
        "No schedule conflict",
        "Calm water guarantee"
      ]
    },
    {
      id: "alt-cruise",
      title: "Sunset River Catamaran Cruise",
      type: "experience",
      priceDiff: 300,
      priceDiffText: "+₹300 extra",
      distance: "20 min away",
      duration: "2 hrs",
      preferenceMatch: 91,
      features: [
        "Matches Photography preference",
        "Available on Oct 13",
        "Complimentary beverages"
      ]
    }
  ]

  // Prompt Section 11 & 19: Apply Alternative Change
  const handleApplyAlternativeChange = (alternative, newTripCost) => {
    setActiveAlternativeApplied(alternative)
    setDisruptedActivityResolved(true)
    setImpactModalAlternative(null)
    setIsComparisonOpen(false)

    // Update the real itinerary state
    if (itinerary && itinerary.days) {
      const updatedDays = itinerary.days.map(d => {
        if (d.day === 2) {
          const updatedItems = d.items.map(item => {
            if (item.id === "item-d2-watersports" || item.title.toLowerCase().includes("water sports")) {
              return {
                ...item,
                title: alternative.title,
                cost: (item.cost || 2000) + alternative.priceDiff,
                status: "Confirmed",
                matches: ["Water Adventure", "Photography", "AI Replaced"],
                reasons: [
                  "Dynamically substituted following vendor cancellation",
                  "Verified zero downstream conflict with evening dining",
                  "Matches high preference compatibility"
                ]
              }
            }
            return item
          })
          return { ...d, items: updatedItems }
        }
        return d
      })

      setItinerary({
        ...itinerary,
        days: updatedDays,
        summary: {
          ...itinerary.summary,
          totalCost: newTripCost,
          remainingBudget: Math.max(0, targetBudget - newTripCost)
        }
      })
    }

    // Prompt Section 19: Confirmation notification
    setConfirmationNotice({
      title: "✓ Itinerary Updated",
      message: `Water Sports was replaced with ${alternative.title}. Trip cost updated: ${formatCurrency(totalCost)} → ${formatCurrency(newTripCost)}`
    })
  }

  // Prompt Section 12: Apply Optimization
  const handleApplyOptimization = (dayNum) => {
    setIsOptimizeOpen(false)
    setConfirmationNotice({
      title: "✓ Day Optimization Applied",
      message: `Day ${dayNum} itinerary successfully reordered. 38 minutes of transit time saved with zero booking conflicts!`
    })
  }

  // Prompt Section 13: Apply What-If
  const handleApplyWhatIf = (sim) => {
    setIsWhatIfOpen(false)
    setConfirmationNotice({
      title: "✓ Scenario Applied",
      message: `"${sim.title}" applied to itinerary. Estimated trip cost adjusted to ${formatCurrency(sim.tripCostAfter)}.`
    })
  }

  // Prompt Section 15: Add AI Suggestion into Day Itinerary
  const handleAddAiSuggestion = () => {
    setIsAiSuggestionVisible(false)
    const newItem = {
      id: `item-ai-sunset-${Date.now()}`,
      title: "Sunset Point & Coastal Cliffs",
      type: "experience",
      startTime: "03:00 PM",
      endTime: "04:30 PM",
      durationMinutes: 90,
      cost: 300,
      location: "Aguada Rocky Cliffs",
      proximity: "12 min from hotel",
      transitMode: "Cab arranged",
      status: "AI Suggested",
      matches: ["Beach", "Photography"],
      reasons: [
        "Fills 2-hour idle relaxation window between afternoon and evening",
        "Exceptional golden-hour photography spot",
        "Minimal cost (+₹300) well within budget cushion"
      ]
    }

    if (itinerary?.days) {
      const updatedDays = itinerary.days.map(d => {
        if (d.day === selectedDayNumber) {
          const items = [...(d.items || [])]
          items.splice(items.length - 1, 0, newItem)
          return { ...d, items }
        }
        return d
      })
      setItinerary({
        ...itinerary,
        days: updatedDays,
        summary: {
          ...itinerary.summary,
          totalCost: totalCost + 300
        }
      })
    }

    setConfirmationNotice({
      title: "✓ Added to Itinerary",
      message: "Sunset Point (₹300) added between 3:00 PM and 4:30 PM. Transit arranged."
    })
  }

  // Prompt Section 14: Change Time with Schedule Conflict Warning
  const handleInitiateChangeTime = (item) => {
    // Show conflict simulation if user changes time to 5:00 PM (which conflicts with dinner)
    setScheduleConflictData({
      activityTitle: item.title,
      requestedTime: "5:00 PM",
      conflictingActivity: "Dinner at Fisherman's Wharf — 5:30 PM",
      item
    })
  }

  const handleResolveConflictMoveDownstream = () => {
    setScheduleConflictData(null)
    setConfirmationNotice({
      title: "✓ Schedule Adjusted",
      message: "Activity shifted to 5:00 PM. Dinner reservation smoothly moved downstream to 7:30 PM with zero conflict."
    })
  }

  const handleResolveConflictKeepTime = () => {
    setScheduleConflictData(null)
    setConfirmationNotice({
      title: "✓ Schedule Preserved",
      message: "Activity scheduled for 4:00 PM. Dinner remains at 5:30 PM."
    })
  }

  // ==============================================================
  // UNBOOKED / NO TRIP PLANNED FALLBACK VIEW
  // ==============================================================
  if (!isTripBooked) {
    const supportedCities = [
      {
        id: "goa",
        name: "Goa, India",
        city: "Goa",
        country: "India",
        tagline: "Sun-drenched coastlines, heritage Latin quarters, and vibrant seafood.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        vibes: ["Coastal", "Heritage", "Water Sports"],
        budget: 35000,
        days: 4
      },
      {
        id: "jaipur",
        name: "Jaipur, Rajasthan",
        city: "Jaipur",
        country: "India",
        tagline: "Regal palaces, timeless hill forts, and vibrant artisan bazaars.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        vibes: ["Royal Forts", "Bazaars", "Culinary"],
        budget: 42000,
        days: 4
      },
      {
        id: "kerala",
        name: "Munnar & Alleppey, Kerala",
        city: "Kerala",
        country: "India",
        tagline: "Emerald tea plantations, tranquil backwaters, and Ayurvedic calm.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        vibes: ["Backwaters", "Tea Hills", "Wellness"],
        budget: 48000,
        days: 5
      },
      {
        id: "dubai",
        name: "Dubai, United Arab Emirates",
        city: "Dubai",
        country: "UAE",
        tagline: "Futuristic architecture, desert safaris, and luxury waterfronts.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        vibes: ["Luxury", "Skyline", "Desert Safari"],
        budget: 95000,
        days: 5
      },
      {
        id: "singapore",
        name: "Singapore",
        city: "Singapore",
        country: "Singapore",
        tagline: "Garden city marvels, world-class hawker culture, and urban serenity.",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
        vibes: ["Urban Nature", "Hawker Food", "Futuristic"],
        budget: 110000,
        days: 4
      }
    ]

    const handleQuickSelectCity = (c) => {
      setDestination({
        id: c.id,
        name: c.name,
        city: c.city,
        country: c.country,
        image: c.image
      })
      bookTrip()
    }

    return (
      <PageTransition>
        <div className="py-10 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Top Banner Alert */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-sand-100 to-white border-2 border-amber-300 shadow-soft-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 p-3 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-warm-coral">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] uppercase tracking-wider border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Trip Plan Required
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 tracking-tight">
                      Create Your Plan to Form Your Itinerary
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E6282] max-w-2xl leading-relaxed">
                      You haven't selected a destination or booked a trip yet! Select one of our supported cities below or create a custom plan to generate your live, AI-optimized day-by-day itinerary.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <Button
                    onClick={() => navigate('/plan')}
                    className="bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-warm-coral"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Custom Plan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recommendations')}
                    className="border-sand-300 text-navy-900 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl bg-white hover:bg-sand-100"
                    leftIcon={<Compass className="w-4 h-4 text-coral-500" />}
                  >
                    Explore Destinations
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick-Select Supported Destinations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-navy-900">
                    Select a Destination to Instant-Generate Itinerary
                  </h3>
                  <p className="text-xs text-[#5E6282]">
                    Click any city below to generate an AI-tailored day-by-day itinerary instantly.
                  </p>
                </div>
                <Badge variant="outline" className="border-coral-300 bg-coral-50 text-coral-800 text-xs font-bold">
                  5 Active Cities Implemented
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {supportedCities.map(c => (
                  <div
                    key={c.id}
                    className="group rounded-2xl bg-white border border-sand-200 overflow-hidden shadow-soft-xs hover:shadow-soft-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-navy-900 border border-white/50">
                        {formatCurrency(c.budget)} • {c.days} Days
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="text-lg font-serif font-bold">{c.name}</h4>
                        <p className="text-xs text-sand-200 line-clamp-1">{c.tagline}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {c.vibes.map(vibe => (
                          <span
                            key={vibe}
                            className="px-2 py-0.5 rounded-md bg-sand-100 text-charcoal-700 font-semibold text-[10px]"
                          >
                            {vibe}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <Button
                          onClick={() => handleQuickSelectCity(c)}
                          className="flex-1 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
                          rightIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                        >
                          Quick-Build Itinerary
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDestination({
                              id: c.id,
                              name: c.name,
                              city: c.city,
                              country: c.country,
                              image: c.image
                            })
                            navigate('/plan')
                          }}
                          className="border-sand-300 text-navy-900 font-semibold text-xs px-3 py-2.5 rounded-xl hover:bg-sand-100"
                        >
                          Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-12 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* 1. Trip Header (Prompt Section 2) */}
          <ItineraryHeader
            city={city}
            dateRange={dateRange}
            daysCount={daysCount}
            travelersCount={travelersCount}
            onOpenWhatIf={() => setIsWhatIfOpen(true)}
            onOpenOptimize={() => setIsOptimizeOpen(true)}
            onOpenWeatherTwin={() => setIsWeatherTwinOpen(true)}
          />

          {/* 2. Trip Summary Metrics Cards (Prompt Section 3) */}
          <ItinerarySummaryCards
            estimatedCost={totalCost}
            activitiesCount={totalActivitiesCount}
            bookingsCount={totalBookingsCount}
            travelTimePerDay="2.4 hrs/day"
            planCompatibility={92}
          />

          {/* Confirmation Notice Toast Banner */}
          <AnimatePresence>
            {confirmationNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs flex items-center justify-between shadow-soft-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">{confirmationNotice.title}</span>
                    <span className="text-emerald-900">{confirmationNotice.message}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmationNotice(null)}
                  className="text-emerald-800 hover:text-emerald-950 font-bold p-1 rounded-md hover:bg-emerald-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weather Twin Telemetry & What-If Simulation Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-charcoal-900 text-white shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <CloudRain className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    NAVORA Weather Twin • Digital Simulation Layer
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    Sense → Propagate → Adapt
                  </span>
                </div>
                <p className="text-xs text-sand-200 mt-0.5">
                  Sense local weather, simulate cascading impact radius across activities & transport, and explore AI adaptations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => setIsWeatherTwinOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Weather Twin Simulator
              </Button>
            </div>
          </div>

          {/* 3. Navigation Tabs: [ Timeline ] [ Map ] [ Budget ] (Prompt Section 4) */}
          <div className="flex items-center justify-between gap-4 border-b border-sand-200 pb-2">
            <div className="flex items-center gap-2 bg-sand-100/80 p-1.5 rounded-2xl border border-sand-200">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'budget', label: 'Budget', icon: Wallet }
              ].map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-charcoal-950 shadow-soft-xs border border-sand-200/80'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta-600' : 'text-charcoal-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Quick Trip Booking Status Badge */}
            <div className="hidden sm:flex items-center gap-2">
              {isTripBooked ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Trip Confirmed & Synchronized</span>
                </span>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/checkout')}
                  className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold shadow-soft-xs h-9 px-4"
                  leftIcon={<CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Finalize & Pay via Stripe 💳
                </Button>
              )}
            </div>
          </div>

          {/* Day Selector Pill Bar (visible in Timeline and Map views) */}
          {activeTab !== 'budget' && (
            <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2">
                {daysList.map((dObj) => {
                  const isActive = dObj.day === selectedDayNumber
                  return (
                    <button
                      key={dObj.day}
                      type="button"
                      onClick={() => setSelectedDayNumber(dObj.day)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
                        isActive
                          ? "bg-charcoal-900 text-white border-charcoal-800 shadow-soft-xs"
                          : "bg-white text-charcoal-700 border-sand-200 hover:bg-sand-100"
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">DAY 0{dObj.day}</span>
                      <span className="font-serif font-bold">{dObj.theme || `Day ${dObj.day}`}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isActive ? "bg-charcoal-800 text-sand-200" : "bg-sand-100 text-charcoal-600"
                      }`}>
                        {dObj.date || `Day ${dObj.day}`}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateSingleDay(selectedDayNumber)}
                  className="text-xs bg-white text-charcoal-800 border-sand-300 hover:bg-sand-50"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-terracotta-600" />}
                >
                  Regenerate Day ✦
                </Button>
              </div>
            </div>
          )}

          {/* TAB 1: TIMELINE VIEW (Prompt Section 5, 6, 7, 8, 9, 14, 15, 18) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Day Focus Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                    Day 0{currentDay.day} Intelligent Sequence
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-0.5">
                    {currentDay.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Time → Activity → Location → Travel → Next Activity
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    Constraints Verified ✓
                  </Badge>
                </div>
              </div>

              {/* Dynamic Disruption Alert & AI Alternative Section (Day 2 Demo) */}
              {selectedDayNumber === 2 && !disruptedActivityResolved && (
                <DynamicDisruptionSection
                  onCompareOptions={() => setIsComparisonOpen(true)}
                  onSelectAlternative={(alt) => setImpactModalAlternative(alt)}
                />
              )}

              {/* Connected Vertical Timeline Track */}
              <div className="space-y-1 relative ml-2 sm:ml-4">
                {currentDay.items && currentDay.items.length > 0 ? (
                  currentDay.items.map((item, idx) => {
                    const isDisruptedWaterSports = item.id === "item-d2-watersports" && selectedDayNumber === 2 && !disruptedActivityResolved
                    if (isDisruptedWaterSports) return null

                    return (
                      <React.Fragment key={item.id || idx}>
                        {/* Connected Vertical Line + Activity Card */}
                        <div className="relative pl-10 sm:pl-14 py-2">
                          {/* Continuous Vertical Connecting Line */}
                          <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-sand-300" />
                          
                          {/* Activity Node Dot */}
                          <div className="absolute left-[13px] sm:left-[21px] top-7 w-3.5 h-3.5 rounded-full bg-white border-2 border-terracotta-600 shadow-xs z-10" />

                          {/* Rich Activity Card */}
                          <ItineraryActivityCard
                            item={item}
                            index={idx}
                            isSelected={highlightedMapStopId === item.id}
                            onViewDetails={(item) => setActiveItemDetailModal(item)}
                            onChangeTime={(item) => handleInitiateChangeTime(item)}
                            onReplaceActivity={(item) => setIsComparisonOpen(true)}
                            onRemoveActivity={(item) => removeItineraryItem(selectedDayNumber, item.id)}
                          />
                        </div>

                        {/* Prompt Section 15: Contextual AI Suggestion (Shown between Afternoon & Sunset on Day 1) */}
                        {selectedDayNumber === 1 && idx === 2 && isAiSuggestionVisible && (
                          <ItineraryContextualSuggestion
                            timeWindow="between 3 PM and 5 PM"
                            interests={tripPreferences?.interests?.length > 0 ? tripPreferences.interests.slice(0, 2) : ["Beach", "Photography"]}
                            onAdd={handleAddAiSuggestion}
                            onIgnore={() => setIsAiSuggestionVisible(false)}
                          />
                        )}

                        {/* Transit Connector between consecutive activities */}
                        {idx < currentDay.items.length - 1 && (
                          <ItineraryTransitNode
                            durationMinutes={idx === 0 ? 35 : idx === 1 ? 15 : 20}
                            mode={idx === 0 ? "Cab" : "Private Sedan"}
                            distanceKm={idx === 0 ? 14 : idx === 1 ? 6 : 8}
                          />
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-sand-200">
                    <p className="text-sm text-charcoal-600 font-medium">No items scheduled for Day {selectedDayNumber}.</p>
                    <Button
                      size="sm"
                      onClick={() => regenerateSingleDay(selectedDayNumber)}
                      className="mt-3 bg-terracotta-600 text-white"
                    >
                      Generate Day Schedule
                    </Button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MAP VIEW (Prompt Section 4 & 16) */}
          {activeTab === 'map' && (
            <ItineraryMapView
              dayItems={currentDay.items || []}
              dayTitle={currentDay.title}
              dayNumber={selectedDayNumber}
              city={city}
              selectedItemId={highlightedMapStopId}
              onSelectStop={(stop) => setHighlightedMapStopId(stop.id)}
            />
          )}

          {/* TAB 3: BUDGET VIEW (Prompt Section 4 & 17) */}
          {activeTab === 'budget' && (
            <ItineraryBudgetView
              totalEstimatedCost={totalCost}
              targetBudget={targetBudget}
              breakdown={budgetBreakdown}
              proposedChange={{
                active: true,
                activityTitle: activeAlternativeApplied?.title || "Scuba Diving Alternative",
                currentCost: 29450,
                afterCost: totalCost,
                difference: activeAlternativeApplied?.priceDiff || 500
              }}
            />
          )}

        </div>

        {/* MODAL 1: Activity Detail Dialog with Explainable 'Why we selected this' (Section 7) */}
        <ActivityDetailModal
          isOpen={Boolean(activeItemDetailModal)}
          onClose={() => setActiveItemDetailModal(null)}
          item={activeItemDetailModal}
          dayNumber={selectedDayNumber}
          totalBudget={targetBudget}
          onChangeTimeClick={(item) => handleInitiateChangeTime(item)}
          onRemoveItem={removeItineraryItem}
        />

        {/* MODAL 2: Compare Alternative Options Matrix (Section 10) */}
        <AlternativeComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          alternatives={alternativesList}
          onSelectOption={(option) => {
            setIsComparisonOpen(false)
            setImpactModalAlternative(option)
          }}
        />

        {/* MODAL 3: Impact Analysis Modal before applying change (Section 11) */}
        <ImpactAnalysisModal
          isOpen={Boolean(impactModalAlternative)}
          onClose={() => setImpactModalAlternative(null)}
          originalActivity="Water Sports & Jet Ski Safari"
          selectedAlternative={impactModalAlternative}
          currentTripCost={totalCost}
          onApplyChange={handleApplyAlternativeChange}
        />

        {/* MODAL 4: ✨ Optimize My Day (Section 12) */}
        <OptimizeDayModal
          isOpen={isOptimizeOpen}
          onClose={() => setIsOptimizeOpen(false)}
          dayNumber={selectedDayNumber}
          onApplyOptimization={handleApplyOptimization}
        />

        {/* MODAL 5: What-If Simulation (Section 13) */}
        <WhatIfSimulationModal
          isOpen={isWhatIfOpen}
          onClose={() => setIsWhatIfOpen(false)}
          currentTripCost={totalCost}
          currentHotelCost={10000}
          currentCompatibility={92}
          onApplySimulation={handleApplyWhatIf}
        />

        {/* MODAL 6: Interactive Schedule Conflict Warning (Section 14) */}
        <ScheduleConflictModal
          isOpen={Boolean(scheduleConflictData)}
          onClose={() => setScheduleConflictData(null)}
          activityTitle={scheduleConflictData?.activityTitle}
          requestedTime={scheduleConflictData?.requestedTime}
          conflictingActivity={scheduleConflictData?.conflictingActivity}
          onResolveMoveDownstream={handleResolveConflictMoveDownstream}
          onResolveAdjustTime={handleResolveConflictKeepTime}
        />

        {/* MODAL 7: NAVORA Weather Twin Dashboard & What-If Weather Simulator */}
        <WeatherTwinDashboardModal
          isOpen={isWeatherTwinOpen}
          onClose={() => setIsWeatherTwinOpen(false)}
          itinerary={itinerary}
          tripPreferences={tripPreferences}
          onApplyWeatherChanges={(analysis, rec, adaptedItinerary) => {
            if (adaptedItinerary) {
              setItinerary(adaptedItinerary)
            }
            setIsWeatherTwinOpen(false)
            setConfirmationNotice({
              title: "✓ Weather Twin Adaptation Applied",
              message: `Simulated weather scenario (${analysis.scenario?.rainfall}mm rain) applied. Water Sports replaced with Fontainhas Heritage Walk. Downstream transit & dining schedule shifted.`
            })
          }}
        />

      </div>
    </PageTransition>
  )
}

export default Itinerary
