import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Sparkles, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const Footer = () => {
  const { isAuthenticated, isTraveler, isOperator } = useAuth()

  return (
    <footer className="border-t border-sand-200/90 bg-sand-100/50 text-charcoal-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo showTagline={true} />
            <p className="text-xs text-charcoal-600 leading-relaxed max-w-md">
              AI-powered dynamic tour planning and operations platform. We personalize every detail of your journey and intelligently adapt when disruptions happen.
            </p>
          </div>

          {/* Traveler Navigation - Visible to Travelers and Unauthenticated Visitors */}
          {(!isAuthenticated || isTraveler) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-coral-500" />
                <span>Traveler Portal</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/plan" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Plan Personalized Trip
                  </Link>
                </li>
                <li>
                  <Link to="/recommendations" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Explore Experiences
                  </Link>
                </li>
                <li>
                  <Link to="/itinerary" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Dynamic Itinerary
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Operator Navigation - Visible to Operators and Unauthenticated Visitors */}
          {(!isAuthenticated || isOperator) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-navy-900" />
                <span>Tour Operations</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/operator" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Command Center
                  </Link>
                </li>
                <li>
                  <Link to="/operator/tours" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Active Tours Monitor
                  </Link>
                </li>
                <li>
                  <Link to="/operator/tours/tour-801" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                    Disruption Recovery Demo
                  </Link>
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-sand-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 Navora. Plan it. Personalize it. Adapt it.</p>
          <p className="flex items-center gap-1">
            Engineered with Role-Based Access Control (RBAC)
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
