import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Star, MapPin, Clock, Plus, Check, Filter, 
  ArrowRight, Compass, ShieldCheck, Calendar, Users, 
  Wallet, RefreshCw, Layers, SlidersHorizontal, AlertCircle,
  CheckCircle2, Globe, Heart, Lock, AlertTriangle
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { interestCatalogue, mockDestinations } from '@/data/mockData'
import { getRecommendations, getJourneyFitMetrics, optimizePicks } from '@/services/recommendationEngine'
import { JourneyFitWidget } from '@/components/traveler/JourneyFitWidget'
import { ExperienceDetailDialog } from '@/components/traveler/ExperienceDetailDialog'
import { OptimizePicksDialog } from '@/components/traveler/OptimizePicksDialog'
import ExplainabilityModal from '@/components/shared/ExplainabilityModal'
import { explainRecommendation } from '@/services/decisionExplanationEngine'
import PageTransition from '@/components/motion/PageTransition'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils'

export const Recommendations = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    totalPlannedActivitiesCost,
    remainingBudget,
    toggleExperience,
    isExperienceSelected,
    replaceExperience,
    setDestination,
    journeyMemory,
    isTripBooked,
    bookedTrip
  } = useTripPlan()

  const {
    destination,
    duration,
    travelers,
    interests = ["adventure", "food", "beaches"],
    budget,
    travelStyle
  } = tripPreferences || {}

  const adultCount = Math.max(1, travelers?.adults || travelers?.total || 2)

  // Real View Mode derived from actual trip booking validation
  // If booked -> 'booked' view (curated for booked destination)
  // If not booked -> 'mixed' view (curated showcase of all destinations)
  const [viewMode, setViewMode] = useState(() => (isTripBooked ? 'booked' : 'mixed'))

  // Synchronize view mode whenever the booking state in context changes
  useEffect(() => {
    if (isTripBooked) {
      setViewMode('booked')
    } else {
      setViewMode('mixed')
    }
  }, [isTripBooked])

  // Destination filter dynamically synced with active trip destination
  const currentCity = destination?.city || destination?.name || "Goa"
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState(() => currentCity)

  useEffect(() => {
    if (destination?.city || destination?.name) {
      setSelectedDestinationFilter(destination.city || destination.name)
    }
  }, [destination?.city, destination?.name])

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDuration, setSelectedDuration] = useState("Any")
  const [selectedPrice, setSelectedPrice] = useState("Any")
  const [sortBy, setSortBy] = useState("Best Match")
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)

  // Validation Notice State
  const [validationAlert, setValidationAlert] = useState(null)

  // Dialog State
  const [activeExperienceModal, setActiveExperienceModal] = useState(null)
  const [showOptimizeModal, setShowOptimizeModal] = useState(false)
  const [explainModalData, setExplainModalData] = useState(null)

  const formatInterestLabels = (ids) => {
    return ids.map(id => {
      const match = interestCatalogue.find(i => i.id === id)
      return match ? match.label : id.charAt(0).toUpperCase() + id.slice(1)
    }).join(', ')
  }

  // Generate Ranked Recommendations from Engine
  const recommendationResult = useMemo(() => {
    const isMixedMode = !isTripBooked || viewMode === 'mixed'
    return getRecommendations(tripPreferences, {
      mixedPlaces: isMixedMode,
      destination: isMixedMode ? selectedDestinationFilter : (destination?.city || destination?.name || "Goa"),
      category: selectedCategory,
      duration: selectedDuration,
      price: selectedPrice,
      sortBy
    }, journeyMemory)
  }, [tripPreferences, isTripBooked, viewMode, selectedDestinationFilter, selectedCategory, selectedDuration, selectedPrice, sortBy, journeyMemory, destination])

  // Compute Journey Fit Metrics
  const journeyFitMetrics = useMemo(() => {
    return getJourneyFitMetrics(tripPreferences, selectedExperiences, recommendationResult.experiences)
  }, [tripPreferences, selectedExperiences, recommendationResult.experiences])

  // Compute Deterministic Optimization Results
  const optimizationResults = useMemo(() => {
    return optimizePicks(tripPreferences, selectedExperiences, recommendationResult.experiences)
  }, [tripPreferences, selectedExperiences, recommendationResult.experiences])

  const destinationOptions = [
    { id: "All", label: "All Places (Mixed)", icon: "🌐" },
    { id: "Goa", label: "Goa", icon: "🏖️" },
    { id: "Jaipur", label: "Jaipur", icon: "🏰" },
    { id: "Kerala", label: "Kerala", icon: "🌴" },
    { id: "Dubai", label: "Dubai", icon: "🌆" },
    { id: "Singapore", label: "Singapore", icon: "🏙️" }
  ]

  const categories = ["All", "Adventure", "Food", "Culture", "Nature", "Beaches", "Wellness", "Nightlife", "Shopping"]
  const durationOptions = ["Any", "< 2 hrs", "2–4 hrs", "4+ hrs"]
  const priceOptions = ["Any", "Under ₹1,000", "₹1,000–₹2,500", "₹2,500+"]
  const sortOptions = ["Best Match", "Lowest Price", "Highest Rated", "Shortest Duration"]

  const resetFilters = () => {
    setSelectedCategory("All")
    setSelectedDuration("Any")
    setSelectedPrice("Any")
    setSortBy("Best Match")
    setSelectedDestinationFilter("All")
  }

  // Action validation & seamless experience toggling
  const handleToggleExperienceWithValidation = (experience) => {
    const activeDest = (destination?.city || destination?.name || '').toLowerCase()
    const expDest = (experience.destination || '').toLowerCase()

    // If tapping an experience from another destination, switch destination dynamically
    if (expDest && activeDest && !activeDest.includes(expDest) && !expDest.includes(activeDest)) {
      setDestination(experience.destination)
      setSelectedDestinationFilter(experience.destination)
    }

    toggleExperience(experience)
  }

  // Destination styling helper for badges
  const getDestinationBadgeStyle = (destName) => {
    const d = (destName || '').toLowerCase()
    if (d.includes('goa')) return 'bg-cyan-100 text-cyan-900 border-cyan-300'
    if (d.includes('jaipur')) return 'bg-amber-100 text-amber-900 border-amber-300'
    if (d.includes('kerala')) return 'bg-emerald-100 text-emerald-900 border-emerald-300'
    if (d.includes('dubai')) return 'bg-purple-100 text-purple-900 border-purple-300'
    if (d.includes('singapore')) return 'bg-rose-100 text-rose-900 border-rose-300'
    return 'bg-sand-100 text-charcoal-800 border-sand-300'
  }

  return (
    <PageTransition>
      <div className="py-10 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ============================================================== */}
          {/* VALIDATION ALERT BANNER (If user tries to add while unbooked)  */}
          {/* ============================================================== */}
          <AnimatePresence>
            {validationAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Trip Booking Required</span>
                    <span className="text-amber-800 text-xs">{validationAlert}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    onClick={() => navigate('/plan')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Plan & Book Trip
                  </Button>
                  <button
                    onClick={() => setValidationAlert(null)}
                    className="p-1 text-amber-800 hover:text-amber-950 font-bold ml-1 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================== */}
          {/* PRIMARY STATUS BANNER & USER NOTIFICATION                      */}
          {/* ============================================================== */}
          {(!isTripBooked || viewMode === 'mixed') ? (
            /* STATE A: NOT BOOKED / MIXED PLACES VIEW */
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-50/90 via-[#FFF9EE] to-coral-50/60 border-2 border-honey-300/80 shadow-soft-sm relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-white border border-honey-300 text-honey-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Globe className="w-7 h-7 text-coral-600" />
                  </div>

                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-honey-200 text-navy-950 font-bold text-[11px] uppercase tracking-wider">
                        Explore Mode: Mixed Places
                      </span>
                      <span className="text-xs text-[#5E6282] font-semibold">
                        • {recommendationResult.experiences.length} Experiences Available
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 tracking-tight">
                      Explore What We Have to Offer Across All Destinations
                    </h2>

                    {/* REQUIRED NOTIFICATION MESSAGE */}
                    <div className="p-3.5 rounded-xl bg-white/90 border border-honey-200/90 text-xs sm:text-sm text-navy-900 leading-relaxed font-medium shadow-2xs">
                      💡 <strong>Notice:</strong> You haven't booked a trip yet! Currently displaying a curated showcase of experiences from across all our destinations. 
                      <span className="text-coral-700 font-bold ml-1">
                        After selecting a destination or booking your trip, this Explore section will be updated automatically with personalized recommendations tailored specifically to your journey!
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                  <Button
                    onClick={() => navigate('/itinerary')}
                    className="bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-warm-coral px-5 py-3 rounded-xl"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Confirm Experiences & View Itinerary ➔
                  </Button>
                </div>
              </div>

              {/* Destination Filter Tabs for Mixed View */}
              <div className="mt-5 pt-4 border-t border-honey-200/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-navy-900 shrink-0 mr-1">Filter by Place:</span>
                {destinationOptions.map(opt => {
                  const isSelected = selectedDestinationFilter === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedDestinationFilter(opt.id)
                        if (opt.id !== "All") {
                          setDestination(opt.id)
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-navy-900 text-white shadow-soft-xs"
                          : "bg-white border border-[#EAE3D5] text-charcoal-700 hover:bg-sand-100"
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            /* STATE B: TRIP IS BOOKED / DESTINATION-SPECIFIC EXPLORE */
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-50/90 via-sand-50 to-white border-2 border-emerald-300 shadow-soft-sm"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-white border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>

                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] uppercase tracking-wider border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Trip Booked & Confirmed
                      </span>
                      <span className="text-xs text-muted-foreground">• Booking ID: {bookedTrip?.id || 'TS-108'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 tracking-tight">
                      Explore Updated for Your Booked Trip to {destination.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#5E6282] leading-relaxed">
                      Showing curated experiences tailored for your booked <span className="font-bold text-navy-900">{duration.days}-day {destination.city || destination.name} journey</span>. Matched against your <span className="font-bold text-navy-900">{formatCurrency(budget.total)} budget</span> and interests in <span className="font-bold text-coral-600">{formatInterestLabels(interests)}</span>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('mixed')}
                    className="text-xs bg-white text-navy-900 border-sand-300 hover:bg-sand-50"
                  >
                    Browse Mixed Places
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => navigate('/itinerary')}
                    className="bg-navy-900 hover:bg-navy-950 text-white text-xs shadow-soft-xs font-semibold px-4"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Booked Itinerary
                  </Button>
                </div>
              </div>
            </motion.div>
          )}



          {/* Filters & Sorting Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sand-200/90 shadow-soft-xs">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-charcoal-700 mr-2 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-terracotta-600" /> Category:
                </span>
                {categories.map(cat => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                        isSelected
                          ? "bg-charcoal-900 text-white font-semibold shadow-soft-xs"
                          : "bg-sand-50 border border-sand-200 text-charcoal-700 hover:bg-sand-100"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              {/* Toggle Filters Drawer / Sort By */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-charcoal-700">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-sand-200 bg-sand-50 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Filters toggle button */}
                <button
                  type="button"
                  onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                    showFiltersDrawer || selectedDuration !== "Any" || selectedPrice !== "Any"
                      ? "bg-terracotta-50 border-terracotta-300 text-terracotta-800"
                      : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>

            </div>

            {/* Secondary Filters Collapsible Drawer (Duration & Price) */}
            <AnimatePresence>
              {showFiltersDrawer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    
                    {/* Duration Filter */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-charcoal-800 uppercase text-[10px] tracking-wider block">
                        Duration Filter
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {durationOptions.map(dur => (
                          <button
                            key={dur}
                            onClick={() => setSelectedDuration(dur)}
                            className={`px-2.5 py-1 rounded-md border text-xs ${
                              selectedDuration === dur
                                ? "bg-charcoal-900 text-white font-semibold"
                                : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-charcoal-800 uppercase text-[10px] tracking-wider block">
                        Price / Person
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {priceOptions.map(pr => (
                          <button
                            key={pr}
                            onClick={() => setSelectedPrice(pr)}
                            className={`px-2.5 py-1 rounded-md border text-xs ${
                              selectedPrice === pr
                                ? "bg-charcoal-900 text-white font-semibold"
                                : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                            }`}
                          >
                            {pr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end justify-start sm:justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-xs text-charcoal-600 hover:text-terracotta-600"
                        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                      >
                        Reset All Filters
                      </Button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Experience Inventory Grid */}
          {recommendationResult.experiences.length === 0 ? (
            <EmptyState
              title="No experiences match current filters"
              description="Try loosening your duration, price, or category filters to see more results."
              actionLabel="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationResult.experiences.map((item, idx) => {
                const isSelected = isExperienceSelected(item.id)

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(0.3, idx * 0.04) }}
                    className="flex"
                  >
                    <Card
                      onClick={() => setActiveExperienceModal(item)}
                      className="overflow-hidden bg-white border-sand-200 shadow-soft-xs hover:shadow-soft-md hover:border-sand-300 transition-all flex flex-col justify-between w-full cursor-pointer group"
                    >
                      <div>
                        {/* Card Image Banner */}
                        <div className="relative h-48 w-full overflow-hidden bg-charcoal-900">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-black/20" />

                          {/* Top Left: Destination Pill */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${getDestinationBadgeStyle(item.destination)}`}>
                              <MapPin className="w-3 h-3" />
                              {item.destination}
                            </span>
                          </div>

                          {/* Top Right: Category & Match Score */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              {item.matchScore}% Match
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-charcoal-900 text-[10px] font-bold uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>

                          {/* Bottom Location & Duration on Image */}
                          <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1 text-sand-200">
                              <span className="line-clamp-1">{item.location}</span>
                            </span>
                            <span className="flex items-center gap-1 shrink-0 font-medium">
                              <Clock className="w-3 h-3 text-terracotta-400" />
                              {item.durationHours}h
                            </span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 sm:p-5 space-y-3">
                          
                          {/* Title & Rating */}
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-serif font-bold text-base text-charcoal-950 leading-snug group-hover:text-terracotta-600 transition-colors line-clamp-1">
                                {item.title}
                              </h3>
                              <span className="flex items-center gap-1 text-xs font-semibold text-charcoal-900 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {item.rating}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Match Rationale Pill with Explainability Button */}
                          <div className="p-2.5 rounded-xl bg-sand-100/70 border border-sand-200/80 text-[11px] text-charcoal-800 leading-relaxed flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <span className="font-semibold text-charcoal-900">Why it matches: </span>
                              <span>{item.matchReasons?.[0] || "Strong alignment with your profile."}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const exp = explainRecommendation(item, tripPreferences, journeyMemory)
                                setExplainModalData(exp)
                              }}
                              className="px-2 py-0.5 rounded-md bg-white border border-sand-300 text-charcoal-700 font-bold hover:bg-sand-50 hover:text-charcoal-900 transition-colors shrink-0 shadow-2xs text-[10px] uppercase tracking-wide cursor-pointer"
                            >
                              Why?
                            </button>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand-100 text-charcoal-700 capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="p-4 sm:p-5 pt-0 border-t border-sand-100 mt-2 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                            Price / Person
                          </span>
                          <span className="text-base font-bold font-serif text-charcoal-950">
                            {formatCurrency(item.pricePerPerson)}
                          </span>
                        </div>

                        {/* ============================================================== */}
                        {/* VALIDATION: IF TRIP NOT BOOKED, DISABLE ADD TO TRIP            */}
                        {/* ============================================================== */}
                        {!isTripBooked ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleExperienceWithValidation(item)
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-500 font-semibold text-xs transition-colors cursor-not-allowed"
                              title="You must plan and book a trip first before adding experiences"
                            >
                              <Lock className="w-3.5 h-3.5 text-charcoal-400" />
                              <span>Add Disabled</span>
                            </button>

                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate('/plan')
                              }}
                              className="bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold shadow-soft-xs"
                              rightIcon={<ArrowRight className="w-3 h-3" />}
                            >
                              Plan Trip
                            </Button>
                          </div>
                        ) : (
                          /* WHEN BOOKED: ALLOW ADDING EXPERIENCES */
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleExperienceWithValidation(item)
                            }}
                            className={
                              isSelected 
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold" 
                                : "bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs font-bold"
                            }
                            leftIcon={isSelected ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                          >
                            {isSelected ? "Added to Journey" : "Add to Journey"}
                          </Button>
                        )}
                      </div>

                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Bottom Callout / Navigation Bar */}
          <div className="p-6 rounded-3xl bg-charcoal-950 text-white border border-charcoal-800 shadow-soft-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-honey-400">
                  {isTripBooked ? 'Active Journey Planning' : 'Trip Orchestration Engine'}
                </span>
                <span className="text-charcoal-500">•</span>
                <span className="text-xs text-charcoal-300">
                  {isTripBooked ? `${selectedExperiences.length} Experiences Staged` : 'Select a destination to customize'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                {isTripBooked 
                  ? 'Ready to view your full day-by-day itinerary?' 
                  : 'Ready to personalize your bespoke trip?'}
              </h3>
              <p className="text-xs text-charcoal-400 max-w-lg">
                {isTripBooked
                  ? `Navora has assembled your itinerary for ${destination.name} with transit buffers and live disruption monitoring.`
                  : 'Select your destination or start the 7-step planning process to unlock automatic itinerary scheduling and dynamic adaptation.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isTripBooked ? (
                <Button
                  size="lg"
                  onClick={() => navigate('/itinerary')}
                  className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-lg px-8 font-semibold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Booked Itinerary
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate('/itinerary')}
                  className="w-full sm:w-auto bg-gradient-to-r from-coral-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 text-white shadow-warm-coral px-8 font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Confirm Experiences & View Itinerary ➔
                </Button>
              )}
            </div>
          </div>

        </div>

        {/* Experience Detail Modal with isTripBooked validation */}
        <ExperienceDetailDialog
          experience={activeExperienceModal}
          isOpen={Boolean(activeExperienceModal)}
          onClose={() => setActiveExperienceModal(null)}
          isSelected={activeExperienceModal ? isExperienceSelected(activeExperienceModal.id) : false}
          onToggleSelect={() => activeExperienceModal && handleToggleExperienceWithValidation(activeExperienceModal)}
          adultCount={adultCount}
          isTripBooked={isTripBooked}
        />

        {/* Deterministic Optimization Dialog */}
        <OptimizePicksDialog
          isOpen={showOptimizeModal}
          onClose={() => setShowOptimizeModal(false)}
          optimizationResults={optimizationResults}
          onApplyOptimizedSet={(optimizedExperienceIds) => {
            if (!isTripBooked) {
              setValidationAlert("Cannot apply picks: Trip booking is required before optimizing journey experiences.")
              setShowOptimizeModal(false)
              return
            }
            const allAvailable = recommendationResult.experiences
            optimizedExperienceIds.forEach(id => {
              const exp = allAvailable.find(e => e.id === id)
              if (exp && !isExperienceSelected(id)) {
                toggleExperience(exp)
              }
            })
            setShowOptimizeModal(false)
          }}
        />

        {/* Explainability Detail Modal */}
        <ExplainabilityModal
          isOpen={Boolean(explainModalData)}
          onClose={() => setExplainModalData(null)}
          explanation={explainModalData}
        />

      </div>
    </PageTransition>
  )
}

export default Recommendations
