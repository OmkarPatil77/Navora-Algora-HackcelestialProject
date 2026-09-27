import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, Lock, ShieldCheck, CheckCircle2, ArrowLeft, 
  Calendar, MapPin, Users, Wallet, Download, Sparkles, Percent, 
  Check, Building, Phone, Mail, User, AlertCircle, ExternalLink 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/lib/utils'
import PageTransition from '@/components/motion/PageTransition'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent } from '@/components/ui/Dialog'

export const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { 
    tripPreferences, 
    selectedExperiences, 
    totalPlannedActivitiesCost, 
    bookTrip 
  } = useTripPlan()

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Anish Sharma',
    email: user?.email || 'anish.sharma@example.com',
    phone: '+91 98765 43210',
    specialRequests: 'Prefer high-floor quiet villa room and vegetarian thali options.'
  })

  // Stripe Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'apple_pay' | 'google_pay'
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: user?.name || 'Anish Sharma',
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvc: '888',
    zipCode: '400053'
  })

  // Promo Code State
  const [promoCode, setPromoCode] = useState('HACKCELESTIAL')
  const [discountAmount, setDiscountAmount] = useState(1500)
  const [promoApplied, setPromoApplied] = useState(true)

  // Payment Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccessData, setPaymentSuccessData] = useState(null)

  // Derived Pricing Breakdown
  const destName = tripPreferences?.destination?.name || 'Goa, India'
  const city = tripPreferences?.destination?.city || 'Goa'
  const durationDays = tripPreferences?.duration?.days || 4
  const travelersCount = tripPreferences?.travelers?.total || 2
  const baseBudget = tripPreferences?.budget?.total || 35000

  const accommodationCost = Math.round(baseBudget * 0.35)
  const transitCost = Math.round(baseBudget * 0.20)
  const activitiesCost = totalPlannedActivitiesCost > 0 ? totalPlannedActivitiesCost : Math.round(baseBudget * 0.25)
  const taxesFee = Math.round((accommodationCost + transitCost + activitiesCost) * 0.05)

  const subtotal = accommodationCost + transitCost + activitiesCost + taxesFee
  const grandTotal = Math.max(0, subtotal - (promoApplied ? discountAmount : 0))

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HACKCELESTIAL' || promoCode.trim().toUpperCase() === 'STRIPE10') {
      setDiscountAmount(1500)
      setPromoApplied(true)
    } else {
      alert('Invalid promo code. Use HACKCELESTIAL for ₹1,500 discount.')
    }
  }

  const handleStripePaymentSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      const confirmationId = `TS-STRIPE-${Math.floor(100000 + Math.random() * 900000)}`
      const bookedDetails = bookTrip({
        id: confirmationId,
        destination: tripPreferences.destination,
        dates: { startDate: tripPreferences.startDate, endDate: tripPreferences.endDate },
        duration: tripPreferences.duration,
        travelers: tripPreferences.travelers,
        budget: tripPreferences.budget,
        selectedExperiences,
        paidAmount: grandTotal,
        paymentMethod: 'Stripe Credit Card (256-bit SSL)',
        bookedAt: new Date().toISOString()
      })

      setPaymentSuccessData({
        confirmationId,
        paidAmount: grandTotal,
        destName,
        travelersCount,
        dates: `${tripPreferences.startDate} to ${tripPreferences.endDate}`
      })
    }, 1800)
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-200 pb-6">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => navigate('/itinerary')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-coral-600 transition-colors group mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back to Itinerary</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
                <span>Finalize Booking & Secure Payment</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5E6282]">
                Review your customized trip details and complete payment via Stripe's encrypted gateway.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Stripe 256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Contact Form & Stripe Payment Input (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Traveler Information */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-sand-100 pb-3">
                  <User className="w-4 h-4 text-coral-500" />
                  <h3 className="text-base font-serif font-bold text-navy-900">1. Primary Traveler Contact</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-navy-900 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-sand-50/30 text-xs font-medium text-navy-900 focus:outline-none focus:border-coral-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-navy-900 block">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-sand-50/30 text-xs font-medium text-navy-900 focus:outline-none focus:border-coral-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-navy-900 block">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-sand-50/30 text-xs font-medium text-navy-900 focus:outline-none focus:border-coral-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-navy-900 block">Special Logistics / Dietary Requests</label>
                    <input
                      type="text"
                      value={formData.specialRequests}
                      onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-sand-50/30 text-xs font-medium text-navy-900 focus:outline-none focus:border-coral-500"
                      placeholder="e.g. Vegetarian thali, Airport express pickup..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. Stripe Payment Gateway Container */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-navy-900/10 shadow-soft-sm space-y-6 relative">
                
                {/* Stripe Branding Header */}
                <div className="flex items-center justify-between border-b border-sand-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      S
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-navy-900">2. Stripe Payment Gateway</h3>
                      <p className="text-[11px] text-[#5E6282]">Official 256-bit encrypted checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-sand-100 text-[10px] font-bold text-navy-900">VISA</span>
                    <span className="px-2 py-1 rounded bg-sand-100 text-[10px] font-bold text-navy-900">MC</span>
                    <span className="px-2 py-1 rounded bg-sand-100 text-[10px] font-bold text-navy-900">AMEX</span>
                  </div>
                </div>

                {/* Express Payment Options Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                        : 'bg-sand-50 border-sand-200 text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-sand-50 border-sand-200 text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    <span> Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'google_pay'
                        ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                        : 'bg-sand-50 border-sand-200 text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    <span>G Pay</span>
                  </button>
                </div>

                {/* Stripe Card Input Form */}
                <form onSubmit={handleStripePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.nameOnCard}
                        onChange={e => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs font-semibold text-navy-900 focus:outline-none focus:border-indigo-600"
                        placeholder="Name on card"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block flex items-center justify-between">
                        <span>Card Number</span>
                        <span className="text-[10px] text-emerald-700 font-bold">Stripe Test Card Ready</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={e => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 font-mono text-xs font-bold text-navy-900 focus:outline-none focus:border-indigo-600"
                          placeholder="4242 4242 4242 4242"
                          required
                        />
                        <CreditCard className="w-4 h-4 text-sand-500 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-navy-900 block">Expires</label>
                        <input
                          type="text"
                          value={cardDetails.expDate}
                          onChange={e => setCardDetails({ ...cardDetails, expDate: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-sand-300 font-mono text-xs text-center font-bold text-navy-900 focus:outline-none focus:border-indigo-600"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-navy-900 block">CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvc}
                          onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-sand-300 font-mono text-xs text-center font-bold text-navy-900 focus:outline-none focus:border-indigo-600"
                          placeholder="123"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-navy-900 block">ZIP Code</label>
                        <input
                          type="text"
                          value={cardDetails.zipCode}
                          onChange={e => setCardDetails({ ...cardDetails, zipCode: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-sand-300 font-mono text-xs text-center font-bold text-navy-900 focus:outline-none focus:border-indigo-600"
                          placeholder="400053"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-navy-900 block mb-1.5">Promo / Coupon Code</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Percent className="w-3.5 h-3.5 text-sand-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          placeholder="e.g. HACKCELESTIAL"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 text-xs font-mono font-bold uppercase text-navy-900"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleApplyPromo}
                        className="text-xs font-bold"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Promo "HACKCELESTIAL" applied: ₹1,500 discount
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-navy-900 hover:from-indigo-700 hover:to-navy-950 text-white font-bold py-3.5 text-sm rounded-xl shadow-warm-coral flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing via Stripe...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-emerald-300" />
                          <span>Pay {formatCurrency(grandTotal)} via Stripe</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-[#5E6282] pt-1">
                    🔒 Protected by Stripe. By clicking Pay, you agree to the booking cancellation & terms policy.
                  </p>
                </form>

              </div>
            </div>

            {/* RIGHT COLUMN: Trip & Price Breakdown Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft-xs space-y-5 sticky top-20">
                
                {/* Destination Preview Badge */}
                <div className="relative h-36 rounded-2xl overflow-hidden bg-navy-900">
                  <img
                    src={tripPreferences?.destination?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                    alt={destName}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {durationDays} Days / {Math.max(1, durationDays - 1)} Nights
                    </span>
                    <h3 className="text-xl font-serif font-bold mt-1">{destName}</h3>
                  </div>
                </div>

                {/* Trip Specs */}
                <div className="space-y-2 text-xs border-b border-sand-100 pb-4">
                  <div className="flex items-center justify-between text-[#5E6282]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-coral-500" /> Dates</span>
                    <span className="font-bold text-navy-900">{tripPreferences.startDate} – {tripPreferences.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5E6282]">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-coral-500" /> Travelers</span>
                    <span className="font-bold text-navy-900">{travelersCount} Adult{travelersCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5E6282]">
                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-coral-500" /> Stay Base</span>
                    <span className="font-bold text-navy-900">Boutique Villa & Resort</span>
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-serif font-bold text-navy-900 text-sm">Price Breakdown</h4>

                  <div className="flex items-center justify-between text-charcoal-700">
                    <span>Villa Accommodation</span>
                    <span className="font-medium">{formatCurrency(accommodationCost)}</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-700">
                    <span>Private Transit & Chauffeur</span>
                    <span className="font-medium">{formatCurrency(transitCost)}</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-700">
                    <span>Staged Experiences ({selectedExperiences.length} items)</span>
                    <span className="font-medium">{formatCurrency(activitiesCost)}</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-700">
                    <span>Taxes & Service Fee (5%)</span>
                    <span className="font-medium">{formatCurrency(taxesFee)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex items-center justify-between text-emerald-700 font-bold pt-1">
                      <span>Promo Discount (HACKCELESTIAL)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-navy-900 font-bold text-base">
                    <span>Total Amount</span>
                    <span className="text-coral-600">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Included Perks List */}
                <div className="p-3.5 rounded-2xl bg-sand-100/70 space-y-2 text-[11px] text-charcoal-700">
                  <div className="flex items-center gap-1.5 font-bold text-navy-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Included Navora Guarantee:</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-charcoal-600">
                    <li>Free cancellation up to 48h prior to arrival</li>
                    <li>Live AI disruption monitoring & auto-recovery</li>
                    <li>24/7 Dispatch Concierge WhatsApp support</li>
                  </ul>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* STRIPE PAYMENT SUCCESS RECEIPT MODAL */}
      <Dialog open={Boolean(paymentSuccessData)} onOpenChange={() => {}}>
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              Payment Successful via Stripe
            </span>
            <h3 className="text-2xl font-serif font-bold text-navy-900">Booking Confirmed!</h3>
            <p className="text-xs text-[#5E6282]">
              Your journey to <span className="font-bold text-navy-900">{paymentSuccessData?.destName}</span> has been confirmed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-600">
              <span>Stripe Order ID:</span>
              <span className="font-mono font-bold text-navy-900">{paymentSuccessData?.confirmationId}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Amount Paid:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(paymentSuccessData?.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Travelers:</span>
              <span className="font-bold text-navy-900">{paymentSuccessData?.travelersCount} Adult(s)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => {
                setPaymentSuccessData(null)
                navigate('/itinerary')
              }}
              className="w-full bg-navy-900 hover:bg-navy-950 text-white font-bold py-3 rounded-xl shadow-xs"
            >
              View Active Booked Itinerary
            </Button>
            <Button
              variant="outline"
              onClick={() => alert('Downloading E-Ticket PDF receipt...')}
              className="w-full border-sand-300 text-navy-900 font-semibold py-2.5 rounded-xl text-xs"
              leftIcon={<Download className="w-3.5 h-3.5 text-coral-500" />}
            >
              Download E-Ticket & Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

export default Checkout
