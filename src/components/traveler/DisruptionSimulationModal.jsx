import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, AlertTriangle, CloudRain, Clock, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const DisruptionSimulationModal = ({
  open,
  onOpenChange,
  onTriggerSimulation
}) => {
  const [selectedDelay, setSelectedDelay] = useState(90)

  const delayOptions = [
    { value: 30, label: "+30 min", description: "Minor ground delay; easily absorbed by buffers." },
    { value: 60, label: "+60 min", description: "Moderate runway delay; pushes airport transfer." },
    { value: 90, label: "+90 min (Primary Demo)", description: "Major arrival delay; causes conflict with afternoon scuba dive.", recommended: true },
    { value: 120, label: "+120 min", description: "Critical delay; requires full afternoon rescheduling." }
  ]

  const futureDisruptions = [
    { label: "Flight Cancellation", icon: Plane, note: "Coming next" },
    { label: "Transport Delay / Cab Breakdown", icon: Clock, note: "Coming next" },
    { label: "Experience Operator Cancellation", icon: AlertTriangle, note: "Coming next" },
    { label: "Monsoon Weather Disruption", icon: CloudRain, note: "Coming next" }
  ]

  const handleLaunch = () => {
    onTriggerSimulation(selectedDelay)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-2xl" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Synthetic Disruption
            </span>
            <Badge variant="spark" size="sm">Hackathon Demo Engine</Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-charcoal-950 font-serif">
            Simulate a Travel Disruption
          </DialogTitle>
          <DialogDescription className="text-xs text-charcoal-600 leading-relaxed">
            Test how Navora protects and adapts your journey. This is a <strong>controlled synthetic simulation</strong> designed to demonstrate real-time dependency graph traversal and automated recovery generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-2">
          {/* Active Demo Section: Flight Delay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-terracotta-600" />
                Select Inbound Flight Delay (BOM → GOI)
              </label>
              <span className="text-[11px] text-muted-foreground">Original: 09:20 → 10:35</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {delayOptions.map((opt) => {
                const isSelected = selectedDelay === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedDelay(opt.value)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? "bg-terracotta-50/70 border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-soft-xs"
                        : "bg-sand-50/50 border-sand-200 hover:border-sand-300 hover:bg-white"
                    }`}
                  >
                    {opt.recommended && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-terracotta-600 text-white uppercase tracking-wider">
                        Demo Recommended
                      </span>
                    )}
                    <div className="font-bold text-sm text-charcoal-950 font-serif mb-1">
                      {opt.label}
                    </div>
                    <p className="text-[11px] text-charcoal-600 leading-normal">
                      {opt.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Causal Chain Preview Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Simulated Schedule Shift</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Touchdown moves from <strong>10:35</strong> to <strong>{selectedDelay === 90 ? "12:05" : "revised window"}</strong>. Navora will recalculate baggage collection, airport transit, and identify collisions with your afternoon scuba dive booking.
            </p>
          </div>

          {/* Future Disruption Scenarios (Clearly Disabled) */}
          <div className="space-y-2.5 pt-2 border-t border-sand-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Extended Disruption Modes (Future Workflows)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {futureDisruptions.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-sand-200 bg-sand-50/30 opacity-60 cursor-not-allowed flex flex-col items-center text-center space-y-1"
                  >
                    <Icon className="w-4 h-4 text-charcoal-400" />
                    <span className="text-[11px] font-medium text-charcoal-700 leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider">
                      {item.note}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLaunch}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Simulate +{selectedDelay}m Flight Delay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
