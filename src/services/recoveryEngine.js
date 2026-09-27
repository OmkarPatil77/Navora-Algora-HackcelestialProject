import { goaExperiences, getExperiencesByDestination, allExperiences } from '../data/experiences.js'
import { minutesToTime, timeToMinutes, shiftTime } from './disruptionEngine.js'

/**
 * Validates whether a proposed recovery plan meets all integrity constraints
 */
export function validateRecoveryPlan(plan, itinerary) {
  if (!plan || !plan.id || !plan.modifiedItems) {
    return { valid: false, errors: ['Plan data structure is invalid'] }
  }

  const errors = []

  // 1. Check for time overlaps among modified/preserved items
  const sortedItems = [...plan.modifiedItems].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  for (let i = 0; i < sortedItems.length - 1; i++) {
    const current = sortedItems[i]
    const next = sortedItems[i + 1]
    const currentEnd = timeToMinutes(current.endTime)
    const nextStart = timeToMinutes(next.startTime)

    if (currentEnd > nextStart) {
      errors.push(`Overlap detected between "${current.title}" (ends ${current.endTime}) and "${next.title}" (starts ${next.startTime})`)
    }
  }

  // 2. Ensure protected fixed nodes remain present
  if (itinerary?.days?.[0]) {
    const originalDay1 = itinerary.days[0]
    const flightPresent = plan.modifiedItems.some(i => i.type === 'flight')
    if (!flightPresent) {
      errors.push('Inbound flight transit node is missing')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generates 3 intelligent recovery options based on impact analysis and preferences
 */
export function generateRecoveryPlans(itinerary, impactAnalysis, tripPreferences = {}, selectedExperiences = []) {
  if (!itinerary || !impactAnalysis) return []

  const day1 = itinerary.days?.find(d => d.day === 1) || itinerary.days?.[0]
  if (!day1) return []

  const delayMins = impactAnalysis.disruption?.delayMinutes || 90
  const conflictNode = impactAnalysis.conflictNodes?.[0] || impactAnalysis.impactedNodes?.find(i => i.type === 'experience')
  const originalItems = day1.items || []

  const destName = tripPreferences?.destination?.city || tripPreferences?.destination?.name || itinerary?.destination || "Goa"
  const destExperiences = getExperiencesByDestination(destName)
  const origFlight = originalItems.find(i => i.type === 'flight') || {
    title: `Inbound Flight to ${destName}`,
    location: `${destName} Airport`
  }
  const origTransfer = originalItems.find(i => i.type === 'transport') || {
    title: `Airport Transfer`,
    location: `${destName}`
  }
  const origHotel = originalItems.find(i => i.type === 'hotel') || {
    title: `Boutique Villa Check-in`,
    location: `${destName}`
  }
  const meals = originalItems.filter(i => i.type === 'meal')
  const origLunch = meals[0] || { title: "Welcome Regional Lunch", location: `${destName} Bistro` }
  const origDinner = meals[1] || { title: "Scenic Evening Dinner", location: `${destName} Waterfront` }

  const origExperiences = originalItems.filter(i => i.type === 'experience')
  const mainExp = origExperiences[0] || destExperiences[0]
  const secondExp = origExperiences[1] || destExperiences[1] || mainExp

  // Find candidate replacement experience (e.g., cultural/walking tour)
  const replacementExp = destExperiences.find(e => 
    e.id !== mainExp?.experienceId && e.id !== mainExp?.id && 
    (e.intensity === 'low' || e.pace === 'moderate')
  ) || destExperiences[1] || destExperiences[0]

  const adultCount = Math.max(1, tripPreferences.travelers?.adults || 2)
  const origExpCost = mainExp.cost ? Math.round(mainExp.cost / adultCount) : (mainExp.pricePerPerson || 2800)
  const replacementCost = replacementExp.pricePerPerson || 1600
  const costDiff = Math.max(0, origExpCost - replacementCost)

  // --------------------------------------------------------------------------
  // PLAN A — PRESERVE: Preserve Your Experiences (Compact schedule, shift windows)
  // --------------------------------------------------------------------------
  const planA_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: origFlight.title,
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: origFlight.location
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: `${origTransfer.title} (Expedited)`,
      startTime: "12:15",
      endTime: "13:00",
      durationMinutes: 45,
      location: origTransfer.location
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: `Express Check-in @ ${origHotel.title.replace('Check-in at ', '').replace('Check-in @ ', '')}`,
      startTime: "13:00",
      endTime: "13:30",
      durationMinutes: 30,
      location: origHotel.location
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: `Express ${origLunch.title}`,
      startTime: "13:30",
      endTime: "14:15",
      durationMinutes: 45,
      location: origLunch.location
    },
    {
      id: "item-d1-exp-1",
      type: "experience",
      experienceId: mainExp.experienceId || mainExp.id,
      title: `${mainExp.title} (Express Slot)`,
      startTime: "14:30",
      endTime: "18:00",
      durationMinutes: 210,
      cost: origExpCost * adultCount,
      pricePerPerson: origExpCost,
      intensity: mainExp.intensity || "high",
      location: mainExp.location
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: secondExp.experienceId || secondExp.id,
      title: secondExp.title,
      startTime: "18:30",
      endTime: "20:00",
      durationMinutes: 90,
      cost: (secondExp.pricePerPerson || 1800) * adultCount,
      pricePerPerson: secondExp.pricePerPerson || 1800,
      location: secondExp.location
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: origDinner.title,
      startTime: "20:15",
      endTime: "22:15",
      durationMinutes: 120,
      location: origDinner.location
    }
  ]

  const planA = {
    id: "PLAN-A-PRESERVE",
    strategy: "PRESERVE",
    badge: "Maximum Activities",
    title: "Preserve All Experiences",
    subtitle: `Compress buffer windows to keep the original ${mainExp.title}.`,
    description: `Shifts your transfers and converts welcome lunch into an express meal so you can still attend ${mainExp.title} without missing evening plans.`,
    experiencesPreserved: `${origExperiences.length || 2} of ${origExperiences.length || 2}`,
    flexibilityImpact: "42 min remaining",
    flexibilityDelta: -30,
    costImpact: "₹0 extra cost",
    costDelta: 0,
    intensity: "High Pace",
    tags: ["No Lost Bookings", "Express Transitions", "Full Itinerary"],
    modifiedItems: planA_items,
    changes: [
      { type: "SHIFT", text: `Inbound flight shifted +${delayMins}m to ${impactAnalysis.disruption.newStartTime} arrival.` },
      { type: "SHIFT", text: "Airport transfer & check-in delayed to 12:15 → 13:30." },
      { type: "COMPRESS", text: "Lunch shortened to 45m express meal." },
      { type: "PRESERVED", text: `${mainExp.title} rescheduled to compact 14:30 – 18:00 window.` },
      { type: "PROTECTED", text: "Dinner reservation shifted to 20:15." }
    ],
    recommended: false
  }

  // --------------------------------------------------------------------------
  // PLAN B — BALANCED (RECOMMENDED): Rebalance the Day with Cultural Replacement
  // --------------------------------------------------------------------------
  const planB_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: origFlight.title,
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: origFlight.location
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: origTransfer.title,
      startTime: "12:15",
      endTime: "13:10",
      durationMinutes: 55,
      location: origTransfer.location
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: `Check-in & Unpacking @ ${origHotel.title.replace('Check-in at ', '').replace('Check-in @ ', '')}`,
      startTime: "13:15",
      endTime: "14:00",
      durationMinutes: 45,
      location: origHotel.location
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: origLunch.title,
      startTime: "14:00",
      endTime: "15:30",
      durationMinutes: 90,
      location: origLunch.location
    },
    {
      id: replacementExp.id,
      type: "experience",
      experienceId: replacementExp.id,
      title: replacementExp.title,
      category: replacementExp.category || "Culture",
      cost: replacementCost * adultCount,
      pricePerPerson: replacementCost,
      startTime: "16:00",
      endTime: "18:30",
      durationMinutes: 150,
      location: replacementExp.location,
      intensity: "low",
      notes: "Seamless late afternoon stroll with zero rush."
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: secondExp.experienceId || secondExp.id,
      title: secondExp.title,
      startTime: "18:45",
      endTime: "20:15",
      durationMinutes: 90,
      cost: (secondExp.pricePerPerson || 1800) * adultCount,
      pricePerPerson: secondExp.pricePerPerson || 1800,
      location: secondExp.location
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: origDinner.title,
      startTime: "20:30",
      endTime: "22:30",
      durationMinutes: 120,
      location: origDinner.location
    }
  ]

  const planB = {
    id: "PLAN-B-BALANCED",
    strategy: "BALANCED",
    badge: "Recommended",
    title: "Rebalance the Afternoon",
    subtitle: `Swap high-intensity activity for the relaxed ${replacementExp.title}.`,
    description: `Eliminates time pressure. Enjoy a relaxed lunch, explore ${destName}'s cultural highlights, and save budget while protecting your evening plans.`,
    experiencesPreserved: `${origExperiences.length || 2} of ${origExperiences.length || 2} experiences`,
    flexibilityImpact: "+45 min flexibility buffer",
    flexibilityDelta: 45,
    costImpact: costDiff > 0 ? `₹${(costDiff * adultCount).toLocaleString('en-IN')} saved` : "₹0 extra cost",
    costDelta: -(costDiff * adultCount),
    intensity: "Comfortable Pace",
    tags: ["Recommended", "Budget Saving", "Stress-Free", "Zero Conflict"],
    modifiedItems: planB_items,
    changes: [
      { type: "REPLACE", text: `Replace high-intensity activity with 2.5h ${replacementExp.title} (16:00 – 18:30).` },
      { type: "SAVING", text: costDiff > 0 ? `Saves ₹${(costDiff * adultCount).toLocaleString('en-IN')} on activity admissions.` : "Budget protected." },
      { type: "BUFFER", text: "Expands lunch & check-in relaxation window by +45 minutes." },
      { type: "PROTECTED", text: "Guarantees on-time arrival for evening dinner reservation." }
    ],
    recommended: true
  }

  // --------------------------------------------------------------------------
  // PLAN C — RELAXED: Protect Your Journey (Drop high intensity, rest at hotel)
  // --------------------------------------------------------------------------
  const planC_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: origFlight.title,
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: origFlight.location
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: origTransfer.title,
      startTime: "12:15",
      endTime: "13:10",
      durationMinutes: 55,
      location: origTransfer.location
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: `Resort Check-In & Unwinding @ ${origHotel.title.replace('Check-in at ', '').replace('Check-in @ ', '')}`,
      startTime: "13:15",
      endTime: "14:15",
      durationMinutes: 60,
      location: origHotel.location
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: "Leisurely Poolside Lunch & Refreshments",
      startTime: "14:15",
      endTime: "15:30",
      durationMinutes: 75,
      location: "Poolside Terrace"
    },
    {
      id: "item-d1-rest-buffer",
      type: "buffer",
      title: "Rest & Sunset Promenade Buffer",
      startTime: "15:30",
      endTime: "18:30",
      durationMinutes: 180,
      location: "Villa Grounds"
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: secondExp.experienceId || secondExp.id,
      title: secondExp.title,
      startTime: "18:45",
      endTime: "20:15",
      durationMinutes: 90,
      cost: (secondExp.pricePerPerson || 1800) * adultCount,
      pricePerPerson: secondExp.pricePerPerson || 1800,
      location: secondExp.location
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: origDinner.title,
      startTime: "20:30",
      endTime: "22:30",
      durationMinutes: 120,
      location: origDinner.location
    }
  ]

  const planC = {
    id: "PLAN-C-RELAXED",
    strategy: "RELAXED",
    badge: "Maximum Relaxation",
    title: "Protect Journey & Rest",
    subtitle: "Drop strenuous afternoon activity, prioritize villa rest, and maximize savings.",
    description: `Removes afternoon travel fatigue in ${destName}. Check in with zero rush, enjoy the resort, and keep full energy for dinner and Day 2.`,
    experiencesPreserved: `${Math.max(1, (origExperiences.length || 2) - 1)} of ${origExperiences.length || 2} activities`,
    flexibilityImpact: "+90 min flexibility buffer",
    flexibilityDelta: 90,
    costImpact: `₹${origExpCost.toLocaleString('en-IN')} saved`,
    costDelta: -origExpCost,
    intensity: "Leisure Pace",
    tags: ["Max Buffer", "Zero Fatigue", "Resort Time"],
    modifiedItems: planC_items,
    changes: [
      { type: "REMOVE", text: "Remove Scuba Diving expedition to eliminate afternoon transit fatigue." },
      { type: "SAVING", text: `Saves full ₹${origExpCost.toLocaleString('en-IN')} activity cost.` },
      { type: "BUFFER", text: "Unlocks +90 min leisure pool and resort unwinding window." },
      { type: "PROTECTED", text: "Evening dinner and sunset walk 100% safeguarded." }
    ],
    recommended: false
  }

  // Validate all plans before returning
  const plans = [planB, planA, planC]
  return plans.map(p => ({
    ...p,
    validation: validateRecoveryPlan(p, itinerary)
  }))
}

/**
 * Applies a selected recovery plan to the master itinerary
 */
export function applyRecoveryPlanToItinerary(itinerary, recoveryPlan) {
  if (!itinerary || !recoveryPlan || !recoveryPlan.modifiedItems) {
    return itinerary
  }

  const updatedDays = itinerary.days.map(day => {
    if (day.day === 1) {
      return {
        ...day,
        items: recoveryPlan.modifiedItems,
        theme: `${day.theme || 'Arrival & Coastal Welcome'} (Adapted)`
      }
    }
    return day
  })

  return {
    ...itinerary,
    days: updatedDays,
    lastModified: new Date().toISOString(),
    adaptedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    adaptationSummary: recoveryPlan.title
  }
}
