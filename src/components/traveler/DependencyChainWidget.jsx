import React, { useState } from 'react'
import { ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const DependencyChainWidget = ({ dayItems = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter out pure buffer nodes for concise chain representation
  const chainNodes = dayItems.filter(i => i.type !== 'buffer')

  return (
    <Card className="p-4 sm:p-5 bg-sand-50/60 border-sand-200/90 shadow-soft-xs space-y-3">
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-terracotta-50 text-terracotta-700 border border-terracotta-200/60">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal-950">
              Journey Dependency Graph
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Connected sequence protecting downstream bookings from upstream delays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="spark" size="sm">
            {chainNodes.length} Linked Nodes
          </Badge>
          <button className="text-charcoal-500 hover:text-charcoal-800 p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chain Stream Preview */}
      <div className="pt-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 text-xs min-w-max">
          {chainNodes.map((node, idx) => {
            const isLast = idx === chainNodes.length - 1
            return (
              <React.Fragment key={node.id || idx}>
                <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                  node.critical 
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950 font-semibold' 
                    : 'bg-white border-sand-200 text-charcoal-800'
                }`}>
                  <span className="font-mono text-[10px] text-muted-foreground">{node.startTime}</span>
                  <span className="font-serif text-xs line-clamp-1 max-w-[140px]">{node.title}</span>
                  {node.critical && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Fixed Critical" />
                  )}
                </div>

                {!isLast && (
                  <ArrowRight className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Expanded Details Insight */}
      {isExpanded && (
        <div className="pt-3 border-t border-sand-200/80 text-xs text-charcoal-700 space-y-2 bg-white/60 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Operational Integrity Guarantee</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Navora maintains live mathematical dependencies between your arrival, check-in, and timed sunset passes. If your arrival experiences any delay, our dynamic solver calculates ripple impacts in milliseconds and preserves downstream slots without cancellation penalties.
          </p>
        </div>
      )}
    </Card>
  )
}
