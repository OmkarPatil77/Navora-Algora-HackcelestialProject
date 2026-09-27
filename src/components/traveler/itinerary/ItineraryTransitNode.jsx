import React from 'react'
import { Car, Clock, Navigation } from 'lucide-react'

export const ItineraryTransitNode = ({
  durationMinutes = 35,
  mode = "Cab",
  distanceKm = 14,
  origin = "Arrival Airport",
  destination = "Hotel"
}) => {
  return (
    <div className="relative pl-10 sm:pl-14 py-2 select-none">
      {/* Vertical line passing through */}
      <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-sand-300 border-l border-dashed border-sand-400" />

      {/* Transit pill badge in the middle */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand-100 border border-sand-200/90 text-charcoal-700 text-xs shadow-soft-xs">
        <span className="font-semibold text-charcoal-900">{durationMinutes} min</span>
        <span className="text-sand-400">•</span>
        <span className="flex items-center gap-1 font-medium">
          <Car className="w-3 h-3 text-terracotta-600" />
          <span>🚕 {mode}</span>
        </span>
        {distanceKm > 0 && (
          <>
            <span className="text-sand-400">•</span>
            <span className="text-muted-foreground">{distanceKm} km</span>
          </>
        )}
      </div>
    </div>
  )
}
