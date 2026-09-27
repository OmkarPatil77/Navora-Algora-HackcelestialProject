import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, HelpCircle, Calendar, Users, CreditCard, CloudRain } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const ItineraryHeader = ({
  city = "Goa",
  dateRange = "12 Oct – 16 Oct",
  daysCount = 5,
  travelersCount = 2,
  onOpenWhatIf,
  onOpenOptimize,
  onOpenWeatherTwin
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sand-200">
      {/* Left Column: Back button + Title + Meta */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => navigate('/plan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600 transition-colors group mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Plan Trip</span>
        </button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-charcoal-950 tracking-tight">
          {city}
        </h1>

        <p className="text-xs sm:text-sm text-charcoal-600 flex items-center flex-wrap gap-2">
          <span>{dateRange}</span>
          <span className="text-sand-400">•</span>
          <span>{daysCount} Days</span>
          <span className="text-sand-400">•</span>
          <span>{travelersCount} Travelers</span>
        </p>
      </div>

      {/* Right Column: Actions & Finalize Checkout */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="md"
          onClick={onOpenWeatherTwin}
          className="border-amber-300 bg-amber-50/80 text-amber-950 hover:bg-amber-100 shadow-soft-xs text-xs sm:text-sm font-bold h-10 px-3.5"
          leftIcon={<CloudRain className="w-4 h-4 text-cyan-600 animate-pulse" />}
        >
          🌧️ Weather Twin
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={onOpenWhatIf}
          className="border-sand-300 bg-white text-charcoal-800 hover:bg-sand-50 hover:border-sand-400 shadow-soft-xs text-xs sm:text-sm font-semibold h-10 px-3.5"
          leftIcon={<HelpCircle className="w-4 h-4 text-terracotta-600" />}
        >
          What If...?
        </Button>

        <Button
          size="md"
          onClick={onOpenOptimize}
          className="bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white shadow-soft-sm text-xs sm:text-sm font-semibold h-10 px-3.5"
          leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}
        >
          ✨ Optimize Day
        </Button>

        <Button
          size="md"
          onClick={() => navigate('/checkout')}
          className="bg-navy-900 hover:bg-navy-950 text-white shadow-warm-coral text-xs sm:text-sm font-bold h-10 px-4"
          leftIcon={<CreditCard className="w-4 h-4 text-emerald-400" />}
        >
          Finalize & Pay via Stripe 💳
        </Button>
      </div>
    </div>
  )
}
