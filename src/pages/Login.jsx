import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext'

export const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  const { login, loginAs, isAuthenticated, role } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated, redirect immediately to the right dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectParam) {
        // Only use redirect if it matches the role
        if (role === 'TRAVELER' && !redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
        if (role === 'OPERATOR' && redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
      }
      navigate(role === 'OPERATOR' ? '/operator' : '/plan', { replace: true })
    }
  }, [isAuthenticated, role, navigate, redirectParam])

  const handleManualLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = login(email, password)
    setLoading(false)

    if (res.success) {
      const userRole = res.user.role
      if (redirectParam) {
        if (userRole === 'TRAVELER' && !redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
        if (userRole === 'OPERATOR' && redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
      }
      navigate(userRole === 'OPERATOR' ? '/operator' : '/plan', { replace: true })
    } else {
      setError(res.error || 'Login failed')
    }
  }

  const handleQuickDemoLogin = (targetRole) => {
    setError('')
    const loggedUser = loginAs(targetRole)
    if (loggedUser) {
      if (redirectParam) {
        if (targetRole === 'TRAVELER' && !redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
        if (targetRole === 'OPERATOR' && redirectParam.startsWith('/operator')) {
          navigate(redirectParam, { replace: true })
          return
        }
      }
      navigate(targetRole === 'OPERATOR' ? '/operator' : '/plan', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Logo */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#F1ECE1]">
        <Logo />
        <Link
          to="/"
          className="text-xs font-semibold text-[#5E6282] hover:text-navy-900 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-honey-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-honey-600" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 tracking-tight">
            Log in to Navora
          </h1>
          <p className="mt-2 text-sm text-[#5E6282] max-w-md mx-auto">
            Select your role using the 1-click Demo credentials or sign in with your email account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: DEMO ACCOUNTS (Prominent 1-click options for Judges & Evaluators) */}
          <div className="lg:col-span-7 bg-[#FAF6F0] border-2 border-honey-300/80 rounded-3xl p-6 sm:p-8 shadow-soft-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
              <div>
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-honey-500 animate-pulse" />
                  Demo Accounts
                </h2>
                <p className="text-xs text-[#5E6282] mt-0.5">
                  Click a button below to instantly log in as a Traveler or Operator
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white text-navy-900 rounded-lg border border-[#E0D7C6]">
                Instant Demo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traveler Demo Box */}
              <div className="bg-white rounded-2xl p-5 border border-coral-200/80 shadow-xs flex flex-col justify-between hover:shadow-soft-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">Traveler</h3>
                      <span className="text-[10px] text-coral-600 font-semibold bg-coral-50 px-2 py-0.5 rounded-full">
                        Role: TRAVELER
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EFEAE0] space-y-1 font-mono text-[11px] text-charcoal-700">
                    <div className="truncate">
                      <span className="text-muted-foreground">Email: </span>
                      <span className="font-semibold text-navy-900">{DEMO_CREDENTIALS.TRAVELER.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pass: </span>
                      <span className="font-semibold text-navy-900">{DEMO_CREDENTIALS.TRAVELER.password}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5E6282] leading-tight">
                    Access personalized tour planning, itinerary builder, dynamic cost calculation, and live trip navigation.
                  </p>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('TRAVELER')}
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-warm-coral transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Login as Traveler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Operator Demo Box */}
              <div className="bg-navy-900 text-white rounded-2xl p-5 border border-navy-800 shadow-xs flex flex-col justify-between hover:shadow-soft-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-honey-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Operator</h3>
                      <span className="text-[10px] text-honey-400 font-semibold bg-honey-400/20 px-2 py-0.5 rounded-full">
                        Role: OPERATOR
                      </span>
                    </div>
                  </div>

                  <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1 font-mono text-[11px] text-navy-200">
                    <div className="truncate">
                      <span className="text-navy-400">Email: </span>
                      <span className="font-semibold text-white">{DEMO_CREDENTIALS.OPERATOR.email}</span>
                    </div>
                    <div>
                      <span className="text-navy-400">Pass: </span>
                      <span className="font-semibold text-white">{DEMO_CREDENTIALS.OPERATOR.password}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-navy-300 leading-tight">
                    Access operations command center, fleet telemetry, active tours, vendor tracking, and live disruption solvers.
                  </p>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('OPERATOR')}
                    className="w-full bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-warm-honey transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Login as Operator</span>
                    <ArrowRight className="w-3.5 h-3.5 text-navy-950" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: REGULAR FORM LOGIN */}
          <div className="lg:col-span-5 bg-white border border-[#EFEAE0] rounded-3xl p-6 sm:p-8 shadow-soft-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-1">Standard Sign In</h2>
            <p className="text-xs text-[#5E6282] mb-6">
              Enter your credentials to access your personalized workspace.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. traveler@demo.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F1ECE1] text-center text-xs text-[#5E6282]">
              <span>Don't have an account? </span>
              <Link to="/signup" className="font-bold text-coral-600 hover:text-coral-700 underline">
                Sign Up here
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer minimal */}
      <div className="max-w-5xl mx-auto w-full pt-6 border-t border-[#F1ECE1] text-center text-xs text-muted-foreground">
        <p>© 2026 Navora. Intelligent Travel Orchestration Platform • HackCelestial 3.0</p>
      </div>
    </div>
  )
}

export default Login
