import React, { useState, useEffect } from 'react'
import { 
  Clock, MapPin, Wallet, ShieldCheck, ArrowRight, 
  Trash2, Edit3, Check, AlertCircle, Plane, Car, 
  Hotel, UtensilsCrossed, Sparkles, Compass, Shield 
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const ItineraryItemDetailDialog = ({
  item,
  dayNumber,
  isOpen,
  onClose,
  onUpdateTime,
  onRemoveItem,
  allItemsInDay = []
}) => {
  if (!item) return null

  const [startTime, setStartTime] = useState(item.startTime || "09:00")
  const [endTime, setEndTime] = useState(item.endTime || "10:30")
  const [isEditingTime, setIsEditingTime] = useState(false)

  useEffect(() => {
    setStartTime(item.startTime || "09:00")
    setEndTime(item.endTime || "10:30")
    setIsEditingTime(false)
  }, [item])

  const handleSaveTime = () => {
    onUpdateTime(dayNumber, item.id, startTime, endTime)
    setIsEditingTime(false)
  }

  // Resolve upstream dependency titles
  const upstreamDependencies = (item.dependencies || []).map(depId => {
    const found = allItemsInDay.find(i => i.id === depId)
    return found ? found.title : depId
  })

  // Resolve downstream dependent titles
  const downstreamDependents = (item.downstream || []).map(downId => {
    const found = allItemsInDay.find(i => i.id === downId)
    return found ? found.title : downId
  })

  const getNodeIcon = (type) => {
    switch (type) {
      case 'flight': return Plane
      case 'transport': return Car
      case 'hotel': return Hotel
      case 'meal': return UtensilsCrossed
      case 'experience': return Sparkles
      case 'buffer': return Shield
      default: return Compass
    }
  }

  const IconComponent = getNodeIcon(item.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent maxWidth="max-w-xl" onClose={onClose}>
        
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={item.critical ? "danger" : "default"} size="sm">
              {item.type.toUpperCase()} NODE
            </Badge>
            {item.movable ? (
              <Badge variant="success" size="sm">Movable Slot</Badge>
            ) : (
              <Badge variant="dark" size="sm">Fixed / Critical</Badge>
            )}
          </div>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{item.location}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          
          {/* Time & Duration Box */}
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Scheduled Timing
              </span>
              {!isEditingTime ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-serif font-bold text-charcoal-950">
                    {item.startTime} – {item.endTime}
                  </span>
                  <span className="text-muted-foreground">({item.durationMinutes} min)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-2 py-1 border rounded bg-white font-medium"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-2 py-1 border rounded bg-white font-medium"
                  />
                  <Button size="sm" onClick={handleSaveTime} className="bg-emerald-700 text-white h-7 px-2">
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {item.movable && !isEditingTime && (
              <button
                type="button"
                onClick={() => setIsEditingTime(true)}
                className="inline-flex items-center gap-1 text-xs text-charcoal-700 hover:text-terracotta-600 font-semibold py-1 px-2.5 rounded-lg border bg-white hover:bg-sand-100"
              >
                <Edit3 className="w-3 h-3" />
                <span>Adjust Time</span>
              </button>
            )}
          </div>

          {/* Cost & Intensity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Estimated Cost</span>
              <span className="text-base font-serif font-bold text-charcoal-950">
                {item.cost > 0 ? formatCurrency(item.cost) : "Included / Free"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Physical Intensity</span>
              <span className="text-sm font-semibold capitalize text-charcoal-900">
                {item.intensity || "Low"}
              </span>
            </div>
          </div>

          {/* Dependency Cascade Section */}
          <div className="p-4 rounded-xl bg-charcoal-900 text-sand-50 border border-charcoal-800 space-y-3">
            <div className="flex items-center gap-2 text-terracotta-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Dependency Chain & Flow Impact</span>
            </div>

            {/* Upstream */}
            <div className="space-y-1 text-[11px]">
              <span className="text-charcoal-400 uppercase font-semibold text-[10px] block">
                Upstream Dependencies (Required Before This Starts):
              </span>
              {upstreamDependencies.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-sand-200">
                  {upstreamDependencies.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-charcoal-400 italic">None (Root item or start of day sequence)</p>
              )}
            </div>

            {/* Downstream */}
            <div className="space-y-1 text-[11px] pt-2 border-t border-charcoal-800">
              <span className="text-charcoal-400 uppercase font-semibold text-[10px] block">
                Downstream Impact (Will Be Affected If This Is Delayed):
              </span>
              {downstreamDependents.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-300">
                  {downstreamDependents.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-charcoal-400 italic">None (End of day sequence)</p>
              )}
            </div>
          </div>

        </div>

        <DialogFooter className="flex items-center justify-between">
          {item.type !== "flight" && item.type !== "hotel" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onRemoveItem(dayNumber, item.id)
                onClose()
              }}
              className="text-rose-600 hover:bg-rose-50 text-xs"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Remove Item
            </Button>
          ) : (
            <div />
          )}

          <Button size="sm" onClick={onClose} variant="outline">
            Done
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
