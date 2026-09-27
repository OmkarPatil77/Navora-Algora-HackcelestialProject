import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, Car, Hotel, UtensilsCrossed, Sparkles, 
  Shield, Clock, MapPin, ArrowRight, CheckCircle2, 
  AlertCircle, Compass, Info, ChevronRight 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const ItineraryTimelineNode = ({
  item,
  index,
  onClick
}) => {
  const getNodeConfig = (type) => {
    switch (type) {
      case 'flight':
        return {
          icon: Plane,
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          dot: 'bg-blue-600',
          tag: 'Flight Transit'
        }
      case 'transport':
        return {
          icon: Car,
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          dot: 'bg-amber-600',
          tag: 'Local Transfer'
        }
      case 'hotel':
        return {
          icon: Hotel,
          color: 'text-teal-800 bg-teal-50 border-teal-200',
          dot: 'bg-teal-600',
          tag: 'Stay / Villa'
        }
      case 'meal':
        return {
          icon: UtensilsCrossed,
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-600',
          tag: 'Dining & Food'
        }
      case 'experience':
        return {
          icon: Sparkles,
          color: 'text-terracotta-700 bg-terracotta-50 border-terracotta-200',
          dot: 'bg-terracotta-600',
          tag: 'Curated Experience'
        }
      case 'buffer':
        return {
          icon: Shield,
          color: 'text-purple-800 bg-purple-50 border-purple-200',
          dot: 'bg-purple-600',
          tag: 'Flexibility Buffer'
        }
      default:
        return {
          icon: Compass,
          color: 'text-charcoal-700 bg-sand-100 border-sand-200',
          dot: 'bg-charcoal-600',
          tag: 'Activity'
        }
    }
  }

  const config = getNodeConfig(item.type)
  const Icon = config.icon

  // Buffer nodes have a distinct lighter treatment
  if (item.type === 'buffer') {
    return (
      <div 
        onClick={onClick}
        className="relative pl-6 sm:pl-8 py-2 cursor-pointer group"
      >
        <div className="absolute -left-[18px] sm:-left-[26px] top-3.5 w-3 h-3 rounded-full bg-purple-100 border-2 border-purple-500 shadow-xs group-hover:scale-125 transition-transform" />

        <div className="p-3 rounded-xl bg-purple-50/60 border border-dashed border-purple-200 hover:border-purple-300 transition-colors flex items-center justify-between text-xs text-purple-950">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-semibold block">{item.title}</span>
              <span className="text-[11px] text-purple-800">
                {item.startTime} – {item.endTime} ({item.durationMinutes} min relaxation window)
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100/80 text-purple-900">
            Flexibility Buffer
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(0.2, index * 0.04) }}
      onClick={onClick}
      className="relative pl-6 sm:pl-8 py-2 cursor-pointer group select-none"
    >
      {/* Node Dot on Left Vertical Track */}
      <div className={`absolute -left-[19px] sm:-left-[27px] top-5 w-3.5 h-3.5 rounded-full bg-white border-2 ${config.dot} shadow-xs group-hover:scale-125 group-hover:border-terracotta-600 transition-all`} />

      <Card className="p-4 sm:p-5 bg-white border-sand-200/90 group-hover:border-sand-300 group-hover:shadow-soft-md shadow-soft-xs transition-all space-y-3">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-sand-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sand-100/80 text-charcoal-900 font-serif font-bold text-xs">
              <Clock className="w-3.5 h-3.5 text-terracotta-600" />
              {item.startTime} – {item.endTime}
            </span>

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
              <Icon className="w-3 h-3" />
              {config.tag}
            </span>

            {item.critical && (
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                Critical
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
            {item.cost > 0 && (
              <span className="font-serif font-bold text-charcoal-950">
                {formatCurrency(item.cost)}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-charcoal-900 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Node Body Details */}
        <div className="space-y-1.5">
          <h4 className="font-serif font-bold text-base sm:text-lg text-charcoal-950 group-hover:text-terracotta-700 transition-colors">
            {item.title}
          </h4>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-charcoal-500" />
              <span>{item.location}</span>
            </span>
            <span>•</span>
            <span>Duration: {item.durationMinutes} min</span>
            {item.intensity && item.intensity !== "none" && (
              <>
                <span>•</span>
                <span className="capitalize text-charcoal-700">Pace: {item.intensity}</span>
              </>
            )}
          </div>

          {/* Dependency Badge Indicator */}
          {item.dependencies && item.dependencies.length > 0 && (
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-charcoal-600">
              <span className="font-semibold text-charcoal-800">Connected:</span>
              <span>Linked to upstream arrival sequence</span>
            </div>
          )}
        </div>

      </Card>
    </motion.div>
  )
}
