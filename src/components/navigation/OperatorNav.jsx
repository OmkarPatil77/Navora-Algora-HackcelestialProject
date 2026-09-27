import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Layers, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const OperatorNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: "Command Center", href: "/operator", icon: Activity },
    { label: "All Active Tours", href: "/operator/tours", icon: Layers },
  ]

  const isActive = (path) => {
    if (path === '/operator' && location.pathname === '/operator') return true
    if (path === '/operator/tours' && location.pathname.startsWith('/operator/tours')) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-800 bg-charcoal-950 text-sand-50 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Operator Badge */}
        <div className="flex items-center gap-6">
          <Logo isDark={true} to="/operator" />

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-charcoal-800 border border-charcoal-700 text-terracotta-400 text-[11px] font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Ops Desk</span>
          </div>

          {/* Ops Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                    active
                      ? "bg-charcoal-800 text-white font-semibold"
                      : "text-charcoal-400 hover:text-white hover:bg-charcoal-900"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", active ? "text-terracotta-400" : "text-charcoal-500")} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-charcoal-900 border border-charcoal-800 text-xs text-charcoal-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Stream: 18 Tours</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-charcoal-900 text-sand-200 border-charcoal-700 hover:bg-charcoal-800 hover:text-white text-xs gap-1.5"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Traveler Mode
          </Button>
        </div>
      </div>
    </header>
  )
}
