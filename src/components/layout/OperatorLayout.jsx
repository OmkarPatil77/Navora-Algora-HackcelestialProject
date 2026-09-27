import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, LogOut, ShieldCheck } from 'lucide-react'
import { OperatorSidebar } from '@/components/navigation/OperatorSidebar'
import { OperatorOpsCopilot } from '@/components/operator/OperatorOpsCopilot'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'

export const OperatorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans selection:bg-terracotta-500/20 selection:text-charcoal-950 flex flex-col">
      {/* Sidebar Navigation */}
      <OperatorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Operational Header Bar */}
        <header className="sticky top-0 z-30 w-full border-b border-sand-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-soft-xs">
          {/* Mobile Hamburger & Page Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-sand-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right Status & Badges & Operator Profile */}
          <div className="flex items-center gap-3">

            <Badge variant="outline" size="sm" className="hidden sm:inline-flex bg-white text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Operator Portal
            </Badge>

            {/* Operator User Profile Pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-sand-50 border border-sand-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-navy-900 text-honey-400 flex items-center justify-center text-[10px] font-bold">
                {user?.avatar || 'OP'}
              </div>
              <div className="text-left leading-tight">
                <span className="block font-bold text-navy-900 text-[11px]">{user?.name || 'Operator'}</span>
                <span className="block text-[9px] text-muted-foreground">Lead Dispatcher</span>
              </div>
            </div>

            {/* Logout button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              className="text-xs gap-1.5 bg-white border-sand-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Floating Ops Copilot */}
      <OperatorOpsCopilot />
    </div>
  )
}

export default OperatorLayout
