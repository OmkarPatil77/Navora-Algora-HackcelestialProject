import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Check, Globe, Sparkles, Calendar, Wallet } from 'lucide-react'
import { mockDestinations } from '@/data/mockData'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const StepDestination = ({ destination, onSelectDestination }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSuggestions = mockDestinations.filter(d => 
    !searchQuery ||
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedItem = mockDestinations.find(d => 
    d.name.toLowerCase() === destination.name?.toLowerCase() ||
    d.city.toLowerCase() === destination.city?.toLowerCase() ||
    d.id.toLowerCase() === destination.id?.toLowerCase()
  ) || mockDestinations[0]

  const handleSelect = (item) => {
    onSelectDestination({
      name: item.name,
      city: item.city,
      country: item.country,
      region: item.region,
      image: item.image,
      tagline: item.tagline,
      description: item.description,
      vibes: item.vibes
    })
  }

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-700 text-[11px] font-semibold border border-sand-200 mb-2">
          <MapPin className="w-3 h-3 text-terracotta-600" />
          <span>Step 01 • Destination</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          Where are you traveling next?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Every destination includes a complete day-by-day itinerary, authentic local dining, boutique stays, and curated experiences.
        </p>
      </div>

      {/* Destination Search Bar */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
          Filter Destinations
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, country or region (e.g. Jaipur, Dubai, Kerala, Singapore)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-soft-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-charcoal-400 hover:text-charcoal-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
            Available Destinations ({filteredSuggestions.length})
          </span>
          <span className="text-[11px] text-charcoal-500">
            Select a destination to load its curated blueprint
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map((item) => {
            const isSelected = selectedItem.id === item.id || 
                               selectedItem.city?.toLowerCase() === item.city.toLowerCase()

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 bg-white flex flex-col h-full ${
                    isSelected
                      ? "ring-2 ring-terracotta-600 border-terracotta-500 shadow-soft-md"
                      : "border-sand-200/90 hover:border-sand-300 hover:shadow-soft-sm"
                  }`}
                >
                  {/* Image banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-charcoal-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
                    
                    {/* Region Pill */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                        <Globe className="w-2.5 h-2.5 text-terracotta-400" />
                        {item.region}
                      </span>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-terracotta-600 text-white text-[11px] font-bold shadow-soft-xs">
                          <Check className="w-3 h-3" />
                          Selected
                        </span>
                      </div>
                    )}

                    {/* Destination Title on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h3 className="text-base font-bold font-serif leading-tight">{item.name}</h3>
                      <p className="text-[11px] text-sand-200 line-clamp-1 mt-0.5">{item.tagline}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Key logistics */}
                    <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-[11px] text-charcoal-700">
                      <span className="inline-flex items-center gap-1 text-charcoal-600">
                        <Calendar className="w-3 h-3 text-terracotta-600" />
                        {item.defaultDurationDays} Days / {item.defaultDurationDays - 1} Nights
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-charcoal-900">
                        <Wallet className="w-3 h-3 text-sand-600" />
                        From {formatCurrency(item.recommendedBudget)}
                      </span>
                    </div>

                    {/* Vibe Tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {item.vibes.slice(0, 3).map((vibe, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sand-100 text-charcoal-700 border border-sand-200/50"
                        >
                          {vibe}
                        </span>
                      ))}
                      {item.vibes.length > 3 && (
                        <span className="text-[10px] text-charcoal-500 font-medium">
                          +{item.vibes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
