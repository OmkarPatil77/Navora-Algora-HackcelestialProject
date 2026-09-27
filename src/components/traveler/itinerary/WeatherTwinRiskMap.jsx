import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloudRain, Wind, AlertTriangle, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, Waves, Hotel, Utensils, Navigation, 
  Layers, Compass, Info, Radio
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const WeatherTwinRiskMap = ({
  cascadeAnalysis,
  itinerary,
  cityName = "Goa"
}) => {
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [viewMode, setViewMode] = useState('topology') // 'topology' | 'geographic'

  const rainfall = cascadeAnalysis?.scenario?.rainfall ?? 5
  const directImpacts = cascadeAnalysis?.directImpacts || []
  const secondaryImpacts = cascadeAnalysis?.secondaryImpacts || []
  const higherOrderImpacts = cascadeAnalysis?.higherOrderImpacts || []

  // Construct structured Digital Twin entities graph for the active journey
  const twinNodes = [
    {
      id: "node-hotel",
      type: "hotel",
      title: "Heritage Boutique Villa & Resort",
      subLabel: "Base Station Check-in",
      location: "Panjim Riverside, Goa",
      icon: Hotel,
      riskLevel: rainfall > 70 ? "MODERATE" : "LOW",
      riskColor: rainfall > 70 ? "yellow" : "green",
      disruptionProb: rainfall > 70 ? 25 : 5,
      delayMinutes: 0,
      sensitivity: "Indoor (Rain: 0.05, Wind: 0.10)",
      coordinates: { x: 90, y: 70 },
      geoCoords: { lat: 15.501, lng: 73.815 }
    },
    {
      id: "node-activity",
      type: "outdoor_activity",
      title: "Baga Beach Water Sports & Jet Ski",
      subLabel: "Primary Outdoor Experience",
      location: "Baga Beach Shoreline, North Goa",
      icon: Waves,
      riskLevel: directImpacts.length > 0 ? (directImpacts[0].riskLevel || "SEVERE") : (rainfall > 35 ? "HIGH" : "LOW"),
      riskColor: directImpacts.length > 0 ? (directImpacts[0].riskColor || "red") : (rainfall > 35 ? "orange" : "green"),
      disruptionProb: directImpacts.length > 0 ? directImpacts[0].disruptionProb : Math.min(95, Math.round(rainfall * 1.1)),
      delayMinutes: directImpacts.length > 0 ? directImpacts[0].delayMinutes : 0,
      sensitivity: "High Coastal Exposure (Rain: 0.95, Wind: 0.85)",
      coordinates: { x: 270, y: 70 },
      geoCoords: { lat: 15.555, lng: 73.751 }
    },
    {
      id: "node-transport",
      type: "transport",
      title: "Coastal Highway Transfer Cab",
      subLabel: "Transport Route Leg 02",
      location: "Baga Beach → Waterfront Bistro",
      icon: Navigation,
      riskLevel: secondaryImpacts.length > 0 ? (secondaryImpacts[0].riskLevel || "HIGH") : (rainfall > 35 ? "MODERATE" : "LOW"),
      riskColor: secondaryImpacts.length > 0 ? (secondaryImpacts[0].riskColor || "orange") : (rainfall > 35 ? "yellow" : "green"),
      disruptionProb: secondaryImpacts.length > 0 ? secondaryImpacts[0].disruptionProb : Math.min(75, Math.round(rainfall * 0.7)),
      delayMinutes: secondaryImpacts.length > 0 ? secondaryImpacts[0].delayMinutes : (rainfall > 35 ? 25 : 0),
      sensitivity: "Roadway Flooding & Traffic (Rain: 0.50, Wind: 0.30)",
      coordinates: { x: 450, y: 70 },
      geoCoords: { lat: 15.525, lng: 73.785 }
    },
    {
      id: "node-restaurant",
      type: "restaurant",
      title: "Waterfront Beach Bistro & Dinner",
      subLabel: "Evening Dining Reservation",
      location: "Candolim Waterfront, Goa",
      icon: Utensils,
      riskLevel: higherOrderImpacts.length > 0 ? (higherOrderImpacts[0].riskLevel || "MODERATE") : (rainfall > 50 ? "MODERATE" : "LOW"),
      riskColor: higherOrderImpacts.length > 0 ? (higherOrderImpacts[0].riskColor || "yellow") : (rainfall > 50 ? "yellow" : "green"),
      disruptionProb: higherOrderImpacts.length > 0 ? higherOrderImpacts[0].disruptionProb : Math.min(40, Math.round(rainfall * 0.35)),
      delayMinutes: higherOrderImpacts.length > 0 ? higherOrderImpacts[0].delayMinutes : (rainfall > 50 ? 20 : 0),
      sensitivity: "Covered Dining / Schedule Cascade (Rain: 0.20, Wind: 0.15)",
      coordinates: { x: 630, y: 70 },
      geoCoords: { lat: 15.498, lng: 73.827 }
    }
  ]

  const getNodeColor = (riskColor) => {
    switch (riskColor) {
      case 'red':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-50',
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-900',
          dot: 'bg-rose-600',
          ring: 'ring-rose-400'
        }
      case 'orange':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-50',
          badge: 'bg-amber-600 text-white',
          text: 'text-amber-950',
          dot: 'bg-amber-500',
          ring: 'ring-amber-400'
        }
      case 'yellow':
        return {
          border: 'border-yellow-400',
          bg: 'bg-yellow-50',
          badge: 'bg-yellow-500 text-yellow-950',
          text: 'text-yellow-950',
          dot: 'bg-yellow-500',
          ring: 'ring-yellow-300'
        }
      default:
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-50',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-950',
          dot: 'bg-emerald-500',
          ring: 'ring-emerald-300'
        }
    }
  }

  const activeNodeDetails = selectedEntity || twinNodes[1]

  return (
    <div className="space-y-4">
      {/* Risk Legend and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-navy-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-coral-500 animate-pulse" />
            <span>Digital Twin Node Statuses:</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>LOW (0–25%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-yellow-800 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span>MODERATE (25–50%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>HIGH (50–75%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-800 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>SEVERE (75–100%)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-sand-600">Simulated Rain: {rainfall}mm</span>
          <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('topology')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                viewMode === 'topology' ? 'bg-navy-900 text-white shadow-soft-xs' : 'text-charcoal-700 hover:text-navy-900'
              }`}
            >
              Topology Cascade
            </button>
            <button
              type="button"
              onClick={() => setViewMode('geographic')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                viewMode === 'geographic' ? 'bg-navy-900 text-white shadow-soft-xs' : 'text-charcoal-700 hover:text-navy-900'
              }`}
            >
              Geographic Map
            </button>
          </div>
        </div>
      </div>

      {/* TOPOLOGY VIEW CANVAS */}
      {viewMode === 'topology' && (
        <div className="relative p-6 rounded-3xl bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 border border-sand-200 overflow-x-auto shadow-inner text-white">
          <div className="min-w-[720px] py-4">
            
            {/* Propagation Flow Header */}
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-400/50 bg-amber-400/10 text-amber-300 text-[10px] font-mono">
                  Impact Radius Propagation Flow
                </Badge>
                <span className="text-xs text-sand-300">
                  Weather ({rainfall}mm) ➔ Direct Disruption ➔ Secondary Transit Cascade ➔ Downstream Dining Shift
                </span>
              </div>
              <span className="text-[11px] text-sand-400 font-mono">
                Click any node to inspect telemetry
              </span>
            </div>

            {/* Visual Node Graph Grid with Animated Connecting Lines */}
            <div className="relative grid grid-cols-4 gap-4 items-center">
              
              {/* Connecting Propagation Arrows in Background */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-white/10 z-0 mx-14 pointer-events-none">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" 
                  initial={{ width: 0 }}
                  animate={{ width: rainfall > 20 ? '100%' : '25%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              {twinNodes.map((node, idx) => {
                const Icon = node.icon
                const colorMeta = getNodeColor(node.riskColor)
                const isSelected = activeNodeDetails?.id === node.id
                const isDisrupted = node.riskColor === 'red' || node.riskColor === 'orange'

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedEntity(node)}
                    className={`relative z-10 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-white text-navy-950 shadow-2xl ring-2 ring-amber-400' 
                        : 'bg-navy-900/90 hover:bg-navy-800 border-white/20 text-white'
                    }`}
                  >
                    {/* Pulsing Alert Pip for High/Severe Risk */}
                    {isDisrupted && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          node.riskColor === 'red' ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${
                          node.riskColor === 'red' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-navy-900 text-white' : 'bg-white/10 text-amber-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${colorMeta.badge}`}>
                        {node.riskLevel}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sand-400 block">
                        Node 0{idx + 1} • {node.type.replace('_', ' ')}
                      </span>
                      <h4 className={`font-serif font-bold text-xs sm:text-sm leading-tight line-clamp-1 ${
                        isSelected ? 'text-navy-950' : 'text-white'
                      }`}>
                        {node.title}
                      </h4>
                      <p className={`text-[10px] line-clamp-1 ${
                        isSelected ? 'text-charcoal-600' : 'text-sand-300'
                      }`}>
                        {node.location}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                      <span>Risk Score:</span>
                      <span className="font-bold text-amber-300">{node.disruptionProb}%</span>
                    </div>
                  </motion.div>
                )
              })}

            </div>

          </div>
        </div>
      )}

      {/* GEOGRAPHIC MAP VIEW CANVAS */}
      {viewMode === 'geographic' && (
        <div className="relative rounded-3xl overflow-hidden border border-sand-200 bg-sand-100 shadow-soft-xs">
          <div className="h-80 sm:h-96 w-full relative">
            <iframe
              title="Digital Twin Geographic Route"
              src={`https://maps.google.com/maps?q=Baga+Beach+and+Panjim+Goa&t=&z=12&ie=UTF8&iwloc=B&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full h-full"
            />

            {/* Overlaid Floating Risk Hubs */}
            <div className="absolute top-4 left-4 bg-navy-950/95 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white shadow-xl max-w-sm space-y-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h5 className="font-bold text-xs text-white">Geographic Impact Radii Active</h5>
              </div>
              <p className="text-[11px] text-sand-200 leading-snug">
                Coastal nodes at Baga Beach are under {rainfall}mm precipitation exposure. Simulated maritime chop exceeds safe limits for jet skis & catamarans.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTED NODE TELEMETRY CARD */}
      {activeNodeDetails && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sand-100 flex items-center justify-center text-navy-900 font-bold">
                <Info className="w-4 h-4 text-coral-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-sand-500 tracking-wider">
                  Inspected Digital Twin Entity Telemetry
                </span>
                <h4 className="font-serif font-bold text-navy-950 text-sm sm:text-base">
                  {activeNodeDetails.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getNodeColor(activeNodeDetails.riskColor).badge}>
                {activeNodeDetails.riskLevel} Risk State
              </Badge>
              <span className="text-xs font-mono font-bold text-navy-900">
                {activeNodeDetails.disruptionProb}% Disruption Estimate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
              <span className="text-[10px] text-sand-500 font-bold uppercase block">Weather Sensitivity Profile</span>
              <span className="font-semibold text-navy-900 text-[11px] mt-0.5 block">{activeNodeDetails.sensitivity}</span>
            </div>
            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
              <span className="text-[10px] text-sand-500 font-bold uppercase block">Expected Delay / Shift</span>
              <span className="font-semibold text-navy-900 text-[11px] mt-0.5 block">
                {activeNodeDetails.delayMinutes > 0 ? `+${activeNodeDetails.delayMinutes} mins buffer delay` : 'On schedule (0m delay)'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
              <span className="text-[10px] text-sand-500 font-bold uppercase block">Location Pin</span>
              <span className="font-semibold text-navy-900 text-[11px] mt-0.5 block">{activeNodeDetails.location}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default WeatherTwinRiskMap
