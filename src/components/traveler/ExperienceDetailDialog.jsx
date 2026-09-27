import React from 'react'
import { 
  Star, MapPin, Clock, Sparkles, Check, 
  Plus, X, Wallet, ShieldCheck, HeartHandshake, Compass 
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const ExperienceDetailDialog = ({
  experience,
  isOpen,
  onClose,
  isSelected,
  onToggleSelect,
  adultCount = 2,
  isTripBooked = true
}) => {
  if (!experience) return null

  const totalCost = experience.pricePerPerson * adultCount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent maxWidth="max-w-2xl" className="p-0 overflow-hidden" onClose={onClose}>
        
        {/* Top Image Hero */}
        <div className="relative h-60 sm:h-72 w-full bg-charcoal-950 overflow-hidden">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {experience.matchScore}% Preference Match
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-terracotta-600/90 text-white text-xs font-semibold">
              {experience.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-sand-200 mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                {experience.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-terracotta-400" />
                {experience.durationHours} Hours
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {experience.rating} ({experience.reviewsCount || 180} reviews)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
              {experience.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Overview
            </h4>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Why Navora Recommended It */}
          <div className="p-4 rounded-xl bg-terracotta-50/70 border border-terracotta-200/80 space-y-2">
            <div className="flex items-center gap-2 text-terracotta-900 font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <span>Why Navora Recommended This</span>
            </div>
            <ul className="space-y-1.5 text-xs text-charcoal-700">
              {experience.matchReasons?.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights & Best Time */}
          {experience.highlights && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Experience Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {experience.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-sand-50 border border-sand-200/60 text-charcoal-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Budget Impact */}
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                Pricing Breakdown
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-serif font-bold text-charcoal-950">
                  {formatCurrency(experience.pricePerPerson)}
                </span>
                <span className="text-muted-foreground">/ person</span>
              </div>
              <p className="text-[11px] text-charcoal-600 mt-0.5">
                Total for {adultCount} traveler{adultCount > 1 ? 's' : ''}: <span className="font-semibold text-charcoal-900">{formatCurrency(totalCost)}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                Best Timing
              </span>
              <span className="font-semibold text-charcoal-900 text-xs">
                {experience.bestTime || "Morning / Afternoon"}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-sand-50/90 border-t border-sand-200 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          {isTripBooked ? (
            <Button
              onClick={() => {
                onToggleSelect(experience)
                onClose()
              }}
              className={isSelected ? "bg-emerald-700 hover:bg-emerald-800 text-white" : "bg-terracotta-600 hover:bg-terracotta-700 text-white"}
              leftIcon={isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isSelected ? "Remove from Journey" : "Add to My Journey"}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-700 font-semibold hidden sm:inline">
                🔒 Trip booking required
              </span>
              <Button
                disabled
                className="bg-sand-200 text-charcoal-400 cursor-not-allowed opacity-70 text-xs font-semibold"
              >
                Add to Trip (Disabled)
              </Button>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
