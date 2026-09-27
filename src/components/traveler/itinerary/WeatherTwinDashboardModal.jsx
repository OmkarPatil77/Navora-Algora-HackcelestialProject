import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloudRain, Wind, Thermometer, Sparkles, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, X, Radio, 
  Layers, MapPin, Eye, Check, ChevronRight, Share2 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { 
  fetchLiveWeatherForLocation, 
  propagateWeatherCascade, 
  generateWeatherTwinAiRecommendation,
  applyWeatherTwinAdaptationToItinerary
} from '@/services/weatherTwinEngine'
import { WeatherTwinRiskMap } from '@/components/traveler/itinerary/WeatherTwinRiskMap'

export const WeatherTwinDashboardModal = ({
  isOpen,
  onClose,
  itinerary,
  tripPreferences,
  onApplyWeatherChanges,
  onApplyAdaptation
}) => {
  const city = tripPreferences?.destination?.city || itinerary?.destination?.city || "Goa"
  const lat = tripPreferences?.destination?.coordinates?.lat || 15.38
  const lng = tripPreferences?.destination?.coordinates?.lng || 73.83

  // Live Weather State
  const [liveWeather, setLiveWeather] = useState(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)

  // What-If Interactive Sliders State (Cloned Simulation State)
  const [weatherScenario, setWeatherScenario] = useState({
    rainfall: 80, // mm
    temperature: 27, // °C
    windSpeed: 35, // km/h
    stormDuration: 6 // hours
  })

  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'impact_radius' | 'ai_replan' | 'signals'

  // Fetch Live Weather when modal opens
  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    setIsLoadingWeather(true)
    fetchLiveWeatherForLocation(lat, lng, city).then(wData => {
      if (isMounted) {
        setLiveWeather(wData)
        setIsLoadingWeather(false)
      }
    })
    return () => { isMounted = false }
  }, [isOpen, lat, lng, city])

  // Compute Cascading Impact Analysis (Runs deterministically on cloned scenario)
  const cascadeAnalysis = propagateWeatherCascade(itinerary, weatherScenario, tripPreferences)
  const aiRecommendation = generateWeatherTwinAiRecommendation(cascadeAnalysis, itinerary)

  const handleApply = () => {
    const adapted = applyWeatherTwinAdaptationToItinerary(itinerary, cascadeAnalysis, aiRecommendation)
    if (onApplyWeatherChanges) {
      onApplyWeatherChanges(cascadeAnalysis, aiRecommendation, adapted)
    }
    if (onApplyAdaptation) {
      onApplyAdaptation(cascadeAnalysis, aiRecommendation, adapted)
    }
    onClose()
  }

  const handleResetToLive = () => {
    if (liveWeather) {
      setWeatherScenario({
        rainfall: liveWeather.rainfall || 5,
        temperature: liveWeather.temperature || 28,
        windSpeed: liveWeather.windSpeed || 14,
        stormDuration: 2
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl rounded-3xl bg-white border border-sand-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto"
          >
          {/* Header Bar */}
          <div className="p-6 bg-gradient-to-r from-navy-900 via-navy-950 to-charcoal-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <CloudRain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    NAVORA Weather Twin • Digital Simulation Layer
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-sand-200 border border-white/20">
                    Sense → Propagate → Adapt
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mt-0.5">
                  Weather-Driven Journey Twin for {city}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sand-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Telemetry Summary Banner */}
          <div className="bg-sand-100/80 px-6 py-3 border-b border-sand-200 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 font-semibold text-navy-900">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Live Location Telemetry ({city}):</span>
              </div>
              {isLoadingWeather ? (
                <span className="text-sand-600">Connecting to Open-Meteo...</span>
              ) : (
                <div className="flex items-center gap-3 text-charcoal-700">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-coral-500" /> {liveWeather?.temperature}°C</span>
                  <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-cyan-600" /> {liveWeather?.rainfall}mm Rain</span>
                  <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-navy-600" /> {liveWeather?.windSpeed} km/h</span>
                  <span className="text-sand-500">({liveWeather?.condition})</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetToLive}
              className="text-[11px] font-bold text-terracotta-600 hover:text-terracotta-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Sliders to Live Weather
            </button>
          </div>

          {/* Content Canvas */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-sand-200 pb-2">
              {[
                { id: 'simulator', label: '1. What-If Weather Simulator', icon: CloudRain },
                { id: 'impact_radius', label: '2. Impact Radius & Cascade', icon: Layers },
                { id: 'ai_replan', label: '3. AI Adaptive Recommendation', icon: Sparkles },
                { id: 'signals', label: '4. Public & Social Signals', icon: Radio }
              ].map(t => {
                const Icon = t.icon
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-navy-900 text-white shadow-soft-xs"
                        : "bg-sand-50 border border-sand-200 text-charcoal-700 hover:bg-sand-100"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-coral-500'}`} />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB 1: WHAT-IF WEATHER SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sliders Container (6 cols) */}
                <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl bg-sand-50/70 border border-sand-200">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                    <h3 className="text-sm font-serif font-bold text-navy-900 flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-cyan-600" />
                      <span>Simulated Weather Scenario</span>
                    </h3>
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-[10px] font-bold">
                      Cloned Simulation (Real Trip Safe)
                    </Badge>
                  </div>

                  {/* Rainfall Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-navy-900">Rainfall Volume</span>
                      <span className="font-mono font-bold text-coral-600">{weatherScenario.rainfall} mm/hr</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={weatherScenario.rainfall}
                      onChange={e => setWeatherScenario({ ...weatherScenario, rainfall: Number(e.target.value) })}
                      className="w-full accent-coral-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-sand-500 font-mono">
                      <span>0mm (Dry)</span>
                      <span>30mm (Moderate)</span>
                      <span>80mm (Extreme Rain)</span>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-navy-900">Temperature</span>
                      <span className="font-mono font-bold text-navy-900">{weatherScenario.temperature}°C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="45"
                      step="1"
                      value={weatherScenario.temperature}
                      onChange={e => setWeatherScenario({ ...weatherScenario, temperature: Number(e.target.value) })}
                      className="w-full accent-navy-900 cursor-pointer h-2 bg-sand-200 rounded-lg"
                    />
                  </div>

                  {/* Wind Speed Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-navy-900">Wind Speed</span>
                      <span className="font-mono font-bold text-navy-900">{weatherScenario.windSpeed} km/h</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={weatherScenario.windSpeed}
                      onChange={e => setWeatherScenario({ ...weatherScenario, windSpeed: Number(e.target.value) })}
                      className="w-full accent-cyan-600 cursor-pointer h-2 bg-sand-200 rounded-lg"
                    />
                  </div>

                  {/* Quick Hackathon Demo Presets */}
                  <div className="pt-2 border-t border-sand-200">
                    <span className="text-[11px] font-bold text-navy-900 block mb-2">Hackathon Demo Presets:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setWeatherScenario({ rainfall: 80, temperature: 27, windSpeed: 38, stormDuration: 6 })}
                        className="text-xs bg-rose-50 border-rose-200 text-rose-900 font-bold hover:bg-rose-100"
                      >
                        ⚡ 80mm Extreme Rain
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setWeatherScenario({ rainfall: 5, temperature: 29, windSpeed: 12, stormDuration: 1 })}
                        className="text-xs bg-emerald-50 border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-100"
                      >
                        ☀️ 5mm Normal Sun
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instant Twin Analysis Preview (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-navy-900">Twin Risk Metrics</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cascadeAnalysis.overallRiskLevel === 'HIGH' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                        cascadeAnalysis.overallRiskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        Overall Trip Risk: {cascadeAnalysis.overallTripRiskScore}% ({cascadeAnalysis.overallRiskLevel})
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200">
                        <span className="text-lg font-bold font-mono text-rose-600">{cascadeAnalysis.directImpacts.length}</span>
                        <span className="text-[10px] text-charcoal-600 block font-semibold">Direct Disruptions</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200">
                        <span className="text-lg font-bold font-mono text-amber-600">{cascadeAnalysis.secondaryImpacts.length}</span>
                        <span className="text-[10px] text-charcoal-600 block font-semibold">Transit Cascades</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200">
                        <span className="text-lg font-bold font-mono text-navy-900">{cascadeAnalysis.higherOrderImpacts.length}</span>
                        <span className="text-[10px] text-charcoal-600 block font-semibold">Schedule Shifts</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Rationale Card */}
                  <div className="p-4 rounded-2xl bg-navy-900 text-white space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Weather Twin Impact Explanation</span>
                    </div>
                    <p className="text-xs text-sand-200 leading-relaxed">
                      {aiRecommendation.summary}
                    </p>
                  </div>

                  {/* Preference DNA Comparative Sensitivity */}
                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Preference DNA Sensitivity Profile</span>
                      </span>
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-[10px] font-bold">
                        {cascadeAnalysis.travelerDnaSummary?.travelerType || 'Traveler DNA Profile'}
                      </Badge>
                    </div>
                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      {cascadeAnalysis.travelerDnaSummary?.multiplierExplanation}
                    </p>
                    <div className="text-[11px] font-mono text-sand-700 bg-white p-2.5 rounded-xl border border-sand-200">
                      💡 {cascadeAnalysis.travelerDnaSummary?.comparativeInsight}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: IMPACT RADIUS & DIGITAL TWIN RISK MAP */}
            {activeTab === 'impact_radius' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-navy-900">
                      Digital Twin Map & Cascading Impact Radius
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      Relationships: Weather ➔ Activity ➔ Transport ➔ Restaurant ➔ Traveler Schedule
                    </p>
                  </div>
                  <Badge variant="outline" className="border-sand-300 text-xs font-bold">
                    {cascadeAnalysis.totalAffectedCount} Connected Nodes Monitored
                  </Badge>
                </div>

                {/* Digital Twin Interactive Map */}
                <WeatherTwinRiskMap
                  cascadeAnalysis={cascadeAnalysis}
                  itinerary={itinerary}
                  cityName={city}
                />

                <div className="space-y-3">
                  {/* Direct Impact Nodes */}
                  <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      Order 1 • Direct Weather Impact (High Exposure)
                    </span>
                    {cascadeAnalysis.directImpacts.length === 0 ? (
                      <p className="text-xs text-rose-800">No direct outdoor disruptions detected under current scenario.</p>
                    ) : (
                      cascadeAnalysis.directImpacts.map((node, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-rose-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-navy-900 block">{node.entityTitle}</span>
                            <span className="text-[11px] text-rose-800">{node.rationale}</span>
                          </div>
                          <Badge className="bg-rose-600 text-white font-mono text-xs">{node.disruptionProb}% Risk</Badge>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Secondary Transit Cascade */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      Order 2 • Secondary Transit Cascade
                    </span>
                    {cascadeAnalysis.secondaryImpacts.length === 0 ? (
                      <p className="text-xs text-amber-800">Transit routes running on schedule.</p>
                    ) : (
                      cascadeAnalysis.secondaryImpacts.map((node, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-navy-900 block">{node.entityTitle}</span>
                            <span className="text-[11px] text-amber-800">{node.rationale}</span>
                          </div>
                          <Badge className="bg-amber-600 text-white font-mono text-xs">+{node.delayMinutes} min Delay</Badge>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Higher Order Schedule Shifts */}
                  <div className="p-4 rounded-2xl bg-sand-100/80 border border-sand-300 space-y-2">
                    <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-navy-600" />
                      Order 3 • Higher Order Reservation & Hotel Schedule Shifts
                    </span>
                    {cascadeAnalysis.higherOrderImpacts.length === 0 ? (
                      <p className="text-xs text-charcoal-600">Dining & hotel check-in times unaffected.</p>
                    ) : (
                      cascadeAnalysis.higherOrderImpacts.map((node, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-sand-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-navy-900 block">{node.entityTitle}</span>
                            <span className="text-[11px] text-charcoal-600">{node.rationale}</span>
                          </div>
                          <Badge variant="outline" className="border-navy-300 text-navy-900 font-mono text-xs">Shifted ~{node.delayMinutes} min</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AI ADAPTIVE RECOMMENDATION */}
            {activeTab === 'ai_replan' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-950 to-charcoal-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Gemini Weather Adaptation Reasoning</span>
                    </div>
                    <span className="text-[11px] text-sand-300 font-mono">Confidence: High</span>
                  </div>

                  <p className="text-xs sm:text-sm text-sand-100 leading-relaxed font-serif">
                    "{aiRecommendation.summary}"
                  </p>

                  <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-xs">
                    <span className="font-bold text-amber-200">Preserved Traveler DNA:</span>
                    {aiRecommendation.preservedPreferences.map(pref => (
                      <span key={pref} className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-semibold">
                        ✓ {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Swaps Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">Recommended Itinerary Swaps:</h4>
                  {aiRecommendation.recommendedSwaps.length === 0 ? (
                    <p className="text-xs text-charcoal-600">No activity swaps required for low rain intensity.</p>
                  ) : (
                    aiRecommendation.recommendedSwaps.map((swap, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-rose-700 font-semibold">{swap.originalItem}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold text-emerald-950">{swap.suggestedAlternative}</span>
                          </div>
                          <p className="text-[11px] text-emerald-800">{swap.reasoning}</p>
                        </div>
                        <Badge className="bg-emerald-600 text-white shrink-0">Weather-Safe Alternative</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: PUBLIC & SOCIAL SIGNALS */}
            {activeTab === 'signals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-navy-900 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-coral-500 animate-pulse" />
                    <span>Public & Social Telemetry Feed</span>
                  </h3>
                  <Badge variant="outline" className="border-sand-300 text-xs font-bold">
                    {cascadeAnalysis.publicSignals.length} Active Public Signals
                  </Badge>
                </div>

                <div className="space-y-3">
                  {cascadeAnalysis.publicSignals.length === 0 ? (
                    <p className="text-xs text-charcoal-600 p-4 rounded-xl bg-sand-50 border border-sand-200">
                      No public hazard alerts reported for {city} region under current weather scenario.
                    </p>
                  ) : (
                    cascadeAnalysis.publicSignals.map(sig => (
                      <div key={sig.id} className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-coral-500" />
                            {sig.signal}
                          </span>
                          <span className="text-[10px] text-sand-500 font-mono">{sig.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-charcoal-600">Location: <span className="font-semibold">{sig.location}</span> • Source: {sig.source}</p>
                        <div className="flex items-center gap-2 text-[10px] font-mono pt-1 text-sand-600">
                          <span>Severity: {Math.round(sig.severity * 100)}%</span>
                          <span>•</span>
                          <span>Confidence: {Math.round(sig.confidence * 100)}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="p-5 bg-sand-50 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="text-xs text-[#5E6282]">
              <span>Scenario Impact: </span>
              <span className="font-bold text-navy-900">{cascadeAnalysis.totalAffectedCount} nodes affected</span>
              <span className="text-sand-400"> • </span>
              <span>Trip Risk: </span>
              <span className="font-bold text-coral-600">{cascadeAnalysis.overallTripRiskScore}%</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-initial text-xs font-semibold"
              >
                Keep Current Plan
              </Button>
              <Button
                type="button"
                onClick={handleApply}
                className="flex-1 sm:flex-initial bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-warm-coral"
                rightIcon={<Check className="w-4 h-4 text-emerald-400" />}
              >
                Apply Weather Adaptation
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}

export default WeatherTwinDashboardModal
