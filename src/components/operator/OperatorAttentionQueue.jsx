import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, ShieldAlert, Check, Send, ArrowRight, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const OperatorAttentionQueue = ({
  items = [],
  onConfirmVendor,
  onResolveItem,
  onSendNotification
}) => {
  const pendingCount = items.filter(i => i.status === 'pending').length

  return (
    <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-sand-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <h3 className="font-serif font-bold text-sm text-charcoal-950">
            Operations Attention Queue
          </h3>
        </div>
        <Badge variant={pendingCount > 0 ? "warning" : "success"} size="sm">
          {pendingCount} Action{pendingCount !== 1 ? 's' : ''} Open
        </Badge>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isPending = item.status === 'pending'

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-3 rounded-xl border space-y-2 transition-all ${
                isPending
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-sand-50/40 border-sand-200 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isPending ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                    <h4 className="font-bold text-xs text-charcoal-900 font-serif">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-charcoal-600 leading-snug">
                    {item.description}
                  </p>
                </div>

                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  {item.time}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1.5 border-t border-sand-200/60 text-[11px]">
                <span className="text-muted-foreground font-medium">
                  {item.vendorName || `Tour ${item.tourId}`}
                </span>

                {isPending ? (
                  <div className="flex items-center gap-1.5">
                    {item.type === 'TRAVELER_NOTIFICATION' ? (
                      <Button
                        size="sm"
                        onClick={() => onSendNotification(item.tourId)}
                        className="text-[11px] py-1 px-2.5 h-auto bg-terracotta-600 text-white"
                        leftIcon={<Send className="w-3 h-3" />}
                      >
                        Send Update
                      </Button>
                    ) : item.type === 'VENDOR_CONFIRMATION' ? (
                      <Button
                        size="sm"
                        onClick={() => onConfirmVendor(item.vendorId)}
                        className="text-[11px] py-1 px-2.5 h-auto bg-amber-600 text-white"
                        leftIcon={<Check className="w-3 h-3" />}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResolveItem(item.id)}
                        className="text-[11px] py-1 px-2.5 h-auto"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolved</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
