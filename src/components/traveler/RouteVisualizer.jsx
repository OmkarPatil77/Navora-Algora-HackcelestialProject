import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Compass, Sparkles, Clock, Car } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { calculateDistanceKm } from '@/services/itineraryEngine'

export const RouteVisualizer = ({ dayItems = [], dayTitle = "Day Route" }) => {
  const [activeHoverIndex, setActiveHoverIndex] = useState(null)

  // Filter items with valid coordinates
  const validStops = dayItems.filter(item => item.coordinates && item.type !== 'buffer')

  // Calculate cumulative route distance
  let totalRouteKm = 0
  for (let i = 0; i < validStops.length - 1; i++) {
    totalRouteKm += calculateDistanceKm(validStops[i].coordinates, validStops[i + 1].coordinates)
  }

  // Dynamic bounding box normalization across any destination's coordinates
  const lats = validStops.map(s => s.coordinates?.lat).filter(Boolean)
  const lngs = validStops.map(s => s.coordinates?.lng).filter(Boolean)

  const minLat = lats.length > 0 ? Math.min(...lats) : 15.0
  const maxLat = lats.length > 0 ? Math.max(...lats) : 16.0
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 73.0
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 74.0

  const latSpan = Math.max(0.05, maxLat - minLat)
  const lngSpan = Math.max(0.05, maxLng - minLng)

  const mapPoints = validStops.map((stop, idx) => {
    const lat = stop.coordinates?.lat != null ? stop.coordinates.lat : (minLat + (idx / Math.max(1, validStops.length)) * latSpan)
    const lng = stop.coordinates?.lng != null ? stop.coordinates.lng : (minLng + (idx / Math.max(1, validStops.length)) * lngSpan)

    // Normalize to canvas coordinates (500 width, 280 height) with comfortable margins
    const normX = (lng - minLng) / lngSpan
    const normY = (lat - minLat) / latSpan

    const x = Math.min(460, Math.max(50, Math.round(50 + normX * 380)))
    const y = Math.min(240, Math.max(40, Math.round(240 - normY * 190)))

    return {
      ...stop,
      x,
      y,
      stopNumber: idx + 1
    }
  })

  // Generate SVG polyline points string
  const polylinePoints = mapPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <Card className="overflow-hidden bg-white border-sand-200/90 shadow-soft-sm space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-terracotta-50 border border-terracotta-200/60 flex items-center justify-center text-terracotta-700">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal-950">
              Daily Journey Route Map
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {validStops.length} Waypoints • Est. {Math.round(totalRouteKm)} km total travel
            </p>
          </div>
        </div>

        <Badge variant="spark" size="sm">
          Route Telemetry Active
        </Badge>
      </div>

      {/* Stylized SVG Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-sand-100/50 border-y border-sand-200/80 overflow-hidden">
        
        {/* Subtle grid background contour styling */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C84B31" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2DDD5" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* Subtle geographic backdrop */}
          <path
            d="M 0,0 Q 80,120 110,280 L 0,280 Z"
            fill="#E0ECE9"
            opacity="0.4"
          />
          <text x="25" y="140" fill="#789B95" fontSize="10" fontWeight="bold" letterSpacing="2">
            REGIONAL TRANSIT
          </text>
          <text x="310" y="40" fill="#B5ADA3" fontSize="10" fontWeight="bold" letterSpacing="1">
            LOCAL HIGHWAY ROUTE
          </text>
        </svg>

        {/* Dynamic Route SVG Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 280">
          {/* Connecting Path Lines */}
          {mapPoints.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="3.5"
              strokeDasharray="6,4"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}

          {/* Waypoint Nodes */}
          {mapPoints.map((point, index) => {
            const isHovered = activeHoverIndex === index
            return (
              <g
                key={point.id || index}
                transform={`translate(${point.x}, ${point.y})`}
                onMouseEnter={() => setActiveHoverIndex(index)}
                onMouseLeave={() => setActiveHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Ping circle for active stop */}
                {isHovered && (
                  <circle r="16" fill="#C84B31" opacity="0.2" className="animate-ping" />
                )}

                {/* Outer shadow ring */}
                <circle
                  r={isHovered ? "11" : "9"}
                  fill="#FFFFFF"
                  stroke={isHovered ? "#C84B31" : "#1A1C22"}
                  strokeWidth="2.5"
                />

                {/* Inner dot with stop number */}
                <circle
                  r={isHovered ? "7" : "5"}
                  fill={point.type === 'hotel' ? '#0F766E' : point.type === 'flight' ? '#2563EB' : '#C84B31'}
                />

                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {point.stopNumber}
                </text>

                {/* Location Label Tag */}
                <g transform="translate(12, -6)">
                  <rect
                    rx="4"
                    width={point.title.length * 5.8 + 14}
                    height="17"
                    fill="rgba(26, 28, 34, 0.9)"
                  />
                  <text
                    x="7"
                    y="12"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {point.title.slice(0, 22)}{point.title.length > 22 ? '...' : ''}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>

        {/* Hover Information Tooltip Overlay */}
        {activeHoverIndex !== null && mapPoints[activeHoverIndex] && (
          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-charcoal-950/90 backdrop-blur-md text-white border border-charcoal-800 text-xs flex items-center justify-between shadow-soft-lg">
            <div>
              <span className="text-[10px] text-terracotta-400 font-bold uppercase block">
                Stop {mapPoints[activeHoverIndex].stopNumber} • {mapPoints[activeHoverIndex].startTime}
              </span>
              <p className="font-semibold text-white">{mapPoints[activeHoverIndex].title}</p>
            </div>
            <span className="text-[11px] text-sand-300">
              {mapPoints[activeHoverIndex].location}
            </span>
          </div>
        )}
      </div>

      {/* Route Legend Bar */}
      <div className="p-4 sm:p-5 pt-0 flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-700">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Stay / Villa</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
            <span>Experience</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Transit Hub</span>
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Estimated transit times based on coastal road dynamics
        </span>
      </div>
    </Card>
  )
}
