import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Car, Hotel, Compass, Utensils, Plane } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const AffectedOperationsTable = ({ itinerary, disruption, analysis, appliedRecovery }) => {
  const day1 = itinerary?.days?.find(d => d.day === 1) || itinerary?.days?.[0]
  const items = day1?.items || []

  // Helper to map item to vendor owner and status
  const getOperationDetails = (item) => {
    if (item.type === 'flight') {
      return {
        typeLabel: "Flight Transit",
        owner: "IndiGo (6E-204)",
        scheduled: disruption?.originalStartTime || "09:20",
        updated: disruption?.newStartTime || "10:50",
        status: disruption ? "Delayed (+90m)" : "On Time",
        statusVariant: disruption ? "danger" : "success"
      }
    }

    if (item.type === 'transport' || item.title.includes('Transfer')) {
      return {
        typeLabel: "Fleet Transit",
        owner: "Goa Transfers Fleet (Rajesh Naik)",
        scheduled: "10:55",
        updated: disruption ? (appliedRecovery ? "12:15" : "12:15") : "10:55",
        status: disruption ? (appliedRecovery ? "Synchronized" : "Rescheduled") : "Confirmed",
        statusVariant: appliedRecovery ? "success" : (disruption ? "warning" : "success")
      }
    }

    if (item.type === 'hotel' || item.title.includes('Check-in')) {
      return {
        typeLabel: "Accommodation",
        owner: "Casa Sol Heritage Villa",
        scheduled: "12:00",
        updated: disruption ? (appliedRecovery ? "13:15" : "13:15") : "12:00",
        status: disruption ? "Updated" : "Confirmed",
        statusVariant: appliedRecovery ? "success" : "warning"
      }
    }

    if (item.type === 'meal' && item.title.toLowerCase().includes('lunch')) {
      return {
        typeLabel: "Dining",
        owner: "Kokum Club / Fisherman's Wharf",
        scheduled: "13:00",
        updated: disruption ? "14:00" : "13:00",
        status: "Flexible Window",
        statusVariant: "default"
      }
    }

    if (item.id?.includes('fontainhas') || item.title?.includes('Fontainhas')) {
      return {
        typeLabel: "Cultural Activity",
        owner: "Fontainhas Heritage Guild",
        scheduled: "—",
        updated: "16:00 – 18:30",
        status: "Replaced (Active)",
        statusVariant: "success"
      }
    }

    if (item.type === 'experience' && (item.id?.includes('scuba') || item.title?.includes('Scuba'))) {
      return {
        typeLabel: "Adventure Activity",
        owner: "Oceanic Adventures",
        scheduled: "12:30",
        updated: appliedRecovery ? "Replaced" : "Conflict",
        status: appliedRecovery ? "Replaced (No Penalty)" : "Conflict",
        statusVariant: appliedRecovery ? "success" : "danger"
      }
    }

    if (item.title?.includes('Sunset') || item.title?.includes('Cruise')) {
      return {
        typeLabel: "Cruise Activity",
        owner: "Mandovi Luxury Cruises",
        scheduled: "18:45",
        updated: "18:45",
        status: "100% Protected",
        statusVariant: "success"
      }
    }

    if (item.title?.includes('Dinner')) {
      return {
        typeLabel: "Dining",
        owner: "Fisherman's Wharf Panjim",
        scheduled: "20:30",
        updated: "20:30",
        status: "100% Protected",
        statusVariant: "success"
      }
    }

    return {
      typeLabel: "General",
      owner: "Apex Tour Operations",
      scheduled: item.startTime || "09:00",
      updated: item.startTime || "09:00",
      status: "On Track",
      statusVariant: "default"
    }
  }

  return (
    <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-100">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950">
            Affected Operations & Vendor Timetable
          </h3>
          <p className="text-xs text-muted-foreground">
            Synchronized operational schedule derived from Tour GOA-2048 master dependency graph
          </p>
        </div>
        <Badge variant="outline" size="sm">
          {items.length} Tracked Operations
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-sand-200/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-sand-50/50">
              <th className="py-2.5 px-3">Operation / Item</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Scheduled</th>
              <th className="py-2.5 px-3">Updated</th>
              <th className="py-2.5 px-3">Vendor / Partner</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {items.map((item, idx) => {
              const details = getOperationDetails(item)

              return (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                  className="hover:bg-sand-50/60 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-charcoal-900">
                    <span className="line-clamp-1">{item.title}</span>
                  </td>

                  <td className="py-3 px-3 text-muted-foreground">
                    {details.typeLabel}
                  </td>

                  <td className="py-3 px-3 font-mono text-muted-foreground">
                    {details.scheduled}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-charcoal-900">
                    {details.updated}
                  </td>

                  <td className="py-3 px-3 text-charcoal-700 font-medium">
                    <span className="line-clamp-1">{details.owner}</span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <Badge variant={details.statusVariant} size="sm">
                      {details.status}
                    </Badge>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
