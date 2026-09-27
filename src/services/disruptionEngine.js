/**
 * Helper to convert "HH:MM" string to minutes from midnight
 */
export function timeToMinutes(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return 540 // default 09:00
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Helper to convert minutes from midnight back to "HH:MM"
 */
export function minutesToTime(totalMins) {
  const normalized = ((totalMins % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const mins = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Shifts a "HH:MM" time string by N minutes
 */
export function shiftTime(timeStr, deltaMinutes) {
  const current = timeToMinutes(timeStr)
  return minutesToTime(current + deltaMinutes)
}

/**
 * Supported disruption types enum
 */
export const DISRUPTION_TYPES = {
  FLIGHT_DELAY: "FLIGHT_DELAY",
  FLIGHT_CANCELLED: "FLIGHT_CANCELLED",
  HOTEL_UNAVAILABLE: "HOTEL_UNAVAILABLE",
  EXPERIENCE_CANCELLED: "EXPERIENCE_CANCELLED",
  TRANSPORT_DELAY: "TRANSPORT_DELAY",
  WEATHER_DISRUPTION: "WEATHER_DISRUPTION"
}

/**
 * Creates a normalized synthetic flight delay disruption object
 */
export function createSyntheticFlightDisruption(delayMinutes = 90, itinerary) {
  const day1 = itinerary?.days?.find(d => d.day === 1) || itinerary?.days?.[0]
  const flightNode = day1?.items?.find(i => i.type === 'flight') || {
    id: "item-d1-flight",
    startTime: "09:20",
    endTime: "10:35",
    title: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
    location: "Dabolim International Terminal"
  }

  const newStart = shiftTime(flightNode.startTime, delayMinutes)
  const newEnd = shiftTime(flightNode.endTime, delayMinutes)

  return {
    id: `DISRUPTION-SIM-${Date.now()}`,
    type: DISRUPTION_TYPES.FLIGHT_DELAY,
    status: "active",
    simulation: true,
    affectedNodeId: flightNode.id,
    delayMinutes,
    originalStartTime: flightNode.startTime,
    originalEndTime: flightNode.endTime,
    newStartTime: newStart,
    newEndTime: newEnd,
    reason: `Synthetic Hackathon Flight Delay Simulation (+${delayMinutes} min air traffic delay)`,
    createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }
}

/**
 * Analyzes the ripple effect of a disruption across the itinerary dependency graph
 */
export function analyzeDisruption(itinerary, disruption) {
  if (!disruption || !itinerary) {
    return null
  }

  const delayMins = disruption.delayMinutes || 90
  const day1 = itinerary.days?.find(d => d.day === 1) || itinerary.days?.[0]
  const items = day1?.items || []

  const impactedNodes = []
  const conflictNodes = []
  const protectedNodes = []
  const flexibleNodes = []

  let rollingAvailableTimeMins = timeToMinutes(disruption.newEndTime) // when traveler lands and is out of gate

  items.forEach(item => {
    // 1. Flight node itself
    if (item.type === 'flight') {
      impactedNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "IMPACTED",
        severity: "HIGH",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        revisedStartTime: disruption.newStartTime,
        revisedEndTime: disruption.newEndTime,
        delayMinutes: delayMins,
        rationale: `Direct synthetic simulation delay: Departure shifted from ${item.startTime} to ${disruption.newStartTime}.`
      })
      return
    }

    // 2. Airport Transfer Node (depends directly on flight arrival)
    if (item.type === 'transport' && (item.dependencies?.includes('item-d1-flight') || item.id.includes('arr-transfer') || item.title.includes('Airport Transfer'))) {
      const revisedStartMins = rollingAvailableTimeMins + 25 // 25 min baggage & gate walk
      const duration = item.durationMinutes || 55
      const revisedEndMins = revisedStartMins + duration
      rollingAvailableTimeMins = revisedEndMins

      impactedNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "IMPACTED",
        severity: "HIGH",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        revisedStartTime: minutesToTime(revisedStartMins),
        revisedEndTime: minutesToTime(revisedEndMins),
        delayMinutes: delayMins,
        rationale: `Airport transfer depends on flight touchdown. Pickup window shifts from ${item.startTime} to ${minutesToTime(revisedStartMins)}.`
      })
      return
    }

    // 3. Hotel Check-in Node
    if (item.type === 'hotel' && (item.id.includes('checkin') || item.title.includes('Check-in'))) {
      const revisedStartMins = rollingAvailableTimeMins + 10 // 10 min arrival arrival lobby transition
      const duration = item.durationMinutes || 45
      const revisedEndMins = revisedStartMins + duration
      rollingAvailableTimeMins = revisedEndMins

      impactedNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "IMPACTED",
        severity: "MEDIUM",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        revisedStartTime: minutesToTime(revisedStartMins),
        revisedEndTime: minutesToTime(revisedEndMins),
        delayMinutes: delayMins,
        rationale: `Hotel check-in pushed to ${minutesToTime(revisedStartMins)} following the delayed transit arrival.`
      })
      return
    }

    // 4. Welcome Lunch / Meals
    if (item.type === 'meal' && item.title.toLowerCase().includes('lunch')) {
      const revisedStartMins = rollingAvailableTimeMins + 15
      const duration = item.durationMinutes || 60
      const revisedEndMins = revisedStartMins + duration
      rollingAvailableTimeMins = revisedEndMins

      flexibleNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "FLEXIBLE",
        severity: "LOW",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        revisedStartTime: minutesToTime(revisedStartMins),
        revisedEndTime: minutesToTime(revisedEndMins),
        rationale: `Lunch window can flex into an express meal or late lunch starting at ${minutesToTime(revisedStartMins)}.`
      })
      return
    }

    // 5. High-intensity Afternoon Experience (e.g. Scuba / Dive / Long Activity)
    if (item.type === 'experience') {
      const origStartMins = timeToMinutes(item.startTime)
      // If original start time is before or too close to revised check-in/lunch time -> CONFLICT!
      if (origStartMins < rollingAvailableTimeMins + 30) {
        conflictNodes.push({
          nodeId: item.id,
          title: item.title,
          type: item.type,
          classification: "CONFLICT",
          severity: "CRITICAL",
          originalStartTime: item.startTime,
          originalEndTime: item.endTime,
          durationMinutes: item.durationMinutes || 180,
          intensity: item.intensity || "high",
          rationale: `Activity scheduled at ${item.startTime} directly overlaps with revised hotel check-in & transit arrival (~${minutesToTime(rollingAvailableTimeMins)}). There is insufficient daylight window.`
        })
      } else {
        protectedNodes.push({
          nodeId: item.id,
          title: item.title,
          type: item.type,
          classification: "PROTECTED",
          severity: "NONE",
          originalStartTime: item.startTime,
          originalEndTime: item.endTime,
          rationale: `Enough buffer remains. Experience can continue as scheduled.`
        })
      }
      return
    }

    // 6. Evening Sunset Experience / Dinner
    if (item.type === 'meal' && (item.title.toLowerCase().includes('dinner') || item.title.toLowerCase().includes('candlelight'))) {
      protectedNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "PROTECTED",
        severity: "NONE",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        rationale: `Evening dinner reservation remains guarded and unaffected by afternoon shifts.`
      })
      return
    }

    // 7. Buffers & Other items
    if (item.type === 'buffer') {
      flexibleNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "FLEXIBLE",
        severity: "NONE",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        rationale: `Buffer block absorbed +${item.durationMinutes} min of schedule variance.`
      })
    } else {
      protectedNodes.push({
        nodeId: item.id,
        title: item.title,
        type: item.type,
        classification: "PROTECTED",
        severity: "NONE",
        originalStartTime: item.startTime,
        originalEndTime: item.endTime,
        rationale: `No operational dependency conflict.`
      })
    }
  })

  return {
    disruption,
    conflictNodes,
    impactedNodes,
    protectedNodes,
    flexibleNodes,
    counts: {
      totalImpacted: conflictNodes.length + impactedNodes.length,
      conflicts: conflictNodes.length,
      impacted: impactedNodes.length,
      protected: protectedNodes.length,
      flexible: flexibleNodes.length
    },
    summaryText: `Flight delay of +${delayMins} min detected. ${conflictNodes.length} schedule conflict, ${impactedNodes.length} impacted transfers, and ${protectedNodes.length} protected evening bookings.`
  }
}
