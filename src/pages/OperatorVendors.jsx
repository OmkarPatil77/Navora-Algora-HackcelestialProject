import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Store, CheckCircle2, AlertCircle, Star, Search, Plus, 
  Phone, User, Check, X
} from 'lucide-react'
import { initialVendors } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorVendors = () => {
  const navigate = useNavigate()
  const [vendorsList, setVendorsList] = useState(initialVendors)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeContactVendor, setActiveContactVendor] = useState(null)
  const [activeDetailsVendor, setActiveDetailsVendor] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  // Filters
  const filteredVendors = vendorsList.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.tourId && v.tourId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCat = categoryFilter === 'All' || v.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter || v.statusLabel === statusFilter

    return matchesSearch && matchesCat && matchesStatus
  })

  // Quick stats calculation
  const totalCount = vendorsList.length
  const confirmedCount = vendorsList.filter(v => v.status === 'confirmed').length
  const actionCount = vendorsList.filter(v => v.status === 'requires_action').length
  const avgRating = (vendorsList.reduce((acc, v) => acc + v.rating, 0) / (vendorsList.length || 1)).toFixed(1)

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'requires_action':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'updated':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'replaced':
        return 'bg-sand-100 text-charcoal-700 border-sand-300'
      case 'scheduled':
        return 'bg-sky-50 text-sky-700 border-sky-200'
      case 'confirmed':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }

  const handleAddVendor = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newV = {
      id: `VEN-${String(vendorsList.length + 1).padStart(3, '0')}`,
      name: formData.get('name'),
      category: formData.get('category'),
      service: formData.get('service'),
      contactPerson: formData.get('contactPerson'),
      phone: formData.get('phone'),
      rating: 4.8,
      status: 'confirmed',
      statusLabel: 'Confirmed',
      tourId: 'GOA-2048',
      scheduledTime: '10:00',
      updatedTime: '10:00',
      note: 'Newly registered vendor partner in good standing.'
    }
    setVendorsList([newV, ...vendorsList])
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
                VENDOR NETWORK
              </span>
              <span className="text-[11px] text-muted-foreground">• Partner Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              Vendor Directory
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Manage service providers, track performance, and coordinate operations.
            </p>
          </div>

          <button
            onClick={() => { setShowAddModal(true); setAddSuccess(false); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors shadow-soft-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor</span>
          </button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Total Vendors</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Store className="w-3.5 h-3.5 text-rose-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                {totalCount}
              </span>
              <span className="text-[11px] block text-muted-foreground font-medium mt-0.5">
                Active Partners
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
                {confirmedCount}
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                Ready to Serve
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Action Required</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                {actionCount}
              </span>
              <span className="text-[11px] block text-rose-600 font-medium mt-0.5">
                Needs Attention
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Avg Rating</span>
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-charcoal-950">
                {avgRating}
              </span>
              <span className="text-[11px] block text-muted-foreground font-medium mt-0.5">
                Quality Score
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
              placeholder="Search by vendor name, service, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sand-50/70 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Categories</option>
              <option value="Transport">Transport</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Experience">Experience</option>
              <option value="Dining">Dining</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="bg-sand-50/70 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-700 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="requires_action">Requires action</option>
              <option value="updated">Updated</option>
              <option value="replaced">Replaced</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* 3-Column Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="p-5 bg-white border border-sand-200/90 rounded-2xl shadow-soft-xs hover:border-sand-300 hover:shadow-soft-sm transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                    {vendor.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(vendor.status)}`}>
                    {vendor.statusLabel || vendor.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-serif text-charcoal-950 leading-snug">
                    {vendor.name}
                  </h3>
                  <p className="text-xs text-charcoal-600 font-medium mt-0.5">
                    {vendor.service}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{vendor.rating}</span>
                  </div>
                  {vendor.tourId && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-mono text-muted-foreground text-[11px] font-semibold">
                        {vendor.tourId}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Middle: Contact & Schedules & Note */}
              <div className="space-y-2.5 pt-2 border-t border-sand-100 text-xs">
                <div className="flex items-center justify-between text-charcoal-700">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-charcoal-600">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span>{vendor.contactPerson}</span>
                  </div>
                </div>

                {/* Schedule Times */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-charcoal-600 bg-sand-50/70 px-2.5 py-1.5 rounded-xl">
                  <div>
                    <span className="text-muted-foreground">Scheduled: </span>
                    <span className="font-bold text-charcoal-900">{vendor.scheduledTime}</span>
                  </div>
                  {vendor.updatedTime && vendor.updatedTime !== vendor.scheduledTime && (
                    <div>
                      <span className="text-amber-700 font-medium">Updated: </span>
                      <span className="font-bold text-amber-800">{vendor.updatedTime}</span>
                    </div>
                  )}
                </div>

                {/* Note */}
                {vendor.note && (
                  <p className="text-[11px] text-muted-foreground bg-sand-50/40 p-2.5 rounded-xl leading-relaxed">
                    {vendor.note}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveDetailsVendor(vendor)}
                  className="flex-1 py-2 px-3 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-xs font-semibold text-charcoal-700 transition-colors shadow-soft-xs text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => setActiveContactVendor(vendor)}
                  className="flex-1 py-2 px-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold transition-colors shadow-soft-xs text-center"
                >
                  Contact
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Vendor Details */}
        <AnimatePresence>
          {activeDetailsVendor && (
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
                      {activeDetailsVendor.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{activeDetailsVendor.category}</span>
                  </div>
                  <button 
                    onClick={() => setActiveDetailsVendor(null)}
                    aria-label="Close vendor details modal"
                    className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-sand-50 p-3 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-medium">Assigned Service</span>
                    <p className="font-bold text-charcoal-900 text-sm">{activeDetailsVendor.service}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl border border-sand-200">
                      <span className="text-muted-foreground block text-[10px]">Contact Person</span>
                      <span className="font-bold text-charcoal-900">{activeDetailsVendor.contactPerson}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-sand-200">
                      <span className="text-muted-foreground block text-[10px]">Phone Number</span>
                      <span className="font-mono font-bold text-charcoal-900">{activeDetailsVendor.phone}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-sand-200 space-y-1">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider block">Operational Note</span>
                    <p className="text-charcoal-700 leading-relaxed">{activeDetailsVendor.note}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    onClick={() => setActiveDetailsVendor(null)}
                    className="px-3.5 py-2 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      if (activeDetailsVendor.tourId) {
                        navigate(`/operator/tours/${activeDetailsVendor.tourId}`)
                      }
                      setActiveDetailsVendor(null)
                    }}
                    className="px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800"
                  >
                    Open Tour
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Quick Contact */}
        <AnimatePresence>
          {activeContactVendor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-soft-xl border border-sand-200 space-y-4 text-center"
              >
                <div>
                  <h3 className="font-bold text-base font-serif text-charcoal-950">
                    Contact {activeContactVendor.contactPerson}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeContactVendor.name} • {activeContactVendor.phone}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 text-left text-xs space-y-1">
                  <span className="font-bold text-charcoal-900 block">Active Slot Context</span>
                  <span className="text-muted-foreground block text-[11px]">
                    Tour {activeContactVendor.tourId || 'GOA-2048'} • {activeContactVendor.service}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveContactVendor(null)}
                    className="flex-1 py-2 px-3 rounded-xl border border-sand-200 text-charcoal-700 text-xs font-semibold hover:bg-sand-50"
                  >
                    Cancel
                  </button>
                  <a
                    href={`tel:${activeContactVendor.phone}`}
                    className="flex-1 inline-flex items-center justify-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Dial Direct</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Add Vendor Partner */}
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
                  <h3 className="font-bold text-base font-serif text-charcoal-950">Add Partner Vendor</h3>
                  <button 
                    onClick={() => { setShowAddModal(false); setAddSuccess(false); }}
                    aria-label="Close add partner vendor modal"
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
                    <h4 className="font-bold text-charcoal-950">Partner Vendor Registered!</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      The vendor has been onboarded into the Goa Operations network and is ready for automated assignment.
                    </p>
                    <button 
                      onClick={() => { setShowAddModal(false); setAddSuccess(false); }}
                      className="mt-2 px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-charcoal-700 mb-1">Company / Partner Name</label>
                      <input 
                        name="name" 
                        required 
                        placeholder="e.g. Mandovi Speedboats Co." 
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Category</label>
                        <select name="category" aria-label="Category" className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900 font-medium">
                          <option value="Transport">Transport</option>
                          <option value="Accommodation">Accommodation</option>
                          <option value="Experience">Experience</option>
                          <option value="Dining">Dining</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Service Type</label>
                        <input 
                          name="service" 
                          required 
                          placeholder="e.g. Private Catamaran" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Contact Lead</label>
                        <input 
                          name="contactPerson" 
                          required 
                          placeholder="e.g. Sanjay Raut" 
                          className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Phone</label>
                        <input 
                          name="phone" 
                          required 
                          placeholder="+91 98220 00000" 
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
                        Register Partner
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

export default OperatorVendors
