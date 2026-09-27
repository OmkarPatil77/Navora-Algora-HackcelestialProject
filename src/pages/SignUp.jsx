import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Mail, Lock, UserCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useAuth } from '@/context/AuthContext'

export const SignUp = () => {
  const navigate = useNavigate()
  const { signup, isAuthenticated, role } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('TRAVELER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'OPERATOR' ? '/operator' : '/plan', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const res = signup({
      name,
      email,
      password,
      role: selectedRole
    })
    setLoading(false)

    if (res.success) {
      // Redirect to the corresponding dashboard based on the role
      navigate(res.user.role === 'OPERATOR' ? '/operator' : '/plan', { replace: true })
    } else {
      setError(res.error || 'Failed to create account.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Logo */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#F1ECE1]">
        <Logo />
        <Link
          to="/"
          className="text-xs font-semibold text-[#5E6282] hover:text-navy-900 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Form */}
      <div className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-honey-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-honey-600" />
            <span>Create New Account</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy-900 tracking-tight">
            Join Navora
          </h1>
          <p className="mt-1 text-xs text-[#5E6282]">
            Choose your account role and get started with personalized travel orchestration.
          </p>
        </div>

        <div className="bg-white border border-[#EFEAE0] rounded-3xl p-6 sm:p-8 shadow-soft-sm">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-2">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('TRAVELER')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'TRAVELER'
                      ? 'border-coral-500 bg-coral-50/60 shadow-xs text-navy-900 ring-2 ring-coral-500/20'
                      : 'border-[#EAE3D5] bg-[#FAF8F5] text-charcoal-700 hover:bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'TRAVELER' ? 'bg-coral-500 text-white' : 'bg-sand-200 text-charcoal-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold">Traveler</span>
                    <span className="block text-[10px] text-muted-foreground">Plan & explore trips</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('OPERATOR')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'OPERATOR'
                      ? 'border-navy-900 bg-navy-900 shadow-xs text-white ring-2 ring-navy-900/20'
                      : 'border-[#EAE3D5] bg-[#FAF8F5] text-charcoal-700 hover:bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'OPERATOR' ? 'bg-honey-500 text-navy-950' : 'bg-sand-200 text-charcoal-600'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold">Operator</span>
                    <span className={`block text-[10px] ${selectedRole === 'OPERATOR' ? 'text-navy-200' : 'text-muted-foreground'}`}>
                      Dispatch & operations
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-warm-coral transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Account...' : `Register as ${selectedRole === 'OPERATOR' ? 'Operator' : 'Traveler'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F1ECE1] text-center text-xs text-[#5E6282]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-navy-900 hover:underline">
              Log In here
            </Link>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <div className="max-w-xl mx-auto w-full pt-6 border-t border-[#F1ECE1] text-center text-xs text-muted-foreground">
        <p>© 2026 Navora. Intelligent Travel Orchestration Platform</p>
      </div>
    </div>
  )
}

export default SignUp
