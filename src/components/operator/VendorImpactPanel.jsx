import React from 'react'
import { motion } from 'framer-motion'
import { Store, Phone, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Check, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const VendorImpactPanel = ({
  vendors = [],
  onConfirmVendor
}) => {
  return (
    <Card className="p-5 sm:p-6 bg-white border-sand-200 shadow-soft-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sand-100">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-terracotta-600" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal-950">
              Vendor Coordination & Fleet Dispatch
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Direct operational sync with on-ground transport, villa hosts, and activity providers
          </p>
        </div>

        <Badge variant="outline" size="sm">
          {vendors.length} Partners Assigned
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor, idx) => {
          const isRequiresAction = vendor.status === 'requires_action'
          const isConfirmed = vendor.status === 'confirmed'
          const isReplaced = vendor.status === 'replaced'
          const isUpdated = vendor.status === 'updated'

          return (
            <motion.div
              key={vendor.id || idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                isRequiresAction
                  ? "bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-soft-xs"
                  : isConfirmed
                  ? "bg-emerald-50/40 border-emerald-200"
                  : isReplaced
                  ? "bg-sand-50/80 border-sand-200"
                  : "bg-white border-sand-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      {vendor.category}
                    </span>
                    <h4 className="font-bold text-sm text-charcoal-950 font-serif">
                      {vendor.name}
                    </h4>
                  </div>

                  <Badge
                    variant={
                      isConfirmed ? "success" :
                      isRequiresAction ? "warning" :
                      isReplaced ? "default" : "spark"
                    }
                    size="sm"
                  >
                    {isRequiresAction ? "Action Required" :
                     isConfirmed ? "Confirmed" :
                     isReplaced ? "Replaced" : "Updated"}
                  </Badge>
                </div>

                <div className="text-xs space-y-1 text-charcoal-700">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold text-charcoal-900">{vendor.service}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium text-charcoal-800">{vendor.contactPerson} ({vendor.phone})</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {vendor.scheduledTime} → {vendor.updatedTime}
                    </span>
                  </div>
                </div>

                {vendor.note && (
                  <p className="text-[11px] text-charcoal-600 bg-white/80 p-2 rounded-lg border border-sand-200/60 leading-snug">
                    {vendor.note}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-sand-200/60 flex items-center justify-end">
                {isRequiresAction ? (
                  <Button
                    size="sm"
                    onClick={() => onConfirmVendor(vendor.id, "Pickup slot 12:15 confirmed with driver.")}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-soft-xs"
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Confirm Vendor Schedule
                  </Button>
                ) : isConfirmed ? (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Vendor Synchronized</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onConfirmVendor(vendor.id, "Acknowledged by operations.")}
                    className="w-full text-xs"
                  >
                    Acknowledge Update
                  </Button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
