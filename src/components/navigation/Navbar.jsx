import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Bell, Compass, Calendar, MapPin, ArrowUpRight, Menu, X, 
  ShieldCheck, PlusCircle, LogIn, UserPlus, LogOut, User 
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, isTraveler, isOperator, logout } = useAuth()

  // Links for travelers
  const travelerNavLinks = [
    { label: "Plan", href: "/plan", icon: PlusCircle },
    { label: "Explore", href: "/recommendations", icon: Compass },
    { label: "Itinerary", href: "/itinerary", icon: Calendar },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F1ECE1] bg-[#FFFDF9]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Navigation: Only render traveler links if Traveler or Public on landing */}
          {(!isAuthenticated || isTraveler) && (
            <nav className="hidden md:flex items-center gap-1">
              {travelerNavLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-xl transition-all",
                      active
                        ? "text-coral-600 bg-coral-50 border border-coral-200/80 shadow-xs"
                        : "text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", active ? "text-coral-500" : "text-[#5E6282]")} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* If logged in as Operator and on landing, show command center direct link */}
          {isOperator && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/operator"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy-900 bg-sand-100 hover:bg-sand-200 rounded-xl border border-sand-300 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Operator Command Center</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">

          {/* CASE 1: NOT AUTHENTICATED */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-navy-900 hover:text-navy-950 bg-white hover:bg-[#FAF6F0] rounded-xl border border-[#EFEAE0] transition-colors shadow-soft-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-coral-600" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-warm-coral transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* CASE 2: AUTHENTICATED AS TRAVELER */}
          {isAuthenticated && isTraveler && (
            <>
              {/* Notification Bell */}
              <Dropdown
                trigger={
                  <button 
                    aria-label="View notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#EFEAE0] bg-white text-navy-900 hover:bg-[#FAF6F0] transition-colors shadow-soft-xs"
                  >
                    <Bell className="h-4 w-4 text-navy-900" />
                  </button>
                }
              >
                <div className="p-3.5 w-72">
                  <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                    <span className="text-xs font-bold text-navy-900">Notifications</span>
                    <span className="text-[10px] text-sand-500 font-semibold">0 New</span>
                  </div>
                  <div className="py-5 text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-sand-100 text-sand-400 mx-auto flex items-center justify-center mb-1.5">
                      <Bell className="w-5 h-5 text-sand-400" />
                    </div>
                    <p className="text-xs font-bold text-navy-900">No New Notifications</p>
                    <p className="text-[11px] text-[#5E6282] leading-relaxed max-w-[210px] mx-auto">
                      You're all caught up! Live updates and trip alerts will appear here when active.
                    </p>
                  </div>
                </div>
              </Dropdown>

              {/* Profile Dropdown */}
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border border-[#EFEAE0] bg-white hover:bg-[#FAF6F0] transition-colors shadow-soft-xs">
                    <div className="w-6 h-6 rounded-full bg-coral-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {user?.avatar || 'TR'}
                    </div>
                    <span className="text-xs font-semibold text-navy-900 hidden lg:inline-block">
                      {user?.name?.split(' ')[0] || 'Traveler'}
                    </span>
                  </button>
                }
              >
                <div className="p-1 min-w-[190px]">
                  <div className="px-3 py-1.5 border-b border-sand-200 mb-1">
                    <p className="text-xs font-bold text-navy-900">{user?.name || 'Traveler'}</p>
                    <p className="text-[10px] text-coral-600 font-semibold">{user?.subtitle || 'Traveler Account'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownItem onClick={() => navigate('/plan')}>
                    <PlusCircle className="w-3.5 h-3.5 mr-2 text-coral-500" />
                    <span>Create New Trip</span>
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/itinerary')}>
                    <Calendar className="w-3.5 h-3.5 mr-2 text-charcoal-500" />
                    <span>My Itinerary</span>
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem onClick={handleLogout} className="text-rose-600 hover:text-rose-700">
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    <span>Sign Out</span>
                  </DropdownItem>
                </div>
              </Dropdown>

              {/* Primary CTA: Warm Honey Button */}
              <button
                onClick={() => navigate('/plan')}
                className="hidden sm:inline-flex items-center gap-1.5 bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold text-xs px-4 py-2 rounded-xl shadow-warm-honey transition-all"
              >
                <span>Plan a Trip</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-navy-950" />
              </button>
            </>
          )}

          {/* CASE 3: AUTHENTICATED AS OPERATOR */}
          {isAuthenticated && isOperator && (
            <div className="flex items-center gap-2">
              <Link
                to="/operator"
                className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-honey-400" />
                <span>Command Center</span>
              </Link>

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border border-[#EFEAE0] bg-white hover:bg-[#FAF6F0] transition-colors shadow-soft-xs">
                    <div className="w-6 h-6 rounded-full bg-navy-900 text-honey-400 flex items-center justify-center text-[10px] font-bold">
                      {user?.avatar || 'OP'}
                    </div>
                    <span className="text-xs font-semibold text-navy-900 hidden lg:inline-block">
                      {user?.name?.split(' ')[0] || 'Operator'}
                    </span>
                  </button>
                }
              >
                <div className="p-1 min-w-[190px]">
                  <div className="px-3 py-1.5 border-b border-sand-200 mb-1">
                    <p className="text-xs font-bold text-navy-900">{user?.name || 'Operator'}</p>
                    <p className="text-[10px] text-honey-600 font-semibold">{user?.subtitle || 'Lead Operator'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownItem onClick={() => navigate('/operator')}>
                    <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                    <span>Operations Hub</span>
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/operator/tours')}>
                    <Compass className="w-3.5 h-3.5 mr-2 text-navy-700" />
                    <span>Fleet Tours</span>
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem onClick={handleLogout} className="text-rose-600 hover:text-rose-700">
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    <span>Sign Out</span>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-sand-200 bg-white text-charcoal-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-200 bg-sand-50 px-4 pt-2 pb-4 space-y-2">
          {(!isAuthenticated || isTraveler) && travelerNavLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold",
                  active ? "bg-sand-200 text-charcoal-950" : "text-charcoal-700 hover:bg-sand-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-terracotta-600" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="pt-2 border-t border-sand-200 flex flex-col gap-2">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-bold text-navy-900 bg-white rounded-lg border border-sand-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-bold text-white bg-coral-500 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && isTraveler && (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/plan')
                  }}
                  className="w-full"
                >
                  Plan a Trip
                </Button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-lg border border-rose-200"
                >
                  Sign Out ({user?.name})
                </button>
              </>
            )}

            {isAuthenticated && isOperator && (
              <>
                <Link
                  to="/operator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-navy-900"
                >
                  <ShieldCheck className="w-4 h-4 text-honey-400" />
                  <span>Operator Command Center</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-lg border border-rose-200"
                >
                  Sign Out ({user?.name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
