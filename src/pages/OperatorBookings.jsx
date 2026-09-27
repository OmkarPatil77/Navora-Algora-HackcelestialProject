import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, CheckCircle2, Clock, Users, Search, Plus, 
  Download, Compass, IndianRupee, AlertTriangle, Check, X, Plane, FileText
} from 'lucide-react'
import { initialBookings, initialRecentActivity } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorBookings = () => {
  const navigate = useNavigate()
  const [bookingsList, setBookingsList] = useState(initialBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  // Filter
  const filteredBookings = bookingsList.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tourId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-charcoal-600" />
      case 'payment':
        return <IndianRupee className="w-4 h-4 text-emerald-600" />
      case 'disruption':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'vendor':
        return <CheckCircle2 className="w-4 h-4 text-sky-600" />
      case 'tour':
      default:
        return <Plane className="w-4 h-4 text-terracotta-600" />
    }
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Booking ID,Tour ID,Customer Name,Email,Phone,Destination,Pax,Travel Dates,Total Amount,Paid Amount,Status",
        ...bookingsList.map(b => `${b.id},${b.tourId},"${b.customerName}",${b.email},${b.phone},"${b.destination}",${b.pax},"${b.travelDates}",${b.totalAmount},${b.paidAmount},${b.status}`)
      ].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Operator_Bookings_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateBooking = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newB = {
      id: `BK-2024-${String(bookingsList.length + 897)}`,
      tourId: formData.get('tourId') || 'GOA-2048',
      customerName: formData.get('customerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      destination: formData.get('destination'),
      pax: Number(formData.get('pax')) || 2,
      bookingDate: 'Just now',
      travelDates: formData.get('travelDates') || '15 Oct - 18 Oct 2026',
      totalAmount: formData.get('totalAmount') || '₹40,000',
      paidAmount: formData.get('totalAmount') || '₹40,000',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      statusVariant: 'success',
      hotel: 'Selected Partner Hotel',
      guide: 'Assigned Hub Dispatcher'
    }
    setBookingsList([newB, ...bookingsList])
    setAddSuccess(true)
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-7 max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
                BOOKING MANAGEMENT
              </span>
              <span className="text-[11px] text-muted-foreground">• Customer Reservations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              Bookings & Reservations
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Manage passenger rosters, booking statuses, itinerary links, and guest communication.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-50 transition-colors shadow-soft-xs"
            >
              <Download className="w-3.5 h-3.5 text-charcoal-500" />
              <span>Export Roster</span>
            </button>
            <button
              onClick={() => { setShowAddModal(true); setAddSuccess(false); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors shadow-soft-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                +12% this month
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Confirmed</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                142
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Ready for departure
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Active / In-Trip</span>
              <div className="w-7 h-7 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                12
              </span>
              <span className="text-[11px] block text-sky-600 font-medium mt-0.5">
                Currently traveling
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Pending Payment</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                2
              </span>
              <span className="text-[11px] block text-amber-600 font-medium mt-0.5">
                Awaiting confirmation
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
              placeholder="Search by booking ID, customer name, destination, or tour ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sand-50/70 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["All", "Active", "Confirmed", "Pending"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === st
                    ? "bg-charcoal-900 text-white shadow-soft-xs"
                    : "bg-sand-50 text-charcoal-700 hover:bg-sand-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl border border-sand-200/90 shadow-soft-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-50/50 border-b border-sand-200 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Booking Reference</th>
                  <th className="py-3 px-4">Guest / Cohort</th>
                  <th className="py-3 px-4">Tour / Hub</th>
                  <th className="py-3 px-4">Travel Dates</th>
                  <th className="py-3 px-4">Pax</th>
                  <th className="py-3 px-4">Financials</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs text-charcoal-900">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal-900 font-mono block">{b.id}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{b.bookingDate}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal-900 block">{b.customerName}</span>
                      <span className="text-[11px] text-muted-foreground">{b.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-charcoal-900 block">{b.destination}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{b.tourId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {b.travelDates}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-sand-100 font-mono font-bold text-charcoal-700">
                        {b.pax} Pax
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold font-serif text-charcoal-950 block">{b.totalAmount}</span>
                      <span className={`text-[10px] font-bold ${
                        b.paymentStatus === 'Paid' 
                          ? 'text-emerald-600' 
                          : b.paymentStatus === 'Partial' 
                          ? 'text-terracotta-600' 
                          : 'text-amber-600'
                      }`}>
                        {b.paidAmount} ({b.paymentStatus})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        b.status === 'Active'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : b.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-[11px] font-semibold transition-all shadow-soft-xs"
                      >
                        <FileText className="w-3 h-3 text-sand-300" />
                        <span>Manage →</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Card (Image 1 reference design) */}
        <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold font-serif text-charcoal-950">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {initialRecentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-sand-50/40 border border-sand-200/70 hover:bg-sand-50 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-sand-200 flex items-center justify-center shrink-0 shadow-soft-xs">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-bold text-charcoal-900">{act.title}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">{act.detail}</span>
                  </div>
                </div>

                <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal: Booking Management / Details */}
        <AnimatePresence>
          {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-sand-200 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <div>
                    <h3 className="font-bold text-base font-serif text-charcoal-950">
                      {selectedBooking.customerName}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">{selectedBooking.id} • {selectedBooking.tourId}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    aria-label="Close booking details modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200">
                      <span className="text-muted-foreground block text-[10px]">Contact Phone</span>
                      <span className="font-mono font-bold text-charcoal-900">{selectedBooking.phone}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200">
                      <span className="text-muted-foreground block text-[10px]">Contact Email</span>
                      <span className="font-bold text-charcoal-900 truncate block">{selectedBooking.email}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-sand-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-bold text-charcoal-900">{selectedBooking.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travel Window:</span>
                      <span className="font-mono font-medium text-charcoal-900">{selectedBooking.travelDates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned Hotel:</span>
                      <span className="font-medium text-charcoal-900">{selectedBooking.hotel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lead Guide:</span>
                      <span className="font-medium text-charcoal-900">{selectedBooking.guide}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/80 border border-sand-200 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Settlement</span>
                      <span className="font-bold text-emerald-700">{selectedBooking.paidAmount} Paid</span>
                    </div>
                    <span className="text-base font-bold font-serif text-charcoal-950">{selectedBooking.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    className="px-3.5 py-2 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedBooking.tourId) {
                        navigate(`/operator/tours/${selectedBooking.tourId}`)
                      }
                      setSelectedBooking(null)
                    }}
                    className="px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800"
                  >
                    Open Tour Dashboard
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: New Booking */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-sand-200 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <h3 className="font-bold text-base font-serif text-charcoal-950">Create Guest Booking</h3>
                  <button 
                    onClick={() => { setShowAddModal(false); setAddSuccess(false); }}
                    aria-label="Close create guest booking modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {addSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-charcoal-950">Booking Created Successfully!</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Guest reservation confirmed and synced with fleet logistics.
                    </p>
                    <button 
                      onClick={() => { setShowAddModal(false); setAddSuccess(false); }}
                      className="mt-2 px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-charcoal-700 mb-1">Guest / Cohort Name</label>
                      <input 
                        name="customerName" 
                        required 
                        placeholder="e.g. Rahul & Sunita Kapoor" 
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Email</label>
                        <input 
                          name="email" 
                          type="email"
                          required 
                          placeholder="guest@example.com" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Phone</label>
                        <input 
                          name="phone" 
                          required 
                          placeholder="+91 98000 00000" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Destination</label>
                        <input 
                          name="destination" 
                          required 
                          placeholder="Goa Coastal Escape" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Pax Count</label>
                        <input 
                          name="pax" 
                          type="number"
                          defaultValue={2}
                          min={1}
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Travel Dates</label>
                        <input 
                          name="travelDates" 
                          defaultValue="15 Oct - 18 Oct 2026" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Total Amount</label>
                        <input 
                          name="totalAmount" 
                          defaultValue="₹42,000" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddModal(false)}
                        className="px-3.5 py-2 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}

export default OperatorBookings
