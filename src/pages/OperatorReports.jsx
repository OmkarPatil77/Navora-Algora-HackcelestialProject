import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IndianRupee, TrendingUp, Calendar, Star, Download, 
  Clock, ShieldCheck, Zap, Activity, AlertTriangle, 
  CheckCircle2, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorReports = () => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [dateRange, setDateRange] = useState('Last 30 Days')

  const destinations = [
    { name: "Goa", revenue: "₹85,000", pct: 26 },
    { name: "Jaipur", revenue: "₹72,000", pct: 22 },
    { name: "Kerala", revenue: "₹98,000", pct: 30 },
    { name: "Ladakh", revenue: "₹45,000", pct: 14 },
    { name: "Varanasi", revenue: "₹28,000", pct: 8 }
  ]

  const monthlyTrends = [
    { month: "May", revenue: "₹1,10,000", bookings: 28 },
    { month: "Jun", revenue: "₹95,000", bookings: 22 },
    { month: "Jul", revenue: "₹1,30,000", bookings: 34 },
    { month: "Aug", revenue: "₹1,25,000", bookings: 30 },
    { month: "Sep", revenue: "₹1,45,000", bookings: 42 }
  ]

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Metric,Value,Period",
        "Total Revenue,₹3,28,000,Last 30 Days",
        "Monthly Revenue,₹1,45,000,Current Month",
        "Total Bookings,156,All Time",
        "CSAT Score,4.92 / 5.0,Verified Guests",
        "On-Time Rate,97.4%,Operations",
        "Disruption Resolution,98.5%,Resolved Cases",
        "Avg Response Time,15 minutes,AI Copilot",
        ...destinations.map(d => `Revenue ${d.name},${d.revenue},${d.pct}%`)
      ].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Operations_Report_${dateRange.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-7 max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
                ANALYTICS & REPORTS
              </span>
              <span className="text-[11px] text-muted-foreground">• Business Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              Operations Reports
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Comprehensive analytics and performance metrics for tour operations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              aria-label="Select reporting date range"
              className="bg-white border border-sand-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-charcoal-700 shadow-soft-xs focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Year to Date">Year to Date</option>
            </select>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-50 transition-colors shadow-soft-xs"
            >
              <Download className="w-3.5 h-3.5 text-charcoal-500" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Total Revenue</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                3,28,000
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                +12.5% growth
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Monthly Revenue</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-terracotta-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                1,45,000
              </span>
              <span className="text-[11px] block text-muted-foreground font-medium mt-0.5">
                Current month
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Total Bookings</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-terracotta-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                156
              </span>
              <span className="text-[11px] block text-muted-foreground font-medium mt-0.5">
                42 this month
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">CSAT Score</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                4.92
              </span>
              <span className="text-[11px] block text-muted-foreground font-medium mt-0.5">
                Customer satisfaction
              </span>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-sand-200 flex gap-6 text-xs font-semibold">
          {["Overview", "Revenue", "Performance", "Bookings", "Disruptions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-colors relative ${
                activeTab === tab 
                  ? 'text-terracotta-600 border-b-2 border-terracotta-600 font-bold' 
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Card 1: Revenue by Destination */}
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-serif text-charcoal-950">
                    Revenue by Destination
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sand-100 text-charcoal-700 border border-sand-200">
                    Top: Goa
                  </span>
                </div>

                <div className="space-y-3.5 pt-1">
                  {destinations.map((dest) => (
                    <div key={dest.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-charcoal-900">{dest.name}</span>
                        <span className="font-bold text-charcoal-950">{dest.revenue}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{dest.pct}% of total revenue</span>
                      </div>
                      <div className="w-full bg-sand-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-terracotta-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${dest.pct * 2.8}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 2: Performance Metrics */}
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">
                  Performance Metrics
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-sand-50/60 border border-sand-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>On-Time Rate</span>
                    </div>
                    <span className="text-xl font-bold font-serif text-charcoal-950 block">
                      97.4
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50/60 border border-sand-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>Customer Satisfaction</span>
                    </div>
                    <span className="text-xl font-bold font-serif text-charcoal-950 block">
                      4.92
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50/60 border border-sand-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Vendor Reliability</span>
                    </div>
                    <span className="text-xl font-bold font-serif text-charcoal-950 block">
                      94
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50/60 border border-sand-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-700">
                      <Zap className="w-3 h-3 text-rose-600" />
                      <span>Disruption Resolution</span>
                    </div>
                    <span className="text-xl font-bold font-serif text-charcoal-950 block">
                      98.5
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50/60 border border-sand-200/80 space-y-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-700">
                      <Activity className="w-3 h-3 text-sky-600" />
                      <span>Avg Response Time</span>
                    </div>
                    <span className="text-xl font-bold font-serif text-charcoal-950 block">
                      15 minutes
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 3: Booking Statistics */}
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">
                  Booking Statistics
                </h2>

                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-sand-50/50 border border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal-700">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Total Bookings</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-charcoal-950">156</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5 font-medium">+12%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/50 border border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal-700">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Monthly Bookings</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-charcoal-950">42</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5 font-medium">+8%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/50 border border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Cancellation Rate</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-charcoal-950">3.2%</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5 font-medium">-2%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/50 border border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal-700">
                      <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Avg Booking Value</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-charcoal-950">₹2100</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5 font-medium">+15%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/50 border border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal-700">
                      <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Peak Month</span>
                    </div>
                    <span className="font-bold text-charcoal-950">October</span>
                  </div>
                </div>
              </Card>

              {/* Card 4: Disruption Analytics */}
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">
                  Disruption Analytics
                </h2>

                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-sand-50/60 border border-sand-200/80">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        <span>Total Disruptions</span>
                      </div>
                      <span className="text-xl font-bold font-serif text-charcoal-950 block mt-0.5">8</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/60 border border-sand-200/80">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Resolved</span>
                      </div>
                      <span className="text-xl font-bold font-serif text-charcoal-950 block mt-0.5">7</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/60 border border-sand-200/80">
                      <div className="flex items-center gap-1 text-[10px] text-amber-700">
                        <Activity className="w-3 h-3 text-amber-600" />
                        <span>Active</span>
                      </div>
                      <span className="text-xl font-bold font-serif text-charcoal-950 block mt-0.5">1</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/60 border border-sand-200/80">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span>Avg Resolution Time</span>
                      </div>
                      <span className="text-xl font-bold font-serif text-charcoal-950 block mt-0.5">2.5 hours</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sand-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Common Disruption Types
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Flight Delays
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Weather
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Vendor Issues
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

            </motion.div>
          )}

          {activeTab === 'Revenue' && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">Monthly Revenue Stream</h2>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {monthlyTrends.map((m) => (
                    <div key={m.month} className="p-4 rounded-xl bg-sand-50/60 border border-sand-200 text-center space-y-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{m.month} 2026</span>
                      <span className="text-lg font-bold font-serif text-charcoal-950 block">{m.revenue}</span>
                      <span className="text-[11px] text-emerald-600 font-medium">{m.bookings} bookings</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'Performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">SLA & Operational Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-sand-50/60 border border-sand-200 space-y-1">
                    <span className="font-bold text-charcoal-900 block">Dispatch Punctuality</span>
                    <span className="text-2xl font-bold font-serif text-charcoal-950">99.1%</span>
                    <span className="text-[11px] text-muted-foreground block">Across all 10 Goa network partners</span>
                  </div>
                  <div className="p-4 rounded-xl bg-sand-50/60 border border-sand-200 space-y-1">
                    <span className="font-bold text-charcoal-900 block">AI Recovery Adoption</span>
                    <span className="text-2xl font-bold font-serif text-charcoal-950">100%</span>
                    <span className="text-[11px] text-muted-foreground block">Zero manual schedule conflicts</span>
                  </div>
                  <div className="p-4 rounded-xl bg-sand-50/60 border border-sand-200 space-y-1">
                    <span className="font-bold text-charcoal-900 block">Average Delay Absorption</span>
                    <span className="text-2xl font-bold font-serif text-charcoal-950">42 min</span>
                    <span className="text-[11px] text-muted-foreground block">Buffer preservation index</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'Bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">Booking Growth & Conversion</h2>
                <p className="text-xs text-muted-foreground">
                  Direct bookings up 28% year-on-year with 98.2% retention in Goa, Jaipur, and Kerala cohorts.
                </p>
              </Card>
            </motion.div>
          )}

          {activeTab === 'Disruptions' && (
            <motion.div
              key="disruptions"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
                <h2 className="text-base font-bold font-serif text-charcoal-950">Incident Resolution Log</h2>
                <p className="text-xs text-muted-foreground">
                  All active travel disruptions successfully mitigated using autonomous AI recovery plans with zero trip cancellations.
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}

export default OperatorReports
