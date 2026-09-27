import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Compass, Search, Filter, ArrowRight, AlertTriangle, 
  CheckCircle2, ShieldCheck, MapPin, Users, Calendar, 
  Plane, Hotel, Layers 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { initialOperatorTours } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorTours = () => {
  const navigate = useNavigate()
  const { activeDisruption, appliedRecovery } = useTripPlan()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const tours = initialOperatorTours.map(t => {
    if (t.id === 'GOA-2048') {
      return {
        ...t,
        status: activeDisruption && !appliedRecovery 
          ? 'disruption_active' 
          : appliedRecovery 
          ? 'journey_adapted' 
          : 'on_track'
      }
    }
    return t
  })

  const filteredTours = tours.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.travelersName.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'All') return matchesSearch
    if (statusFilter === 'Disruptions') return matchesSearch && t.status === 'disruption_active'
    if (statusFilter === 'Adapted') return matchesSearch && t.status === 'journey_adapted'
    if (statusFilter === 'On Track') return matchesSearch && t.status === 'on_track'
    return matchesSearch
  })

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Fleet Logistics
            </span>
            <span className="text-xs text-muted-foreground">• Live Roster</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-charcoal-950">
            Tour Operations Roster
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Real-time tracking of active traveler cohorts, bookings, and on-ground logistics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="font-bold text-charcoal-900">{tours.length}</span> Active Tours
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-xl border border-sand-200 shadow-soft-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by tour ID, guest name, or hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", "Disruptions", "Adapted", "On Track"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-charcoal-900 text-white shadow-soft-xs"
                  : "bg-sand-50 text-charcoal-700 hover:bg-sand-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tours List */}
      <div className="space-y-3.5">
        {filteredTours.map((tour) => {
          const isDisrupted = tour.status === 'disruption_active'
          const isAdapted = tour.status === 'journey_adapted'

          return (
            <Card
              key={tour.id}
              onClick={() => navigate(`/operator/tours/${tour.id}`)}
              className={`p-5 bg-white border transition-all cursor-pointer hover:shadow-soft-md ${
                isDisrupted
                  ? "border-rose-300 ring-1 ring-rose-300/50"
                  : isAdapted
                  ? "border-emerald-300"
                  : "border-sand-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-charcoal-900 bg-sand-100 px-2 py-0.5 rounded">
                      {tour.id}
                    </span>

                    <Badge
                      variant={
                        isDisrupted ? "danger" :
                        isAdapted ? "success" : "default"
                      }
                      size="sm"
                    >
                      {isDisrupted ? "Disruption Active (+90m)" :
                       isAdapted ? "Journey Adapted" : "On Track"}
                    </Badge>

                    <span className="text-xs text-muted-foreground">• {tour.destination}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-charcoal-950">
                    {tour.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-600">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {tour.travelersName} ({tour.travelersCount} Pax)
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {tour.startDate} → {tour.endDate} ({tour.durationDays}D)
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-muted-foreground" />
                      {tour.flightRef}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-muted-foreground" />
                      {tour.hotel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/operator/tours/${tour.id}`)
                    }}
                    className="text-xs bg-charcoal-900 text-white hover:bg-charcoal-800"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open Tour Control
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      </div>
    </PageTransition>
  )
}

export default OperatorTours
