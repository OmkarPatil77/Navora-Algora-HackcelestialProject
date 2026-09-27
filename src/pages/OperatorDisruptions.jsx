import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, TrendingUp, CheckCircle2, Zap, Search, 
  Plane, CloudRain, Users, Sparkles, Check, X
} from 'lucide-react'
import { initialDisruptions } from '@/data/operatorData'
import { useTripPlan } from '@/context/TripPlanningContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorDisruptions = () => {
  const navigate = useNavigate()
  const { activeDisruption, appliedRecovery, applyRecoveryPlan } = useTripPlan()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [resolveSuccess, setResolveSuccess] = useState(false)

  // Sync active disruption from context for GOA-2048
  const disruptions = initialDisruptions.map(d => {
    if (d.id === 'DIS-2024-001') {
      if (appliedRecovery) {
        return {
          ...d,
          status: 'Resolved',
          statusVariant: 'success',
          severityVariant: 'info',
          aiRecoveryPlan: `Plan ${appliedRecovery} • Applied & active on itinerary`
        }
      }
      if (!activeDisruption) {
        return {
          ...d,
          status: 'Resolved',
          statusVariant: 'success',
          severityVariant: 'info',
          aiRecoveryPlan: 'All logistics normal • No active disruption'
        }
      }
    }
    return d
  })

  // Filter
  const filteredDisruptions = disruptions.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tourId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter
    const matchesSeverity = severityFilter === 'All' || d.severity === severityFilter

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-rose-600" />
      case 'weather':
        return <CloudRain className="w-4 h-4 text-amber-600" />
      case 'guide':
      default:
        return <Users className="w-4 h-4 text-emerald-600" />
    }
  }

  const getCardBorderStyle = (status, severity) => {
    if (status === 'Active' || severity === 'High') {
      return 'border-rose-200 hover:border-rose-300 ring-1 ring-rose-200/50'
    }
    if (status === 'Monitoring' || severity === 'Medium') {
      return 'border-amber-200 hover:border-amber-300 ring-1 ring-amber-200/40'
    }
    return 'border-emerald-200 hover:border-emerald-300'
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-7 max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                DISRUPTION MANAGEMENT
              </span>
              <span className="text-[11px] text-muted-foreground">• Incident Response</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              Disruptions Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Monitor, analyze, and resolve travel disruptions with AI-powered recovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/operator/reports')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-50 transition-colors shadow-soft-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-charcoal-500" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Active Disruptions</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                {disruptions.filter(d => d.status === 'Active').length}
              </span>
              <span className="text-[11px] block text-rose-600 font-medium mt-0.5">
                Immediate Action
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Under Monitoring</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                1
              </span>
              <span className="text-[11px] block text-amber-600 font-medium mt-0.5">
                Watch List
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Resolved Today</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                {disruptions.filter(d => d.status === 'Resolved').length}
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Closed Cases
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Resolution Rate</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                98.5%
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Success Rate
              </span>
            </div>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-sand-200/90 shadow-soft-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by disruption title, tour ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sand-50/70 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              aria-label="Filter by severity"
              className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Disruption Cards Stack */}
        <div className="space-y-4">
          {filteredDisruptions.map((incident) => (
            <Card
              key={incident.id}
              className={`p-6 bg-white border rounded-2xl shadow-soft-xs transition-all space-y-4 ${getCardBorderStyle(incident.status, incident.severity)}`}
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sand-100 flex items-center justify-center">
                      {getIncidentIcon(incident.iconType)}
                    </div>
                    <span className="font-mono text-xs font-bold text-charcoal-900">
                      {incident.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      incident.severity === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : incident.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-700'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      incident.status === 'Active'
                        ? 'bg-rose-600 text-white'
                        : incident.status === 'Monitoring'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {incident.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-serif text-charcoal-950">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      {incident.description}
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {incident.status === 'Active' && (
                    <button
                      onClick={() => {
                        setSelectedIncident(incident)
                        setShowResolveModal(true)
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-soft-xs"
                    >
                      Resolve Now →
                    </button>
                  )}
                  {incident.status === 'Monitoring' && (
                    <button
                      onClick={() => {
                        setSelectedIncident(incident)
                        setShowResolveModal(true)
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-amber-300 text-amber-900 bg-amber-50/50 hover:bg-amber-100 transition-colors"
                    >
                      Monitor
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/operator/tours/${incident.tourId}`)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-50 transition-colors shadow-soft-xs"
                  >
                    View Tour
                  </button>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sand-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tour ID</span>
                  <span className="font-mono font-bold text-charcoal-900">{incident.tourId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Detected At</span>
                  <span className="font-mono text-charcoal-700">{incident.detectedAt}</span>
                </div>
                {incident.timeChange && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Time Change</span>
                    <span className="font-mono font-semibold text-amber-700">{incident.timeChange}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Resolution ETA</span>
                  <span className="font-mono text-charcoal-700">{incident.resolutionEta}</span>
                </div>
              </div>

              {/* Affected Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {incident.affectedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-sand-100/80 text-charcoal-700 border border-sand-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* AI Recovery Plan Pill */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-900 block">
                      AI RECOVERY PLAN
                    </span>
                    <span className="text-emerald-800 font-medium text-[11px]">
                      {incident.aiRecoveryPlan}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Incident Resolution / AI Engine */}
        <AnimatePresence>
          {showResolveModal && selectedIncident && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl border border-sand-200 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <div>
                    <h3 className="font-bold text-sm text-charcoal-900 font-serif">Recovery Decision Solver</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">{selectedIncident.id} • {selectedIncident.tourId}</span>
                  </div>
                  <button 
                    onClick={() => { setShowResolveModal(false); setResolveSuccess(false); }}
                    aria-label="Close recovery solver modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {resolveSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-charcoal-950">AI Recovery Plan Enacted!</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Schedule changes pushed to vendor partners. Guest notification dispatched.
                    </p>
                    <button 
                      onClick={() => {
                        setShowResolveModal(false)
                        setResolveSuccess(false)
                        navigate(`/operator/tours/${selectedIncident.tourId}`)
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold"
                    >
                      Inspect Live Tour Roster
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                      <span className="font-bold text-charcoal-900 block mb-1">Recommended Recovery Action</span>
                      <p className="text-charcoal-700 leading-relaxed">
                        Push airport pickup buffer +90 mins to 12:15. Adjust Casa Sol check-in to 13:15. Swap Grand Island Scuba dive to Fontainhas Afternoon Walk.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-semibold text-charcoal-900 block text-[11px]">Select Execution Mode:</span>
                      <div 
                        onClick={() => {
                          applyRecoveryPlan && applyRecoveryPlan('B')
                          setResolveSuccess(true)
                        }}
                        className="p-3 rounded-xl border border-terracotta-300 bg-terracotta-50/50 hover:bg-terracotta-50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-terracotta-900 block">Plan B • Balanced Recovery (Recommended)</span>
                          <span className="text-[11px] text-terracotta-700">98% customer satisfaction score • Zero cancellation penalty</span>
                        </div>
                        <span className="text-xs font-bold text-terracotta-700">Select →</span>
                      </div>

                      <div 
                        onClick={() => {
                          applyRecoveryPlan && applyRecoveryPlan('A')
                          setResolveSuccess(true)
                        }}
                        className="p-3 rounded-xl border border-sand-200 hover:bg-sand-50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-charcoal-900 block">Plan A • Maximum Rest</span>
                          <span className="text-[11px] text-muted-foreground">Relax check-in, move all activities to Day 2</span>
                        </div>
                        <span className="text-xs font-bold text-charcoal-400">Select →</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button 
                        onClick={() => setShowResolveModal(false)}
                        className="px-3.5 py-2 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}

export default OperatorDisruptions
