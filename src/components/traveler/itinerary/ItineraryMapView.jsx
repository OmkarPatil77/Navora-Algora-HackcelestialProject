import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Navigation, Compass, Sparkles, Clock, Car, 
  ArrowDown, ArrowRight, ArrowLeft, CheckCircle2, ExternalLink, 
  Star, Route, Layers, Search, Filter, Phone, Share2, Info, CloudRain 
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { calculateDistanceKm } from '@/services/itineraryEngine'
import { formatCurrency } from '@/lib/utils'
import { calculateEntityWeatherImpact } from '@/services/weatherTwinEngine'

export const ItineraryMapView = ({
  dayItems = [],
  dayTitle = "Day Route",
  dayNumber = 1,
  city = "Goa",
  selectedItemId = null,
  onSelectStop
}) => {
  // Filter out non-location buffer items
  const stops = dayItems.filter(item => item.type !== 'buffer')

  // Selected stop state
  const [activeStopId, setActiveStopId] = useState(() => {
    return selectedItemId || (stops[0]?.id || null)
  })

  // Mode: 'place' (pinpoint single stop) | 'navigate' (previous stop -> current/next stop) | 'day-route' (full day sequence)
  const [mapMode, setMapMode] = useState('place')
  // Active navigation leg: { fromIndex: number, toIndex: number }
  const [activeNavLeg, setActiveNavLeg] = useState(null)
  // Category filter
  const [categoryFilter, setCategoryFilter] = useState('all')
  // Weather Risk Overlay state
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true)

  // Sync if parent updates selectedItemId
  useEffect(() => {
    if (selectedItemId) {
      setActiveStopId(selectedItemId)
    }
  }, [selectedItemId])

  // Current active index in stops array
  const currentIndex = Math.max(0, stops.findIndex(s => s.id === activeStopId))
  const currentSelectedStop = stops[currentIndex] || stops[0] || {
    id: "default-stop",
    title: `${city} Central`,
    location: city,
    type: "experience",
    startTime: "09:00 AM"
  }

  // Previous and Next stop in sequence
  const prevStop = currentIndex > 0 ? stops[currentIndex - 1] : null
  const nextStop = currentIndex < stops.length - 1 ? stops[currentIndex + 1] : null

  // Calculate cumulative route distance
  let totalRouteKm = 0
  for (let i = 0; i < stops.length - 1; i++) {
    totalRouteKm += calculateDistanceKm(stops[i].coordinates, stops[i + 1].coordinates)
  }

  // Filtered stops for sidebar
  const filteredStops = stops.filter(s => {
    if (categoryFilter === 'all') return true
    if (categoryFilter === 'hotel') return s.type === 'hotel'
    if (categoryFilter === 'meal') return s.type === 'meal'
    if (categoryFilter === 'experience') return s.type === 'experience' || s.type === 'flight'
    return true
  })

  // Helper to format clean geocodable place name for Google Maps
  const getGoogleMapsSearchQuery = (stop) => {
    if (!stop) return `${city}, India`
    const title = stop.title || ""
    const loc = stop.location || ""
    if (stop.type === 'flight' || title.toLowerCase().includes('flight') || title.toLowerCase().includes('arrival')) {
      return `${city} Airport, ${city}`
    }
    return `${title}, ${loc}, ${city}`
  }

  // Helper for directions coordinate or address
  const getDirectionsQuery = (stop) => {
    if (!stop) return `${city}, India`
    if (stop.coordinates?.lat && stop.coordinates?.lng) {
      return `${stop.coordinates.lat},${stop.coordinates.lng}`
    }
    return getGoogleMapsSearchQuery(stop)
  }

  // Resolve navigation origin & destination based on activeNavLeg or current stop
  let navOriginStop = prevStop || stops[0]
  let navDestStop = currentSelectedStop

  if (activeNavLeg) {
    navOriginStop = stops[activeNavLeg.fromIndex] || stops[0]
    navDestStop = stops[activeNavLeg.toIndex] || stops[1] || stops[0]
  }

  const navOriginQuery = getDirectionsQuery(navOriginStop)
  const navDestQuery = getDirectionsQuery(navDestStop)

  // Construct dynamic Google Maps embed URL
  let googleMapsEmbedUrl = ""
  if (mapMode === 'navigate') {
    // Turn-by-turn route between previous stop and next/selected stop
    googleMapsEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(navOriginQuery)}&daddr=${encodeURIComponent(navDestQuery)}&output=embed`
  } else if (mapMode === 'day-route' && stops.length > 1) {
    // Full day overview route
    const firstStopQuery = getDirectionsQuery(stops[0])
    const lastStopQuery = getDirectionsQuery(stops[stops.length - 1])
    googleMapsEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(firstStopQuery)}&daddr=${encodeURIComponent(lastStopQuery)}&output=embed`
  } else {
    // Precise pinpoint of single location
    const pinpointQuery = currentSelectedStop.coordinates?.lat && currentSelectedStop.coordinates?.lng
      ? `${currentSelectedStop.coordinates.lat},${currentSelectedStop.coordinates.lng}`
      : getGoogleMapsSearchQuery(currentSelectedStop)
    googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(pinpointQuery)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`
  }

  // Direct external Google Maps URLs
  const externalPinpointUrl = currentSelectedStop.coordinates?.lat && currentSelectedStop.coordinates?.lng
    ? `https://www.google.com/maps/search/?api=1&query=${currentSelectedStop.coordinates.lat},${currentSelectedStop.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getGoogleMapsSearchQuery(currentSelectedStop))}`

  const externalTurnByTurnUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(navOriginQuery)}&destination=${encodeURIComponent(navDestQuery)}&travelmode=driving`

  // Handler: select stop & pinpoint on map
  const handleSelectStop = (stop) => {
    setActiveStopId(stop.id)
    setMapMode('place')
    setActiveNavLeg(null)
    if (onSelectStop) onSelectStop(stop)
  }

  // Handler: Navigate from previous stop to current stop
  const handleNavigateFromPrevious = () => {
    if (prevStop) {
      const fromIdx = currentIndex - 1
      const toIdx = currentIndex
      setActiveNavLeg({ fromIndex: fromIdx, toIndex: toIdx })
      setMapMode('navigate')
    } else if (nextStop) {
      handleNavigateToNext()
    }
  }

  // Handler: Navigate to next stop
  const handleNavigateToNext = () => {
    if (nextStop) {
      const fromIdx = currentIndex
      const toIdx = currentIndex + 1
      setActiveNavLeg({ fromIndex: fromIdx, toIndex: toIdx })
      setActiveStopId(nextStop.id)
      setMapMode('navigate')
      if (onSelectStop) onSelectStop(nextStop)
    }
  }

  // Handler: Specific Leg Navigation (e.g. Stop i -> Stop i+1)
  const handleNavigateSpecificLeg = (fromIdx, toIdx) => {
    setActiveNavLeg({ fromIndex: fromIdx, toIndex: toIdx })
    setActiveStopId(stops[toIdx].id)
    setMapMode('navigate')
    if (onSelectStop) onSelectStop(stops[toIdx])
  }

  // Metadata for current place
  const getPlaceMetadata = (stop) => {
    const t = (stop.type || "").toLowerCase()
    if (t === 'hotel') return { category: 'Boutique Hotel & Resort', rating: 4.8, reviews: 1420, openStatus: 'Open 24 Hours' }
    if (t === 'meal') return { category: 'Authentic Coastal Dining', rating: 4.6, reviews: 890, openStatus: 'Open Now • Closes 10:30 PM' }
    if (t === 'flight') return { category: 'Airport & Aviation Terminal', rating: 4.5, reviews: 5200, openStatus: 'Open 24 Hours' }
    return { category: 'Curated Sightseeing & Activity', rating: 4.7, reviews: 2150, openStatus: 'Open Now • 9:00 AM – 6:30 PM' }
  }

  const placeMeta = getPlaceMetadata(currentSelectedStop)

  // Leg transit time & distance
  const legDistanceKm = prevStop ? calculateDistanceKm(prevStop.coordinates, currentSelectedStop.coordinates) : 12
  const legDurationMin = Math.max(15, Math.round((legDistanceKm / 30) * 60 + 5))

  return (
    <div className="space-y-6">
      
      {/* Route Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-50 border border-terracotta-200/80 flex items-center justify-center text-terracotta-700 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950">
                Google Maps Navigation & Pinpoint Explorer
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Live Google Maps</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Day 0{dayNumber} • {stops.length} Sequential Stops • Est. {Math.round(totalRouteKm || 28)} km total route
            </p>
          </div>
        </div>

        {/* Mode Selector & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mode Tabs */}
          <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1 border border-sand-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setMapMode('place')
                setActiveNavLeg(null)
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                mapMode === 'place'
                  ? 'bg-white text-charcoal-950 shadow-soft-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Pinpoint Place</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigateFromPrevious()}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                mapMode === 'navigate'
                  ? 'bg-white text-charcoal-950 shadow-soft-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Navigate Leg</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMapMode('day-route')
                setActiveNavLeg(null)
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                mapMode === 'day-route'
                  ? 'bg-white text-charcoal-950 shadow-soft-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Route className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Full Route</span>
            </button>
          </div>

          {/* Weather Twin Risk Layer Toggle */}
          <button
            type="button"
            onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showWeatherOverlay
                ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-soft-xs'
                : 'bg-white border-sand-300 text-charcoal-700 hover:bg-sand-50'
            }`}
          >
            <CloudRain className={`w-3.5 h-3.5 ${showWeatherOverlay ? 'text-cyan-600 animate-pulse' : 'text-charcoal-400'}`} />
            <span>{showWeatherOverlay ? 'Weather Twin: ON' : 'Weather Twin: OFF'}</span>
          </button>

          {/* External Google Maps Button */}
          <a
            href={mapMode === 'navigate' ? externalTurnByTurnUrl : externalPinpointUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold shadow-soft-xs transition-colors"
          >
            <span>{mapMode === 'navigate' ? 'Start GPS Navigation' : 'Open in Google Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-sand-200" />
          </a>
        </div>
      </div>

      {/* Main Layout: Google Map & Controls (8 cols) + Sequential Waypoints (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Map & Place Details Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Navigation HUD Banner (when in navigate mode) */}
          {mapMode === 'navigate' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-terracotta-600 via-amber-600 to-terracotta-700 text-white shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    <Navigation className="w-3 h-3" />
                    <span>Live Navigation Route</span>
                  </span>
                  <span className="text-xs font-bold text-sand-100">
                    ~{legDurationMin} mins ({legDistanceKm} km)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold pt-0.5">
                  <span className="truncate max-w-[180px] sm:max-w-[240px] text-white">
                    {navOriginStop.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-200 shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[240px] text-amber-100">
                    {navDestStop.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={externalTurnByTurnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white text-charcoal-950 hover:bg-sand-50 text-xs font-bold shadow-soft-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Start Turn-by-Turn GPS</span>
                  <ExternalLink className="w-3 h-3 text-terracotta-600" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Google Maps Container */}
          <div className="rounded-2xl bg-white border border-sand-200 overflow-hidden shadow-soft-xs">
            {/* Top Toolbar */}
            <div className="p-3.5 bg-sand-50/90 border-b border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600 shrink-0" />
                <span className="font-semibold text-charcoal-900">
                  {mapMode === 'navigate'
                    ? `🚗 Route: ${navOriginStop.title} → ${navDestStop.title}`
                    : mapMode === 'day-route'
                    ? `🗺️ Day 0${dayNumber} Complete Route Overview (${stops.length} Stops)`
                    : `📍 Pinned: Stop 0${currentIndex + 1} • ${currentSelectedStop.title}`}
                </span>
              </div>

              {/* Prev / Next quick stepper */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!prevStop}
                  onClick={() => prevStop && handleSelectStop(prevStop)}
                  className="px-2 py-1 rounded-lg bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-100 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Prev Stop</span>
                </button>

                <button
                  type="button"
                  disabled={!nextStop}
                  onClick={() => nextStop && handleSelectStop(nextStop)}
                  className="px-2 py-1 rounded-lg bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-100 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next Stop</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className="relative h-[380px] sm:h-[460px] w-full bg-sand-100">
              <iframe
                title="Google Maps Pinpoint & Navigation"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Overlaid Floating Pinpoint Tag (Place Mode) */}
              {mapMode === 'place' && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-sand-200 shadow-soft-md text-xs text-charcoal-800 space-y-0.5 pointer-events-none max-w-xs">
                  <div className="flex items-center gap-1.5 font-bold text-terracotta-700 text-[11px] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 fill-terracotta-600 text-terracotta-600 animate-bounce" />
                    <span>PINPOINT LOCATION • STOP 0{currentIndex + 1}</span>
                  </div>
                  <div className="font-serif font-bold text-charcoal-950 text-sm truncate">
                    {currentSelectedStop.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {currentSelectedStop.location || `${city}, Goa`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Google Places Card with Direct Navigation Actions */}
          <motion.div
            key={currentSelectedStop.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-4"
          >
            {/* Header & Category */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sand-100 text-charcoal-800 border border-sand-200">
                    {placeMeta.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {placeMeta.openStatus}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-1">
                  {currentSelectedStop.title}
                </h4>

                <p className="text-xs text-charcoal-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                  <span>{currentSelectedStop.location || `${city}, Goa`}</span>
                </p>
              </div>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-sm text-charcoal-950">{placeMeta.rating}</span>
                </div>
                <span className="text-[11px] text-amber-800 font-medium">({placeMeta.reviews} Google reviews)</span>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-sand-100">
              <div className="p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/80">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Scheduled Time</span>
                <span className="font-serif font-bold text-charcoal-950 mt-0.5 block">{currentSelectedStop.startTime || "02:00 PM"}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/80">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Duration</span>
                <span className="font-serif font-bold text-charcoal-950 mt-0.5 block">{currentSelectedStop.durationMinutes || 90} mins</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/80">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Estimated Price</span>
                <span className="font-serif font-bold text-charcoal-950 mt-0.5 block">
                  {currentSelectedStop.cost > 0 ? formatCurrency(currentSelectedStop.cost) : "Free / Included"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/80">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Transfer Mode</span>
                <span className="font-serif font-bold text-charcoal-950 mt-0.5 block">🚕 Cab Arranged</span>
              </div>
            </div>

            {/* Primary Navigation Actions */}
            <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-terracotta-600 shrink-0" />
                <span className="text-xs text-charcoal-800 font-medium">
                  {prevStop
                    ? `Transit from ${prevStop.title}: ~${legDurationMin} mins (${legDistanceKm} km)`
                    : 'Origin stop for Day 1'}
                </span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                {prevStop && (
                  <button
                    type="button"
                    onClick={handleNavigateFromPrevious}
                    className="px-3 py-1.5 rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-soft-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate from Prev Stop</span>
                  </button>
                )}

                {nextStop && (
                  <button
                    type="button"
                    onClick={handleNavigateToNext}
                    className="px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold shadow-soft-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Navigate to Next Stop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </motion.div>

        </div>

        {/* Sequential Waypoints Column with Interactive Navigation Legs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Header & Filter Pills */}
          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-charcoal-950 uppercase tracking-wider text-[11px]">
                Day {dayNumber} Sequential Waypoints
              </h4>
              <span className="text-[10px] text-muted-foreground font-mono">{stops.length} Stops</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
              {[
                { id: 'all', label: 'All Stops' },
                { id: 'hotel', label: '🏨 Stays' },
                { id: 'meal', label: '🍽 Dining' },
                { id: 'experience', label: '🏖 Sights' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    categoryFilter === f.id
                      ? 'bg-charcoal-900 text-white shadow-soft-xs'
                      : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sequential Stops List with Transit Leg Navigation Buttons */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredStops.map((stop, idx) => {
              const isSelected = currentSelectedStop.id === stop.id
              const stopNumber = stops.findIndex(s => s.id === stop.id) + 1
              const nextStopInFullList = stops[stopNumber] // index stopNumber in 0-indexed is stopNumber + 1

              return (
                <div key={stop.id} className="space-y-2">
                  {/* Waypoint Card */}
                  <div
                    onClick={() => handleSelectStop(stop)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-terracotta-50/90 border-terracotta-500 shadow-soft-sm ring-1 ring-terracotta-300'
                        : 'bg-white border-sand-200 hover:border-sand-300 hover:bg-sand-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isSelected ? 'bg-terracotta-600 text-white' : 'bg-sand-200 text-charcoal-800'
                        }`}>
                          {stopNumber}
                        </span>
                        <span className="font-mono font-bold text-[10px] text-terracotta-700 uppercase">
                          STOP 0{stopNumber}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-charcoal-500 bg-sand-100 px-2 py-0.5 rounded">
                        {stop.startTime}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-charcoal-950 text-xs sm:text-sm mt-1 leading-snug">
                      {stop.title}
                    </h5>

                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-terracotta-600 shrink-0" />
                      <span className="truncate">{stop.location || `${city}, Goa`}</span>
                    </p>

                    {showWeatherOverlay && (() => {
                      const impact = calculateEntityWeatherImpact(stop, { rainfall: 80, temperature: 27, windSpeed: 35 })
                      return (
                        <div className="mt-2 pt-1.5 border-t border-sand-100 flex items-center justify-between text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                            impact.riskLevel === 'SEVERE' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                            impact.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            impact.riskLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' :
                            'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {impact.riskLevel === 'SEVERE' ? '🔴' : impact.riskLevel === 'HIGH' ? '🟠' : impact.riskLevel === 'MODERATE' ? '🟡' : '🟢'} {impact.riskLevel} ({impact.disruptionProb}%)
                          </span>
                          <span className="text-sand-500 font-mono text-[9px]">{impact.sensitivities?.type || 'facility'}</span>
                        </div>
                      )
                    })()}

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-terracotta-200/80 flex items-center justify-between text-[10px] font-semibold text-terracotta-800">
                        <span>📍 Pinpointed on Map</span>
                        <span>Click to center</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Transit Navigation Leg between this stop and the next */}
                  {idx < filteredStops.length - 1 && nextStopInFullList && (
                    <div className="py-1 px-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigateSpecificLeg(stopNumber - 1, stopNumber)
                        }}
                        className={`w-full py-1.5 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all group ${
                          activeNavLeg?.fromIndex === stopNumber - 1 && activeNavLeg?.toIndex === stopNumber
                            ? 'bg-terracotta-600 text-white border-terracotta-700 shadow-soft-xs'
                            : 'bg-sand-100 hover:bg-sand-200/80 text-charcoal-800 border-sand-200/80'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-terracotta-600 group-hover:scale-110 transition-transform" />
                          <span>Navigate: Stop 0{stopNumber} → Stop 0{stopNumber + 1}</span>
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">
                          ~{Math.max(15, Math.round(calculateDistanceKm(stop.coordinates, nextStopInFullList.coordinates) * 2))}m
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>

      </div>

    </div>
  )
}
