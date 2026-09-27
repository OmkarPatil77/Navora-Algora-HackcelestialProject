import React, { createContext, useContext, useState, useEffect } from 'react'
import { defaultTripPreferences, mockDestinations } from '@/data/mockData'
import { generateItinerary, regenerateDay, calculateItinerarySummary, calculateFlexibilityScore } from '@/services/itineraryEngine'
import { createSyntheticFlightDisruption, analyzeDisruption } from '@/services/disruptionEngine'
import { goaExperiences, getExperiencesByDestination, allExperiences } from '@/data/experiences'
import { initialVendors, initialAttentionItems, initialOperatorTours } from '@/data/operatorData'
import { calculateJourneyHealth } from '@/services/journeyHealthEngine'
import { createInitialJourneyMemory, recordMemoryEvent, MEMORY_STORAGE_KEY } from '@/services/journeyMemoryEngine'
import { 
  explainRecommendation, 
  explainDisruptionImpact, 
  explainRecoveryDecision, 
  explainProtectedNode, 
  explainVendorImpact 
} from '@/services/decisionExplanationEngine'

const STORAGE_KEY = 'navora_trip_preferences'
const SELECTED_EXP_KEY = 'navora_selected_experiences'
const ITINERARY_KEY = 'navora_itinerary'
const DISRUPTION_KEY = 'navora_active_disruption'
const RECOVERY_LOG_KEY = 'navora_event_log'
const OPERATOR_STATE_KEY = 'navora_operator_state'
const IS_BOOKED_KEY = 'navora_is_trip_booked'
const BOOKED_TRIP_KEY = 'navora_booked_trip'

const TripPlanningContext = createContext(null)

export const TripPlanningProvider = ({ children }) => {
  // Booking state: false by default for new explorations, persisted once confirmed
  const [isTripBooked, setIsTripBooked] = useState(() => {
    try {
      const saved = localStorage.getItem(IS_BOOKED_KEY)
      return saved === 'true'
    } catch {
      return false
    }
  })

  const [bookedTrip, setBookedTrip] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKED_TRIP_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [tripPreferences, setTripPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn("Could not load stored trip preferences", e)
    }
    return defaultTripPreferences
  })

  const [selectedExperiences, setSelectedExperiences] = useState(() => {
    try {
      const saved = localStorage.getItem(SELECTED_EXP_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn("Could not load selected experiences", e)
    }
    return [
      {
        experienceId: "goa-scuba-grand-island",
        quantity: 2,
        estimatedCost: 5600
      },
      {
        experienceId: "goa-fontainhas-heritage-walk",
        quantity: 2,
        estimatedCost: 3200
      },
      {
        experienceId: "goa-mandovi-sunset-cruise",
        quantity: 2,
        estimatedCost: 3600
      },
      {
        experienceId: "goa-cabo-de-rama-sunset",
        quantity: 2,
        estimatedCost: 2400
      }
    ]
  })

  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem(ITINERARY_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn("Could not load saved itinerary", e)
    }
    return generateItinerary(defaultTripPreferences, [
      { experienceId: "goa-scuba-grand-island", quantity: 2, estimatedCost: 5600 },
      { experienceId: "goa-fontainhas-heritage-walk", quantity: 2, estimatedCost: 3200 },
      { experienceId: "goa-mandovi-sunset-cruise", quantity: 2, estimatedCost: 3600 },
      { experienceId: "goa-cabo-de-rama-sunset", quantity: 2, estimatedCost: 2400 }
    ])
  })

  const [activeDisruption, setActiveDisruption] = useState(() => {
    try {
      const saved = localStorage.getItem(DISRUPTION_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Could not load stored disruption", e)
    }
    return null
  })

  const [disruptionAnalysis, setDisruptionAnalysis] = useState(null)
  const [recoveryPlans, setRecoveryPlans] = useState([])
  const [appliedRecovery, setAppliedRecovery] = useState(null)
  const [disruptionEventLog, setDisruptionEventLog] = useState(() => {
    try {
      const saved = localStorage.getItem(RECOVERY_LOG_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Could not load stored event log", e)
    }
    return [
      { time: "08:30", text: "Journey initialized: Mumbai → Goa scheduled.", type: "SYSTEM" },
      { time: "09:00", text: "Connected dependency graph generated with 8 nodes.", type: "GRAPH" }
    ]
  })

  // Re-run analysis whenever activeDisruption or itinerary changes
  useEffect(() => {
    if (activeDisruption && itinerary) {
      const analysis = analyzeDisruption(itinerary, activeDisruption)
      setDisruptionAnalysis(analysis)
      if (analysis) {
        const plans = generateRecoveryPlans(itinerary, analysis, tripPreferences, selectedExperiences)
        setRecoveryPlans(plans)
      }
    } else {
      setDisruptionAnalysis(null)
      setRecoveryPlans([])
    }
  }, [activeDisruption, itinerary])

  // Persist disruption and logs
  useEffect(() => {
    try {
      if (activeDisruption) {
        localStorage.setItem(DISRUPTION_KEY, JSON.stringify(activeDisruption))
      } else {
        localStorage.removeItem(DISRUPTION_KEY)
      }
    } catch (e) {
      console.warn("Could not persist disruption", e)
    }
  }, [activeDisruption])

  const [operatorVendors, setOperatorVendors] = useState(() => {
    try {
      const saved = localStorage.getItem(OPERATOR_STATE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.vendors) return parsed.vendors
      }
    } catch (e) {
      console.warn("Could not load stored operator vendors", e)
    }
    return initialVendors
  })

  const [operatorAttentionItems, setOperatorAttentionItems] = useState(() => {
    try {
      const saved = localStorage.getItem(OPERATOR_STATE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.attentionItems) return parsed.attentionItems
      }
    } catch (e) {
      console.warn("Could not load stored operator attention items", e)
    }
    return initialAttentionItems
  })

  const [operatorNotifications, setOperatorNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(OPERATOR_STATE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.notifications) return parsed.notifications
      }
    } catch (e) {
      console.warn("Could not load stored notifications", e)
    }
    return []
  })

  // Journey Memory State
  const [journeyMemory, setJourneyMemory] = useState(() => {
    try {
      const saved = localStorage.getItem(MEMORY_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Could not load stored journey memory", e)
    }
    return createInitialJourneyMemory(tripPreferences, selectedExperiences)
  })

  // Persist journey memory
  useEffect(() => {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(journeyMemory))
    } catch (e) {
      console.warn("Could not persist journey memory", e)
    }
  }, [journeyMemory])

  // Record journey decision helper
  const recordJourneyDecision = (eventType, eventData) => {
    setJourneyMemory(prev => recordMemoryEvent(prev, eventType, eventData))
  }

  // Dynamic Deterministic Journey Health Calculation
  const journeyHealth = React.useMemo(() => {
    return calculateJourneyHealth({
      itinerary,
      selectedExperiences,
      tripPreferences,
      disruptionAnalysis,
      recoveryPlans,
      appliedRecovery,
      operatorVendors
    })
  }, [itinerary, selectedExperiences, tripPreferences, disruptionAnalysis, recoveryPlans, appliedRecovery, operatorVendors])

  // Helper to calculate duration from start and end dates
  const calculateDuration = (startStr, endStr) => {
    if (!startStr || !endStr) {
      return { days: 4, nights: 3, formatted: "4 Days / 3 Nights" }
    }
    const start = new Date(startStr)
    const end = new Date(endStr)
    const diffTime = end - start
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)))
    const nights = Math.max(0, diffDays - 1)
    return {
      days: diffDays,
      nights,
      formatted: `${diffDays} Day${diffDays > 1 ? 's' : ''} / ${nights} Night${nights > 1 ? 's' : ''}`
    }
  }

  // Calculate allocation breakdown for a given budget
  const calculateBudgetAllocation = (total) => {
    const totalAmount = Number(total) || 35000
    return {
      accommodation: Math.round(totalAmount * 0.35),
      transport: Math.round(totalAmount * 0.25),
      activities: Math.round(totalAmount * 0.18),
      food: Math.round(totalAmount * 0.14),
      buffer: Math.round(totalAmount * 0.08)
    }
  }

  // Set destination
  const setDestination = (destinationData) => {
    let destObj = {}
    if (typeof destinationData === 'string') {
      const found = mockDestinations.find(d => 
        d.id.toLowerCase() === destinationData.toLowerCase() ||
        d.city.toLowerCase() === destinationData.toLowerCase() ||
        d.name.toLowerCase().includes(destinationData.toLowerCase())
      )
      if (found) {
        destObj = { ...found }
      } else {
        const cityName = destinationData.split(',')[0].trim()
        destObj = {
          id: destinationData.toLowerCase().replace(/\s+/g, '-'),
          name: destinationData,
          city: cityName,
          country: 'India',
          region: 'India'
        }
      }
    } else if (destinationData && typeof destinationData === 'object') {
      const match = mockDestinations.find(d => 
        d.id === destinationData.id || 
        (destinationData.city && d.city.toLowerCase() === destinationData.city.toLowerCase()) ||
        (destinationData.name && d.name.toLowerCase() === destinationData.name.toLowerCase())
      )
      destObj = { ...(match || {}), ...destinationData }
    }

    const destQuery = destObj.city || destObj.name || "Goa"
    const newDestExperiences = getExperiencesByDestination(destQuery)
    const adultCount = Math.max(1, tripPreferences.travelers?.adults || 2)

    // Select top experiences matching the new destination
    const newSelected = newDestExperiences.slice(0, 4).map(exp => ({
      experienceId: exp.id,
      quantity: adultCount,
      estimatedCost: exp.pricePerPerson * adultCount
    }))
    setSelectedExperiences(newSelected)
    try {
      localStorage.setItem(SELECTED_EXP_KEY, JSON.stringify(newSelected))
    } catch (e) {
      console.warn("Could not save new selected experiences", e)
    }

    const updatedPrefs = {
      ...tripPreferences,
      destination: destObj
    }

    // Re-generate fresh dynamic itinerary for the destination
    const newItin = generateItinerary(updatedPrefs, newSelected)
    setItinerary(newItin)
    setTripPreferences(updatedPrefs)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs))
    } catch (e) {
      console.warn("Could not save trip preferences", e)
    }
  }

  // Set dates
  const setDates = (startDate, endDate) => {
    const duration = calculateDuration(startDate, endDate)
    setTripPreferences(prev => {
      const updated = {
        ...prev,
        startDate,
        endDate,
        duration
      }
      const newItin = generateItinerary(updated, selectedExperiences)
      setItinerary(newItin)
      return updated
    })
  }

  // Set travelers
  const setTravelers = ({ adults = 2, children = 0, infants = 0 }) => {
    const total = adults + children + infants
    let composition = `${adults} Adult${adults > 1 ? 's' : ''}`
    if (children > 0) composition += `, ${children} Child${children > 1 ? 'ren' : ''}`
    if (infants > 0) composition += `, ${infants} Infant${infants > 1 ? 's' : ''}`

    setTripPreferences(prev => {
      const updated = {
        ...prev,
        travelers: {
          adults,
          children,
          infants,
          total,
          composition
        }
      }
      const newItin = generateItinerary(updated, selectedExperiences)
      setItinerary(newItin)
      return updated
    })
  }

  // Toggle or set interests
  const setInterests = (interestsList) => {
    setTripPreferences(prev => ({
      ...prev,
      interests: interestsList
    }))
  }

  // Set travel style
  const setTravelStyle = (styleData) => {
    setTripPreferences(prev => {
      const updated = {
        ...prev,
        travelStyle: {
          ...prev.travelStyle,
          ...styleData
        }
      }
      const newItin = generateItinerary(updated, selectedExperiences)
      setItinerary(newItin)
      return updated
    })
  }

  // Set budget
  const setBudget = (total) => {
    const totalNum = Number(total)
    const breakdown = calculateBudgetAllocation(totalNum)
    setTripPreferences(prev => {
      const updated = {
        ...prev,
        budget: {
          total: totalNum,
          currency: "INR",
          breakdown
        }
      }
      const newItin = generateItinerary(updated, selectedExperiences)
      setItinerary(newItin)
      return updated
    })
  }

  // Experience Selection Management
  const addExperience = (experience) => {
    const adultCount = Math.max(1, tripPreferences.travelers?.adults || 2)
    const cost = (experience.pricePerPerson || 1500) * adultCount

    setSelectedExperiences(prev => {
      if (prev.some(item => item.experienceId === experience.id)) {
        return prev
      }
      const updated = [
        ...prev,
        {
          experienceId: experience.id,
          quantity: adultCount,
          estimatedCost: cost,
          title: experience.title,
          category: experience.category
        }
      ]
      // Sync fresh itinerary
      const newItin = generateItinerary(tripPreferences, updated)
      setItinerary(newItin)
      return updated
    })
  }

  const removeExperience = (experienceId) => {
    setSelectedExperiences(prev => {
      const updated = prev.filter(item => item.experienceId !== experienceId)
      const newItin = generateItinerary(tripPreferences, updated)
      setItinerary(newItin)
      return updated
    })
  }

  const toggleExperience = (experience) => {
    if (selectedExperiences.some(item => item.experienceId === experience.id)) {
      removeExperience(experience.id)
    } else {
      addExperience(experience)
    }
  }

  const isExperienceSelected = (experienceId) => {
    return selectedExperiences.some(item => item.experienceId === experienceId)
  }

  const replaceExperience = (oldId, newExperience) => {
    const adultCount = Math.max(1, tripPreferences.travelers?.adults || 2)
    const cost = (newExperience.pricePerPerson || 1500) * adultCount

    setSelectedExperiences(prev => {
      const filtered = prev.filter(item => item.experienceId !== oldId)
      const updated = [
        ...filtered,
        {
          experienceId: newExperience.id,
          quantity: adultCount,
          estimatedCost: cost,
          title: newExperience.title,
          category: newExperience.category
        }
      ]
      const newItin = generateItinerary(tripPreferences, updated)
      setItinerary(newItin)
      return updated
    })
  }

  const clearSelectedExperiences = () => {
    setSelectedExperiences([])
    const newItin = generateItinerary(tripPreferences, [])
    setItinerary(newItin)
  }

  // Regenerate Entire Itinerary
  const regenerateFullItinerary = () => {
    const fresh = generateItinerary(tripPreferences, selectedExperiences)
    setItinerary(fresh)
  }

  // Regenerate Single Day
  const regenerateSingleDay = (dayNumber) => {
    if (!itinerary) return
    const updated = regenerateDay(itinerary, dayNumber, tripPreferences, selectedExperiences)
    setItinerary(updated)
  }

  // Update Item Time Slot in Itinerary
  const updateItineraryItemTime = (dayNumber, itemId, newStartTime, newEndTime) => {
    if (!itinerary) return
    const updatedDays = itinerary.days.map(d => {
      if (d.day === dayNumber) {
        const updatedItems = d.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              startTime: newStartTime,
              endTime: newEndTime,
              status: "Modified"
            }
          }
          return item
        })
        return { ...d, items: updatedItems }
      }
      return d
    })

    const summary = calculateItinerarySummary(updatedDays, tripPreferences.budget?.total || 35000)
    const flexibility = calculateFlexibilityScore(updatedDays)
    setItinerary({
      ...itinerary,
      days: updatedDays,
      summary,
      flexibility
    })
  }

  // Remove Item from Itinerary
  const removeItineraryItem = (dayNumber, itemId) => {
    if (!itinerary) return
    const updatedDays = itinerary.days.map(d => {
      if (d.day === dayNumber) {
        return {
          ...d,
          items: d.items.filter(item => item.id !== itemId)
        }
      }
      return d
    })

    const summary = calculateItinerarySummary(updatedDays, tripPreferences.budget?.total || 35000)
    const flexibility = calculateFlexibilityScore(updatedDays)
    setItinerary({
      ...itinerary,
      days: updatedDays,
      summary,
      flexibility
    })
  }

  // Trigger synthetic disruption simulation
  const triggerDisruption = (delayMinutes = 90) => {
    const disruption = createSyntheticFlightDisruption(delayMinutes, itinerary)
    setActiveDisruption(disruption)
    setAppliedRecovery(null)

    const analysis = analyzeDisruption(itinerary, disruption)
    setDisruptionAnalysis(analysis)

    const plans = generateRecoveryPlans(itinerary, analysis, tripPreferences, selectedExperiences)
    setRecoveryPlans(plans)

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text: `Flight delay simulation activated (+${delayMinutes} min). Inbound BOM → GOI shifted to ${disruption.newStartTime}.`, type: "DISRUPTION" },
      { time: now, text: `Dependency graph analyzed: ${analysis.counts.conflicts} conflict, ${analysis.counts.impacted} impacted nodes identified.`, type: "ANALYSIS" },
      { time: now, text: `3 intelligent recovery strategies generated (${plans.map(p => p.badge).join(', ')}).`, type: "RECOVERY" },
      ...prev
    ])

    return { disruption, analysis, plans }
  }

  // Apply a selected recovery plan
  const applyDisruptionRecovery = (planId) => {
    const plan = recoveryPlans.find(p => p.id === planId) || recoveryPlans[0]
    if (!plan) return false

    // 1. Update itinerary
    const adaptedItinerary = applyRecoveryPlanToItinerary(itinerary, plan)
    const summary = calculateItinerarySummary(adaptedItinerary.days, tripPreferences.budget?.total || 35000)
    const flexibility = calculateFlexibilityScore(adaptedItinerary.days)
    
    // 2. If Plan B replaced Scuba with Fontainhas, update selected experiences
    if (plan.id === 'PLAN-B-BALANCED') {
      const hasFontainhas = selectedExperiences.some(e => e.experienceId === 'goa-fontainhas-heritage-walk')
      if (!hasFontainhas) {
        const fontainhasExp = goaExperiences.find(e => e.id === 'goa-fontainhas-heritage-walk')
        if (fontainhasExp) {
          const adultCount = Math.max(1, tripPreferences.travelers?.adults || 2)
          const updatedExp = [
            ...selectedExperiences.filter(e => e.experienceId !== 'goa-scuba-grand-island'),
            {
              experienceId: fontainhasExp.id,
              quantity: adultCount,
              estimatedCost: fontainhasExp.pricePerPerson * adultCount,
              title: fontainhasExp.title,
              category: fontainhasExp.category
            }
          ]
          setSelectedExperiences(updatedExp)
        }
      }
    } else if (plan.id === 'PLAN-C-RELAXED') {
      setSelectedExperiences(prev => prev.filter(e => e.experienceId !== 'goa-scuba-grand-island'))
    }

    setItinerary({
      ...adaptedItinerary,
      summary,
      flexibility
    })

    setAppliedRecovery(plan)

    // Sync operator vendor states
    setOperatorVendors(prev => prev.map(v => {
      if (v.id === 'VEN-001') {
        return { ...v, status: 'updated', updatedTime: '12:15', note: 'Transit slot moved to 12:15. Awaiting driver check-in.' }
      }
      if (v.id === 'VEN-003') {
        return { ...v, status: 'replaced', note: 'Scuba dive cancelled without penalty. Replaced with Fontainhas Walk.' }
      }
      if (v.id === 'VEN-004') {
        return { ...v, status: 'confirmed', note: 'Fontainhas Cultural Walk confirmed for 16:00.' }
      }
      return v
    }))

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text: `Recovery strategy "${plan.title}" applied. Itinerary adapted seamlessly.`, type: "APPLIED" },
      { time: now, text: `Vendor schedules updated: Goa Transfers (12:15), Fontainhas Walk (16:00).`, type: "VENDOR" },
      { time: now, text: `Recalculated metrics: ${plan.costImpact}, ${plan.flexibilityImpact}.`, type: "METRICS" },
      ...prev
    ])

    return true
  }

  // Operator action: Confirm a vendor slot
  const confirmOperatorVendor = (vendorId, note = "Vendor confirmed by operations team.") => {
    setOperatorVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, status: 'confirmed', note: note || v.note }
      }
      return v
    }))

    setOperatorAttentionItems(prev => prev.map(item => {
      if (item.vendorId === vendorId) {
        return { ...item, status: 'resolved' }
      }
      return item
    }))

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const vendorObj = operatorVendors.find(v => v.id === vendorId)
    setDisruptionEventLog(prev => [
      { time: now, text: `Vendor "${vendorObj?.name || vendorId}" confirmed by Operations Dispatch.`, type: "VENDOR" },
      ...prev
    ])
  }

  // Operator action: Resolve an attention item
  const resolveOperatorAttentionItem = (itemId) => {
    setOperatorAttentionItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'resolved' }
      }
      return item
    }))

    const item = operatorAttentionItems.find(i => i.id === itemId)
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text: `Action item resolved: ${item?.title || itemId}.`, type: "SYSTEM" },
      ...prev
    ])
  }

  // Operator action: Send simulated traveler journey update
  const sendOperatorTravelerNotification = (tourId = "GOA-2048", messageText) => {
    const defaultMsg = "Hi! Your inbound flight to Goa has been delayed by 90 minutes. Navora has automatically adjusted your itinerary to minimize disruption while preserving your key experiences. Your updated itinerary is ready."
    const newNotification = {
      id: `NOTIF-${Date.now()}`,
      tourId,
      title: "Journey Disruption & Recovery Update",
      message: messageText || defaultMsg,
      sentAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      channel: "WhatsApp & In-App Push"
    }

    setOperatorNotifications(prev => [newNotification, ...prev])

    // Resolve attention item ATTN-003
    setOperatorAttentionItems(prev => prev.map(item => {
      if (item.id === 'ATTN-003' || item.type === 'TRAVELER_NOTIFICATION') {
        return { ...item, status: 'resolved' }
      }
      return item
    }))

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text: `Simulated traveler notification dispatched to Tour ${tourId} via WhatsApp & Push.`, type: "NOTIFICATION" },
      ...prev
    ])

    return newNotification
  }

  // Operator action: Append custom event
  const addOperatorEvent = (text, type = "SYSTEM") => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text, type },
      ...prev
    ])
  }

  // Reset disruption simulation and restore baseline itinerary
  const resetDisruptionSimulation = () => {
    setActiveDisruption(null)
    setDisruptionAnalysis(null)
    setRecoveryPlans([])
    setAppliedRecovery(null)
    setOperatorVendors(initialVendors)
    setOperatorAttentionItems(initialAttentionItems)
    setOperatorNotifications([])

    const defaultExp = [
      { experienceId: "goa-scuba-grand-island", quantity: 2, estimatedCost: 5600 },
      { experienceId: "goa-fontainhas-heritage-walk", quantity: 2, estimatedCost: 3200 },
      { experienceId: "goa-mandovi-sunset-cruise", quantity: 2, estimatedCost: 3600 },
      { experienceId: "goa-cabo-de-rama-sunset", quantity: 2, estimatedCost: 2400 }
    ]
    setSelectedExperiences(defaultExp)
    const freshItin = generateItinerary(tripPreferences, defaultExp)
    setItinerary(freshItin)

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setDisruptionEventLog(prev => [
      { time: now, text: "Simulation reset. Original baseline itinerary and bookings restored.", type: "RESET" },
      ...prev
    ])

    try {
      localStorage.removeItem(DISRUPTION_KEY)
      localStorage.removeItem(OPERATOR_STATE_KEY)
    } catch (e) {
      console.warn("Could not remove disruption/operator key", e)
    }
  }

  // Helper to query impact classification for any node
  const getDisruptionImpactForNode = (nodeId) => {
    if (!disruptionAnalysis || appliedRecovery) return null
    const conflict = disruptionAnalysis.conflictNodes?.find(n => n.nodeId === nodeId)
    if (conflict) return { ...conflict, status: 'CONFLICT' }
    const impacted = disruptionAnalysis.impactedNodes?.find(n => n.nodeId === nodeId)
    if (impacted) return { ...impacted, status: 'IMPACTED' }
    const isProtected = disruptionAnalysis.protectedNodes?.some(n => n.nodeId === nodeId)
    if (isProtected) return { status: 'PROTECTED', rationale: 'No schedule conflict detected.' }
    const isFlexible = disruptionAnalysis.flexibleNodes?.some(n => n.nodeId === nodeId)
    if (isFlexible) return { status: 'FLEXIBLE', rationale: 'Can absorb schedule variance.' }
    return null
  }

  // Reset to default demo
  const resetPreferences = () => {
    setTripPreferences(defaultTripPreferences)
    resetDisruptionSimulation()
    cancelBooking()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTripPreferences))
    } catch (e) {
      console.warn("Could not reset localStorage", e)
    }
  }

  // Trip Booking helpers
  const bookTrip = (customTrip = null) => {
    const bookingDetails = customTrip || {
      id: `TS-${Date.now().toString().slice(-4)}`,
      destination: tripPreferences.destination,
      dates: { startDate: tripPreferences.startDate, endDate: tripPreferences.endDate },
      duration: tripPreferences.duration,
      travelers: tripPreferences.travelers,
      budget: tripPreferences.budget,
      selectedExperiences,
      bookedAt: new Date().toISOString()
    }
    setIsTripBooked(true)
    setBookedTrip(bookingDetails)
    try {
      localStorage.setItem(IS_BOOKED_KEY, 'true')
      localStorage.setItem(BOOKED_TRIP_KEY, JSON.stringify(bookingDetails))
    } catch (e) {
      console.warn("Could not save booking to localStorage", e)
    }
    return bookingDetails
  }

  const cancelBooking = () => {
    setIsTripBooked(false)
    setBookedTrip(null)
    try {
      localStorage.removeItem(IS_BOOKED_KEY)
      localStorage.removeItem(BOOKED_TRIP_KEY)
    } catch (e) {
      console.warn("Could not remove booking from localStorage", e)
    }
  }

  // Derived budget impact metrics
  const totalPlannedActivitiesCost = selectedExperiences.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0)
  const remainingBudget = Math.max(0, (tripPreferences.budget?.total || 35000) - totalPlannedActivitiesCost)

  const value = {
    isTripBooked,
    setIsTripBooked,
    bookedTrip,
    bookTrip,
    cancelBooking,
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    disruptionEventLog,
    totalPlannedActivitiesCost,
    remainingBudget,
    setTripPreferences,
    setDestination,
    setDates,
    setTravelers,
    setInterests,
    setTravelStyle,
    setBudget,
    setItinerary,
    addExperience,
    removeExperience,
    toggleExperience,
    isExperienceSelected,
    replaceExperience,
    clearSelectedExperiences,
    regenerateFullItinerary,
    regenerateSingleDay,
    updateItineraryItemTime,
    removeItineraryItem,
    resetPreferences,
    triggerDisruption,
    applyDisruptionRecovery,
    resetDisruptionSimulation,
    getDisruptionImpactForNode,
    operatorVendors,
    operatorAttentionItems,
    operatorNotifications,
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    addOperatorEvent,
    journeyHealth,
    journeyMemory,
    recordJourneyDecision,
    explainRecommendation,
    explainDisruptionImpact,
    explainRecoveryDecision,
    explainProtectedNode,
    explainVendorImpact,
    calculateDuration,
    calculateBudgetAllocation
  }

  return (
    <TripPlanningContext.Provider value={value}>
      {children}
    </TripPlanningContext.Provider>
  )
}

export const useTripPlan = () => {
  const context = useContext(TripPlanningContext)
  if (!context) {
    throw new Error('useTripPlan must be used within a TripPlanningProvider')
  }
  return context
}
