import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Compass, CalendarCheck, Users, Store, 
  Clock, AlertTriangle, CreditCard, BarChart3, ShieldCheck, 
  LogOut, User 
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useTripPlan } from '@/context/TripPlanningContext'
import { useAuth } from '@/context/AuthContext'

export const OperatorSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { activeDisruption, appliedRecovery } = useTripPlan()
  const { user, logout } = useAuth()

  const navSections = [
    {
      title: "Operations",
      items: [
        { label: "Overview", href: "/operator", icon: LayoutDashboard, badge: activeDisruption && !appliedRecovery ? "1 Alert" : null, badgeVariant: "danger" },
        { label: "Tours", href: "/operator/tours", icon: Compass, count: "12" },
        { label: "Bookings", href: "/operator/bookings", icon: CalendarCheck, count: "156" },
        { label: "Vendors", href: "/operator/vendors", icon: Store, count: "10" },
        { label: "Disruptions", href: "/operator/disruptions", icon: AlertTriangle, count: activeDisruption && !appliedRecovery ? "1" : "0", badge: activeDisruption && !appliedRecovery ? "1 Alert" : null, badgeVariant: "danger" },
        { label: "Payments", href: "/operator/payments", icon: CreditCard, count: "5" },
        { label: "Reports", href: "/operator/reports", icon: BarChart3 }
      ]
    }
  ]

  const isActive = (path) => {
    if (path === '#' || !path) return false
    if (path === '/operator') return location.pathname === '/operator'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-sand-200/90 flex flex-col justify-between 
      transition-transform duration-200 ease-in-out
      lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Top Brand Section */}
      <div className="p-5 border-b border-sand-100 space-y-3">
        <div className="flex items-center justify-between">
          <Logo to="/operator" isDark={false} />
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sand-100 text-charcoal-700 border border-sand-200">
            Ops Desk
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-sand-50/80 border border-sand-200 text-xs text-charcoal-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-[11px] text-charcoal-900 truncate">Goa Hub Operations</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon
                const active = isActive(item.href)

                if (item.disabled) {
                  return (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-charcoal-400 select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-charcoal-300" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-sand-100 text-charcoal-400">
                        Soon
                      </span>
                    </div>
                  )
                }

                return (
                  <Link
                    key={itemIdx}
                    to={item.href}
                    onClick={() => onClose && onClose()}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-terracotta-50 text-terracotta-700 font-bold border border-terracotta-200/70 shadow-soft-xs"
                        : "text-charcoal-700 hover:text-charcoal-950 hover:bg-sand-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? "text-terracotta-600" : "text-charcoal-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        {item.badge}
                      </span>
                    )}

                    {item.count && !item.badge && (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {item.count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Telemetry & Operator User Info / Sign Out */}
      <div className="p-4 border-t border-sand-100 space-y-3 bg-sand-50/40">

        {/* Operator Profile and Logout */}
        <div className="pt-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-700 transition-colors shadow-soft-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Sign Out ({user?.name?.split(' ')[0] || 'Operator'})</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default OperatorSidebar
