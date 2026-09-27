import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Calendar, Users, Wallet, Search, ArrowRight, 
  Compass, ShieldCheck, Star, Heart, Check, ChevronDown, 
  Car, Hotel, Utensils, Mountain, Waves, Coffee, Camera,
  Sparkles, Navigation, Clock, Ticket, Plane, Zap
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const PlanningSection = () => {
  const navigate = useNavigate()

  // 3 Distinct Tabs: 'holidays' | 'getaways' | 'curated'
  const [activeTab, setActiveTab] = useState('holidays')

  // ==========================================
  // STATE FOR TAB 1: TAILORED HOLIDAY PLANS
  // ==========================================
  const [holidayDestination, setHolidayDestination] = useState('Goa, India')
  const [holidayDuration, setHolidayDuration] = useState('4 Days / 3 Nights')
  const [holidayTravelers, setHolidayTravelers] = useState('2 Guests • Balanced')
  const [holidayBudget, setHolidayBudget] = useState(35000)
  const [holidayFilter, setHolidayFilter] = useState('all')
  const [activeHolidayVibes, setActiveHolidayVibes] = useState(['Beaches', 'Heritage & Food'])

  const holidayVibes = [
    { label: "Beaches", emoji: "🌊" },
    { label: "Heritage & Food", emoji: "🏛️" },
    { label: "Waterfalls & Trek", emoji: "⛰️" },
    { label: "Nightlife", emoji: "🍹" },
    { label: "Wellness & Spa", emoji: "🧘" }
  ]

  const toggleHolidayVibe = (label) => {
    setActiveHolidayVibes(prev => 
      prev.includes(label) 
        ? (prev.length > 1 ? prev.filter(v => v !== label) : prev) 
        : [...prev, label]
    )
  }

  const holidayPackages = [
    {
      id: "pkg-panjim-heritage",
      title: "Panjim Latin Quarter & Sunset Catamaran",
      tagline: "Colonial Portuguese villas, Mario Miranda art, authentic Goan bakeries & sunset cruise",
      duration: "4 Days / 3 Nights",
      category: "heritage",
      price: 15400,
      originalPrice: 19500,
      rating: 4.9,
      reviews: 342,
      badge: "Bestseller Holiday",
      badgeColor: "bg-coral-500 text-white",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      includes: ["Heritage Villa Stay", "Private Sedan + Chauffeur", "Sunset Cruise & Dinner", "Fontainhas Guide"],
      destination: "Goa"
    },
    {
      id: "pkg-jaipur-royal",
      title: "Jaipur Royal Heritage & Palatial Living",
      tagline: "Grand Rajput havelis, sunrise Amer fort safari, block print craft and royal dining",
      duration: "4 Days / 3 Nights",
      category: "heritage",
      price: 21500,
      originalPrice: 26000,
      rating: 4.9,
      reviews: 289,
      badge: "Royal Special",
      badgeColor: "bg-amber-600 text-white",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      includes: ["Heritage Haveli Stay", "Private Chauffeur Sedan", "Amer Fort Guide", "Royal Thali Dinner"],
      destination: "Jaipur"
    },
    {
      id: "pkg-south-goa-serenity",
      title: "South Goa Coastal Retreat & Kayaking",
      tagline: "Hidden coves in Palolem, bioluminescent night kayak, beach shack dining & yoga",
      duration: "4 Days / 3 Nights",
      category: "beach",
      price: 13800,
      originalPrice: 17200,
      rating: 4.8,
      reviews: 218,
      badge: "Beach Pick",
      badgeColor: "bg-emerald-600 text-white",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      includes: ["Seaside Eco-Resort", "Airport Pick & Drop", "Guided Sea Kayak", "Daily Breakfast"],
      destination: "Goa"
    },
    {
      id: "pkg-kerala-mist",
      title: "Munnar Tea Highlands & Alleppey Houseboat",
      tagline: "Lush tea plantations, private backwaters houseboat cruise, spice trails & Ayurvedic calm",
      duration: "5 Days / 4 Nights",
      category: "adventure",
      price: 24800,
      originalPrice: 31000,
      rating: 4.9,
      reviews: 195,
      badge: "Nature Escape",
      badgeColor: "bg-teal-600 text-white",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      includes: ["Tea Estate Cottage", "Private Houseboat Stay", "Dedicated Chauffeur", "Spice Garden Tour"],
      destination: "Kerala"
    }
  ]

  // ==========================================
  // STATE FOR TAB 2: WEEKEND ESCAPES
  // ==========================================
  const [weekendRoute, setWeekendRoute] = useState('Mumbai → Goa (Fly/Drive)')
  const [weekendSlot, setWeekendSlot] = useState('This Weekend (Fri – Sun • 2N/3D)')
  const [weekendStyle, setWeekendStyle] = useState('Spontaneous Beach & Sunset')
  const [weekendBudget, setWeekendBudget] = useState(16000)
  const [weekendFilter, setWeekendFilter] = useState('all')
  const [activeWeekendVibes, setActiveWeekendVibes] = useState(['Road Trips', 'Pool Villa'])

  const weekendVibes = [
    { label: "Road Trips", emoji: "🚗" },
    { label: "Pool Villa", emoji: "🏡" },
    { label: "Sunset Clubs", emoji: "🌅" },
    { label: "Late Checkout", emoji: "🛌" },
    { label: "Mountain Calm", emoji: "🌲" }
  ]

  const toggleWeekendVibe = (label) => {
    setActiveWeekendVibes(prev => 
      prev.includes(label) 
        ? (prev.length > 1 ? prev.filter(v => v !== label) : prev) 
        : [...prev, label]
    )
  }

  const weekendPackages = [
    {
      id: "pkg-goa-sprint",
      title: "North Goa 3-Day Beach & Sunset Sprint",
      tagline: "Anjuna boutique resort stay, Saturday night market & beach club, private sea kayak",
      duration: "3 Days / 2 Nights",
      category: "beach",
      price: 9800,
      originalPrice: 12500,
      rating: 4.9,
      reviews: 256,
      badge: "Weekend Flash Pick",
      badgeColor: "bg-coral-500 text-white",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      includes: ["Boutique Beach Stay", "Airport Rental/Car", "Beach Club Access", "Sunset Kayak"],
      destination: "Goa"
    },
    {
      id: "pkg-jaipur-express",
      title: "Jaipur 48-Hour Royal Blitz",
      tagline: "Hawa Mahal morning coffee, Amer fort private guide, Nahargarh sunset rooftop dining",
      duration: "2 Days / 1 Night",
      category: "royal",
      price: 7400,
      originalPrice: 9500,
      rating: 4.8,
      reviews: 184,
      badge: "Quick 48h Tour",
      badgeColor: "bg-amber-600 text-white",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      includes: ["Heritage Haveli Stay", "Private Cab for 48h", "Chokhi Dhani Dinner", "Skip-line Fort Passes"],
      destination: "Jaipur"
    },
    {
      id: "pkg-munnar-tea-weekend",
      title: "Munnar Misty Weekend Tea Trail",
      tagline: "Tea estate hillside cottage, 4x4 sunrise viewpoint trek, organic spice farm tour",
      duration: "3 Days / 2 Nights",
      category: "hills",
      price: 11200,
      originalPrice: 14000,
      rating: 4.9,
      reviews: 142,
      badge: "Hill Getaway",
      badgeColor: "bg-teal-600 text-white",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      includes: ["Tea Plantation Villa", "Sunrise 4x4 Jeep", "Private Plantation Trek", "Local Food Tour"],
      destination: "Kerala"
    }
  ]

  // ==========================================
  // STATE FOR TAB 3: CURATED EXPERIENCES
  // ==========================================
  const [expCity, setExpCity] = useState('Goa, India')
  const [expCategory, setExpCategory] = useState('All Categories')
  const [expSlot, setExpSlot] = useState('Golden Hour Sunset (16:30 – 19:30)')
  const [expPartySize, setExpPartySize] = useState('2 Guests (Couples)')
  const [expFilter, setExpFilter] = useState('all')
  const [activeExpVibes, setActiveExpVibes] = useState(['PADI Certified', 'Private Boat'])

  const expVibes = [
    { label: "PADI Certified", emoji: "🤿" },
    { label: "Private Boat", emoji: "⛵" },
    { label: "Tasting Menu", emoji: "🍲" },
    { label: "Photo Tour", emoji: "📷" },
    { label: "Sunrise Yoga", emoji: "🧘" }
  ]

  const toggleExpVibe = (label) => {
    setActiveExpVibes(prev => 
      prev.includes(label) 
        ? (prev.length > 1 ? prev.filter(v => v !== label) : prev) 
        : [...prev, label]
    )
  }

  const curatedExperiences = [
    {
      id: "exp-scuba-dive",
      title: "Grand Island Catamaran & Scuba Diving",
      tagline: "PADI certified dive briefing, dolphin watching catamaran, underwater 4K video included",
      duration: "4.5 Hours",
      category: "water",
      price: 2800,
      originalPrice: 3500,
      rating: 4.9,
      reviews: 312,
      badge: "Top Activity",
      badgeColor: "bg-sky-600 text-white",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      includes: ["PADI Dive Briefing", "Catamaran Cruise", "Snack & Dolphin Watch", "Underwater HD Video"],
      destination: "Goa"
    },
    {
      id: "exp-fontainhas-walk",
      title: "Fontainhas Latin Quarter Culinary & Heritage Walk",
      tagline: "7 authentic Portuguese Goan tastings, traditional bakeries, artisan feni sommelier",
      duration: "3.0 Hours",
      category: "food",
      price: 1600,
      originalPrice: 2000,
      rating: 4.9,
      reviews: 248,
      badge: "Foodie Highlight",
      badgeColor: "bg-amber-600 text-white",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      includes: ["7 Tasting Stops", "Feni Sommelier Flight", "Historic Walking Tour", "Fresh Bakery Treats"],
      destination: "Goa"
    },
    {
      id: "exp-mandovi-cruise",
      title: "Mandovi River Luxury Sunset Catamaran Cruise",
      tagline: "Panoramic Aguada bay sunset, open trampoline lounge deck, live acoustic music",
      duration: "2.0 Hours",
      category: "water",
      price: 1800,
      originalPrice: 2400,
      rating: 4.8,
      reviews: 195,
      badge: "Sunset Special",
      badgeColor: "bg-purple-600 text-white",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      includes: ["Open Trampoline Deck", "Sunset Canapés & Drink", "Live Acoustic Set", "Harbor Cruise"],
      destination: "Goa"
    }
  ]

  // Filter package logic based on selected filter
  const currentHolidayPackages = holidayFilter === 'all' 
    ? holidayPackages 
    : holidayPackages.filter(p => p.category === holidayFilter)

  const currentWeekendPackages = weekendFilter === 'all' 
    ? weekendPackages 
    : weekendPackages.filter(p => p.category === weekendFilter)

  const currentCuratedExperiences = expFilter === 'all' 
    ? curatedExperiences 
    : curatedExperiences.filter(p => p.category === expFilter)

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-y border-[#F1ECE1] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Smart Travel Planning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 font-serif leading-[1.18]">
              {activeTab === 'holidays' && "Where would you like to travel?"}
              {activeTab === 'getaways' && "Need a quick weekend break?"}
              {activeTab === 'curated' && "Discover standout local experiences"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5E6282] max-w-xl">
              {activeTab === 'holidays' && "Configure multi-day vacation parameters. Navora builds your day-by-day itinerary and protects it with automatic disruption recovery."}
              {activeTab === 'getaways' && "Spontaneous Friday-to-Sunday escapes designed for quick rejuvenation with zero planning hassle and instant confirmation."}
              {activeTab === 'curated' && "Standalone local adventures, private boat charters, and culinary masterclasses vetted by Navora guides."}
            </p>
          </div>

          {/* Assured Guarantee Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#EFEAE0] shadow-soft-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-left">
              <span className="font-bold text-navy-900 block font-sans">Navora Assured</span>
              <span className="text-[11px] text-muted-foreground block">
                {activeTab === 'holidays' && "Free auto-rerouting on delays"}
                {activeTab === 'getaways' && "Guaranteed late checkouts"}
                {activeTab === 'curated' && "100% Weather resilience guarantee"}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. UNIVERSAL SEARCH & BOOKING CARD (ADAPTIVE ACROSS 3 TABS)    */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl shadow-soft-lg border border-[#EFEAE0] overflow-hidden mb-16">
          
          {/* Top Category Tabs: The 3 Core Modes */}
          <div className="flex items-center border-b border-[#F1ECE1] bg-[#FFFDF9] px-4 sm:px-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'holidays', label: 'Tailored Holiday Plans', icon: Compass },
              { id: 'getaways', label: 'Weekend Escapes', icon: Calendar },
              { id: 'curated', label: 'Curated Experiences', icon: Heart }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  type="button"
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-coral-500 text-coral-600 bg-white shadow-2xs'
                      : 'border-transparent text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* DYNAMIC SEARCH INPUTS PER TAB */}
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: TAILORED HOLIDAY PLANS */}
            {activeTab === 'holidays' && (
              <motion.div
                key="holidays"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 lg:p-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                  
                  {/* Field 1: Destination */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-coral-500" />
                        Destination
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      {holidayDestination}
                    </p>
                    <p className="text-[11px] text-[#5E6282] truncate">
                      Panjim, Palolem, Calangute & beyond
                    </p>
                  </div>

                  {/* Field 2: Duration */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        Holiday Duration
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      {holidayDuration}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Multi-day flexible departure
                    </p>
                  </div>

                  {/* Field 3: Guests */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        Travelers
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      {holidayTravelers.split('•')[0]}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Balanced pace
                    </p>
                  </div>

                  {/* Field 4: Budget */}
                  <div className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                        Target Budget
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900">
                      {formatCurrency(holidayBudget)}
                    </p>
                    <div className="pt-1">
                      <input
                        type="range"
                        min="20000"
                        max="80000"
                        step="5000"
                        value={holidayBudget}
                        onChange={(e) => setHolidayBudget(Number(e.target.value))}
                        className="w-full h-1 bg-sand-300 rounded appearance-none cursor-pointer accent-coral-500"
                      />
                    </div>
                  </div>

                  {/* Search Action */}
                  <div className="lg:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/plan')}
                      className="w-full h-full min-h-[58px] bg-gradient-to-r from-honey-500 to-amber-500 hover:from-honey-600 hover:to-amber-600 text-navy-950 font-bold text-sm sm:text-base rounded-2xl shadow-warm-honey transition-all flex items-center justify-center gap-2 px-4 py-3"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Search & Plan</span>
                    </motion.button>
                  </div>

                </div>

                {/* Holiday Vibes & Inclusions */}
                <div className="mt-5 pt-5 border-t border-[#F5F2EA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#5E6282] font-semibold">Holiday Vibes:</span>
                    {holidayVibes.map(vibe => {
                      const isSelected = activeHolidayVibes.includes(vibe.label)
                      return (
                        <button
                          key={vibe.label}
                          type="button"
                          onClick={() => toggleHolidayVibe(vibe.label)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-coral-500 text-white font-bold shadow-xs'
                              : 'bg-[#FAF6F0] text-navy-900 hover:bg-[#EFEAE0]'
                          }`}
                        >
                          <span>{vibe.emoji}</span>
                          <span>{vibe.label}</span>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-[#5E6282] text-[11px]">
                    <span className="flex items-center gap-1">
                      <Hotel className="w-3.5 h-3.5 text-navy-700" /> Stays Included
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-navy-700" /> Cabs Included
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Check className="w-3.5 h-3.5" /> 100% Adaptive Schedule
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: WEEKEND ESCAPES */}
            {activeTab === 'getaways' && (
              <motion.div
                key="getaways"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 lg:p-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                  
                  {/* Field 1: Departure & Getaway Route */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-coral-500" />
                        Weekend Route
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors truncate">
                      {weekendRoute}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Direct flights or road trip
                    </p>
                  </div>

                  {/* Field 2: Weekend Dates */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        Weekend Slot
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors truncate">
                      {weekendSlot}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Friday evening departure
                    </p>
                  </div>

                  {/* Field 3: Escape Type */}
                  <div 
                    onClick={() => navigate('/plan')}
                    className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Getaway Style
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors truncate">
                      Beach & Sunset
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Fast rejuvenation
                    </p>
                  </div>

                  {/* Field 4: Weekend Budget */}
                  <div className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                        Est. Budget
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900">
                      {formatCurrency(weekendBudget)}
                    </p>
                    <div className="pt-1">
                      <input
                        type="range"
                        min="8000"
                        max="30000"
                        step="2000"
                        value={weekendBudget}
                        onChange={(e) => setWeekendBudget(Number(e.target.value))}
                        className="w-full h-1 bg-sand-300 rounded appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  {/* Search Action */}
                  <div className="lg:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/plan')}
                      className="w-full h-full min-h-[58px] bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-warm-coral transition-all flex items-center justify-center gap-2 px-4 py-3"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Find Getaways</span>
                    </motion.button>
                  </div>

                </div>

                {/* Weekend Vibes & Inclusions */}
                <div className="mt-5 pt-5 border-t border-[#F5F2EA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#5E6282] font-semibold">Weekend Vibe:</span>
                    {weekendVibes.map(vibe => {
                      const isSelected = activeWeekendVibes.includes(vibe.label)
                      return (
                        <button
                          key={vibe.label}
                          type="button"
                          onClick={() => toggleWeekendVibe(vibe.label)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-navy-950 font-bold shadow-xs'
                              : 'bg-[#FAF6F0] text-navy-900 hover:bg-[#EFEAE0]'
                          }`}
                        >
                          <span>{vibe.emoji}</span>
                          <span>{vibe.label}</span>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-[#5E6282] text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Check className="w-3.5 h-3.5" /> Instant Confirmation
                    </span>
                    <span className="flex items-center gap-1">
                      <Hotel className="w-3.5 h-3.5 text-navy-700" /> Late 4PM Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-coral-600" /> 48h Dynamic Buffer
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: CURATED EXPERIENCES */}
            {activeTab === 'curated' && (
              <motion.div
                key="curated"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 lg:p-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                  
                  {/* Field 1: Destination / City */}
                  <div 
                    onClick={() => navigate('/recommendations')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-coral-500" />
                        Explore City
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      {expCity}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      North & South Goa hotspots
                    </p>
                  </div>

                  {/* Field 2: Experience Category */}
                  <div 
                    onClick={() => navigate('/recommendations')}
                    className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-purple-500" />
                        Category
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      Scuba, Cruise & Food
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Top-rated local activities
                    </p>
                  </div>

                  {/* Field 3: Time Slot */}
                  <div 
                    onClick={() => navigate('/recommendations')}
                    className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        Preferred Timing
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors truncate">
                      Sunset (16:30+)
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Golden hour slots
                    </p>
                  </div>

                  {/* Field 4: Party Size */}
                  <div 
                    onClick={() => navigate('/recommendations')}
                    className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        Party Size
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                    </div>
                    <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                      {expPartySize.split('(')[0]}
                    </p>
                    <p className="text-[11px] text-[#5E6282]">
                      Per person pricing
                    </p>
                  </div>

                  {/* Search Action */}
                  <div className="lg:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/recommendations')}
                      className="w-full h-full min-h-[58px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 px-4 py-3"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Explore Experiences</span>
                    </motion.button>
                  </div>

                </div>

                {/* Curated Vibes & Inclusions */}
                <div className="mt-5 pt-5 border-t border-[#F5F2EA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#5E6282] font-semibold">Activity Filters:</span>
                    {expVibes.map(vibe => {
                      const isSelected = activeExpVibes.includes(vibe.label)
                      return (
                        <button
                          key={vibe.label}
                          type="button"
                          onClick={() => toggleExpVibe(vibe.label)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white font-bold shadow-xs'
                              : 'bg-[#FAF6F0] text-navy-900 hover:bg-[#EFEAE0]'
                          }`}
                        >
                          <span>{vibe.emoji}</span>
                          <span>{vibe.label}</span>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-[#5E6282] text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Check className="w-3.5 h-3.5" /> Certified Local Guides
                    </span>
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-navy-700" /> Instant e-Tickets
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Free Cancellation 24h
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* ============================================================== */}
        {/* 2. DYNAMIC CURATED SHOWCASE (UPDATES PER TAB)                  */}
        {/* ============================================================== */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1 SHOWCASE: TAILORED HOLIDAYS */}
          {activeTab === 'holidays' && (
            <motion.div
              key="showcase-holidays"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy-900">
                    Trending Tailored Holiday Plans
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6282] mt-1">
                    Complete multi-day holiday itineraries with boutique stays, private chauffeurs, and adaptive replanning.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Holidays' },
                    { id: 'heritage', label: 'Heritage & Food' },
                    { id: 'beach', label: 'Coastal & Beaches' },
                    { id: 'adventure', label: 'Jungle & Safari' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setHolidayFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        holidayFilter === f.id
                          ? 'bg-navy-900 text-white shadow-soft-xs'
                          : 'bg-white border border-[#EFEAE0] text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentHolidayPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="bg-white rounded-3xl border border-[#EFEAE0] overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${pkg.badgeColor}`}>
                            {pkg.badge}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center gap-1 shadow-soft-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{pkg.rating}</span>
                          <span className="text-[10px] text-muted-foreground">({pkg.reviews})</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold">
                          {pkg.duration}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-coral-600 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{pkg.destination}</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-navy-900 group-hover:text-coral-600 transition-colors">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#5E6282] line-clamp-2 leading-relaxed">
                          {pkg.tagline}
                        </p>

                        <div className="pt-2 border-t border-[#F5F2EA]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Included in this package:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.includes.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-[11px] text-navy-900 font-medium"
                              >
                                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">Starting from</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-xl text-navy-900">
                            {formatCurrency(pkg.price)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(pkg.originalPrice)}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold">per traveler • all inclusive</span>
                      </div>

                      <button
                        onClick={() => navigate('/plan')}
                        className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft-xs transition-all flex items-center gap-1.5 group-hover:bg-coral-500 cursor-pointer"
                      >
                        <span>Customize</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2 SHOWCASE: WEEKEND ESCAPES */}
          {activeTab === 'getaways' && (
            <motion.div
              key="showcase-getaways"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy-900">
                    Trending Weekend Escapes (2–3 Days)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6282] mt-1">
                    Spontaneous Friday-to-Sunday breaks designed for quick rejuvenation with zero planning hassle.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Escapes' },
                    { id: 'beach', label: 'Coastal Weekend' },
                    { id: 'royal', label: 'Royal Express' },
                    { id: 'hills', label: 'Highland Retreat' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setWeekendFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        weekendFilter === f.id
                          ? 'bg-amber-600 text-white shadow-soft-xs'
                          : 'bg-white border border-[#EFEAE0] text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentWeekendPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="bg-white rounded-3xl border border-[#EFEAE0] overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${pkg.badgeColor}`}>
                            {pkg.badge}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center gap-1 shadow-soft-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{pkg.rating}</span>
                          <span className="text-[10px] text-muted-foreground">({pkg.reviews})</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold">
                          {pkg.duration}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{pkg.destination} Getaway</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-navy-900 group-hover:text-amber-600 transition-colors">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#5E6282] line-clamp-2 leading-relaxed">
                          {pkg.tagline}
                        </p>

                        <div className="pt-2 border-t border-[#F5F2EA]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Included in weekend package:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.includes.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-[11px] text-navy-900 font-medium"
                              >
                                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">Weekend Package</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-xl text-navy-900">
                            {formatCurrency(pkg.price)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(pkg.originalPrice)}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold">2N/3D • instant booking</span>
                      </div>

                      <button
                        onClick={() => navigate('/plan')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Book Escape</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3 SHOWCASE: CURATED EXPERIENCES */}
          {activeTab === 'curated' && (
            <motion.div
              key="showcase-curated"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy-900">
                    Handpicked Local Experiences & Hidden Gems
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6282] mt-1">
                    Bespoke adventures, private boat charters, culinary trails, and certified guide tours.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Activities' },
                    { id: 'water', label: 'Scuba & Cruises' },
                    { id: 'food', label: 'Food & Wine Walks' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setExpFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        expFilter === f.id
                          ? 'bg-purple-700 text-white shadow-soft-xs'
                          : 'bg-white border border-[#EFEAE0] text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentCuratedExperiences.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="bg-white rounded-3xl border border-[#EFEAE0] overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${pkg.badgeColor}`}>
                            {pkg.badge}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center gap-1 shadow-soft-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{pkg.rating}</span>
                          <span className="text-[10px] text-muted-foreground">({pkg.reviews})</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold">
                          {pkg.duration}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{pkg.destination} Experience</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-navy-900 group-hover:text-purple-600 transition-colors">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#5E6282] line-clamp-2 leading-relaxed">
                          {pkg.tagline}
                        </p>

                        <div className="pt-2 border-t border-[#F5F2EA]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Activity inclusions:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.includes.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-[11px] text-navy-900 font-medium"
                              >
                                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">Per Participant</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-xl text-navy-900">
                            {formatCurrency(pkg.price)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(pkg.originalPrice)}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-700 font-semibold">instant confirmation</span>
                      </div>

                      <button
                        onClick={() => navigate('/recommendations')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Bottom Link to full planner */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(activeTab === 'curated' ? '/recommendations' : '/plan')}
            className="inline-flex items-center gap-2 text-sm font-bold text-coral-600 hover:text-coral-700 font-sans group cursor-pointer"
          >
            <span>
              {activeTab === 'holidays' && "Explore all customizable destinations & build your custom holiday"}
              {activeTab === 'getaways' && "Browse all 48-hour weekend getaways near you"}
              {activeTab === 'curated' && "View the complete catalogue of 100+ curated activities"}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default PlanningSection
