import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IndianRupee, Clock, CheckCircle2, AlertCircle, Search, 
  Download, Plus, CreditCard, Landmark, QrCode, ArrowRight,
  FileText, Check, X
} from 'lucide-react'
import { initialPayments, initialPaymentSummary } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorPayments = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')
  const [selectedTxn, setSelectedTxn] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceSuccess, setInvoiceSuccess] = useState(false)

  // Filter payments
  const filteredPayments = initialPayments.filter(payment => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tourId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.subId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getMethodIcon = (methodType) => {
    switch (methodType) {
      case 'upi':
        return <QrCode className="w-3.5 h-3.5 text-charcoal-500" />
      case 'bank':
        return <Landmark className="w-3.5 h-3.5 text-charcoal-500" />
      case 'card':
        return <CreditCard className="w-3.5 h-3.5 text-charcoal-500" />
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-500" />
    }
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Transaction ID,Booking ID,Tour ID,Amount,Method,Date,Type,Status",
        ...initialPayments.map(p => `${p.transactionId},${p.bookingId},${p.tourId},${p.amount},${p.method},${p.date},${p.type},${p.status}`)
      ].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Operator_Payments_${new Date().toISOString().slice(0,10)}.csv`)
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
                PAYMENT MANAGEMENT
              </span>
              <span className="text-[11px] text-muted-foreground">• Financial Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              Payments & Transactions
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Track payments, manage invoices, and monitor financial transactions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-sand-300 text-charcoal-700 hover:bg-sand-50 transition-colors shadow-soft-xs"
            >
              <Download className="w-3.5 h-3.5 text-charcoal-500" />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => { setShowInvoiceModal(true); setInvoiceSuccess(false); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors shadow-soft-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Invoice</span>
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
                1,74,000
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Collected Amount
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Pending Amount</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                14,000
              </span>
              <span className="text-[11px] block text-amber-600 font-medium mt-0.5">
                Awaiting Payment
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Completed</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                4
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Successful Transactions
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Pending</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                1
              </span>
              <span className="text-[11px] block text-amber-600 font-medium mt-0.5">
                Awaiting Processing
              </span>
            </div>
          </Card>
        </div>

        {/* Transactions Table Card */}
        <div className="bg-white rounded-2xl border border-sand-200/90 shadow-soft-xs overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-sand-200/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by transaction ID, booking ID, or tour ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-sand-50/70 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by payment status"
                className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                aria-label="Filter by payment method"
                className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
              >
                <option value="All">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-50/50 border-b border-sand-200 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Tour ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs text-charcoal-900">
                {filteredPayments.map((p) => (
                  <tr key={p.transactionId} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal-900 font-mono block">{p.transactionId}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{p.subId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-charcoal-700">
                      {p.bookingId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-charcoal-800">
                      {p.tourId}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-serif text-charcoal-950">
                      {p.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-charcoal-700">
                        {getMethodIcon(p.methodType)}
                        <span>{p.method}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sand-100 text-charcoal-700">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        p.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTxn(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-[11px] font-semibold transition-all shadow-soft-xs"
                      >
                        <FileText className="w-3 h-3 text-sand-300" />
                        <span>View →</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary by Tour Section */}
        <Card className="p-6 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs space-y-5">
          <div className="pb-1 border-b border-sand-100">
            <h2 className="text-base sm:text-lg font-bold font-serif text-charcoal-950">
              Payment Summary by Tour
            </h2>
          </div>

          <div className="space-y-3">
            {initialPaymentSummary.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-sand-50/50 border border-sand-200/70 hover:bg-sand-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-charcoal-900 text-sm block">
                    {item.customer}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.tourId} • {item.location}
                  </span>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 min-w-[220px]">
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                    <span className="text-sm font-bold font-serif text-charcoal-950">
                      {item.paid} <span className="text-xs font-normal text-muted-foreground font-sans">/ {item.total}</span>
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.percentage}% paid
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-sand-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.percentage === 100 
                          ? 'bg-emerald-500' 
                          : item.percentage > 0 
                          ? 'bg-terracotta-500' 
                          : 'bg-sand-300'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal: View Transaction Details */}
        <AnimatePresence>
          {selectedTxn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-sand-200 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <div>
                    <h3 className="font-bold text-sm text-charcoal-900 font-serif">Transaction Receipt</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">{selectedTxn.transactionId}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTxn(null)}
                    aria-label="Close transaction receipt modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-sand-100">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono font-bold text-charcoal-900">{selectedTxn.bookingId}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sand-100">
                    <span className="text-muted-foreground">Tour Reference</span>
                    <span className="font-mono font-bold text-charcoal-900">{selectedTxn.tourId}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sand-100">
                    <span className="text-muted-foreground">Payment Date</span>
                    <span className="font-mono text-charcoal-900">{selectedTxn.date}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sand-100">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-semibold text-charcoal-900">{selectedTxn.method} ({selectedTxn.subId})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sand-100">
                    <span className="text-muted-foreground">Payment Type</span>
                    <span className="font-medium text-charcoal-900">{selectedTxn.type} Settlement</span>
                  </div>
                  <div className="flex justify-between py-2 items-center bg-sand-50 px-3 rounded-xl">
                    <span className="font-bold text-charcoal-900">Total Billed</span>
                    <span className="text-base font-bold font-serif text-emerald-700">{selectedTxn.amount}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setSelectedTxn(null)}
                    className="px-3 py-1.5 rounded-lg border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedTxn.tourId && selectedTxn.tourId !== '-') {
                        navigate(`/operator/tours/${selectedTxn.tourId}`)
                      }
                      setSelectedTxn(null)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800"
                  >
                    Open Tour Detail
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Generate Invoice */}
        <AnimatePresence>
          {showInvoiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl border border-sand-200 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <h3 className="font-bold text-base text-charcoal-900 font-serif">Generate Operator Invoice</h3>
                  <button 
                    onClick={() => { setShowInvoiceModal(false); setInvoiceSuccess(false); }}
                    aria-label="Close generate invoice modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {invoiceSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-charcoal-950">Invoice Generated & Dispatched</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      GST Tax invoice PDF has been dispatched to the guest contact email and recorded in the tour ledger.
                    </p>
                    <button 
                      onClick={() => { setShowInvoiceModal(false); setInvoiceSuccess(false); }}
                      className="mt-2 px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setInvoiceSuccess(true); }} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-charcoal-700 mb-1">Select Active Tour</label>
                      <select aria-label="Select Active Tour" className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs font-semibold text-charcoal-900">
                        <option value="GOA-2048">GOA-2048 • Aryan & Riya Sharma (₹35,000)</option>
                        <option value="JAIPUR-1021">JAIPUR-1021 • Kulkarni Family (₹68,000)</option>
                        <option value="KERALA-3382">KERALA-3382 • Mehta Corporate Retreat (₹1,12,000)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-charcoal-700 mb-1">Invoice Amount (INR)</label>
                      <input 
                        type="text" 
                        defaultValue="₹14,000" 
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-charcoal-700 mb-1">Billing Notes</label>
                      <textarea 
                        rows={2} 
                        defaultValue="Balance payment for final day transport & private dining package."
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900 resize-none"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setShowInvoiceModal(false)}
                        className="px-3.5 py-2 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold"
                      >
                        Issue Invoice
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

export default OperatorPayments
