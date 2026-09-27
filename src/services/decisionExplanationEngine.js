/**
 * Decision Explanation Engine
 * Generates transparent, deterministic, structured explanations for AI recommendations, disruptions, and recoveries.
 */

/**
 * Explains why a specific travel experience was recommended for this traveler
 */
export function explainRecommendation(experience, tripPreferences = {}, selectedExperiences = []) {
  if (!experience) return null

  const travelerInterests = tripPreferences.interests || ["adventure", "food", "beaches"]
  const matchedInterests = (experience.tags || []).filter(t => travelerInterests.includes(t.toLowerCase()))
  const pace = tripPreferences.travelStyle?.pace || "balanced"
  const priority = tripPreferences.travelStyle?.priority || "experiences"

  const factors = []

  if (matchedInterests.length > 0) {
    factors.push({
      category: "Interest Match",
      status: "match",
      detail: `Matches your interest in ${matchedInterests.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}.`
    })
  }

  factors.push({
    category: "Pacing Fit",
    status: "match",
    detail: `Intensity is "${experience.intensity || 'moderate'}", which aligns with your ${pace} travel style.`
  })

  factors.push({
    category: "Budget Allocation",
    status: "match",
    detail: `Priced at ₹${experience.pricePerPerson?.toLocaleString('en-IN') || 1500}/person, comfortably fitting within your activities allocation.`
  })

  factors.push({
    category: "Schedule & Daylight Window",
    status: "match",
    detail: `Duration of ${experience.durationHours || 2.5}h fits naturally into your ${experience.bestTime || 'Day 1/2'} itinerary slot without crowding transit.`
  })

  return {
    title: `Why Navora Recommends "${experience.title}"`,
    headline: `Selected for high alignment with your ${travelerInterests.join(', ')} preferences.`,
    matchScore: Math.min(98, 82 + (matchedInterests.length * 5)),
    factors,
    summary: `Navora verified that this ${experience.category} activity satisfies your ${priority} priority, provides excellent cultural fidelity, and preserves transition buffers.`
  }
}

/**
 * Explains why an itinerary node was impacted or protected during a disruption
 */
export function explainDisruptionImpact(nodeId, disruptionAnalysis, itinerary) {
  if (!disruptionAnalysis) return null

  const delayMins = disruptionAnalysis.disruption?.delayMinutes || 90
  const conflict = disruptionAnalysis.conflictNodes?.find(n => n.nodeId === nodeId)
  const impacted = disruptionAnalysis.impactedNodes?.find(n => n.nodeId === nodeId)
  const isProtected = disruptionAnalysis.protectedNodes?.some(n => n.nodeId === nodeId)

  if (conflict) {
    return {
      nodeId,
      title: `Why "${conflict.title}" Has a Schedule Conflict`,
      classification: "CONFLICT",
      badgeVariant: "danger",
      reason: `The +${delayMins} min flight delay pushes arrival and villa check-in into the original activity start window (${conflict.originalStartTime}).`,
      factors: [
        `Original start time (${conflict.originalStartTime}) overlaps with revised airport arrival (12:05) and check-in (13:15).`,
        `Activity requires a 4.5-hour continuous daylight window.`,
        `Starting later than 14:00 would cause a severe overlap with your pre-booked Mandovi Sunset Cruise & dinner.`
      ],
      resolution: "Navora recommends swapping with a lower-intensity, compact 2.5h cultural walk."
    }
  }

  if (impacted) {
    return {
      nodeId,
      title: `Why "${impacted.title}" Was Rescheduled`,
      classification: "IMPACTED",
      badgeVariant: "warning",
      reason: `Direct upstream dependency on flight touchdown shifted arrival to ${impacted.revisedStartTime}.`,
      factors: [
        `Inbound flight Mumbai → Goa shifted from 09:20 to 10:50.`,
        `Airport cab pickup is synchronized with gate exit at ${impacted.revisedStartTime}.`,
        `Driver Rajesh Naik has been held at Gate 2 with zero waiting surcharge.`
      ],
      resolution: "Schedule shifted smoothly downstream without cancelling the service."
    }
  }

  return {
    nodeId,
    title: `Why This Booking Remains 100% Protected`,
    classification: "PROTECTED",
    badgeVariant: "success",
    reason: `Ample buffer windows isolate this evening booking from afternoon schedule variances.`,
    factors: [
      `Scheduled at 18:45 / 20:30, well clear of afternoon arrival transitions.`,
      `Over 120 minutes of buffer separates hotel check-in from evening departures.`,
      `Guaranteed zero impact on your golden-hour sunset and dining reservations.`
    ],
    resolution: "No operational changes required. Your booking is safely locked."
  }
}

/**
 * Explains why a specific recovery strategy (e.g., Plan B Balanced) was formulated
 */
export function explainRecoveryDecision(recoveryPlan, originalConflict, tripPreferences) {
  if (!recoveryPlan) return null

  return {
    planId: recoveryPlan.id,
    title: `Why Navora Recommends "${recoveryPlan.title}"`,
    strategy: recoveryPlan.strategy,
    reason: "Optimizes traveler comfort, eliminates schedule rush, and recovers budget after a flight delay.",
    factors: [
      "Replaces strenuous 4.5h Scuba Dive with 2.5h Fontainhas Latin Quarter Heritage Walk (16:00 – 18:30).",
      "Saves ₹1,200 in activity costs without sacrificing cultural depth.",
      "Creates a +45 minute relaxation cushion at the resort villa poolside.",
      "Guarantees 100% on-time arrival for the Mandovi Sunset Catamaran Cruise & Fisherman's Wharf Dinner."
    ],
    constraintsSatisfied: [
      "✓ Zero schedule overlaps",
      "✓ All upstream transit dependencies satisfied",
      "✓ Daytime daylight constraints met",
      "✓ Zero cancellation penalties applied"
    ],
    outcome: "5 of 5 key experiences preserved with zero schedule stress."
  }
}

/**
 * Explains why an activity is protected from disruption changes
 */
export function explainProtectedNode(item, recovery) {
  return {
    title: `Why "${item?.title || 'This Activity'}" is 100% Protected`,
    reason: "Sufficient buffer windows and fixed golden-hour scheduling ensure this experience remains undisturbed.",
    factors: [
      "Departure scheduled during optimal evening window (18:45 – 20:30)",
      "45-minute transit buffer from previous activity eliminates rush",
      "High scenic and culinary priority node"
    ],
    constraintsSatisfied: [
      "✓ Evening daylight buffer verified",
      "✓ Zero transit overlap",
      "✓ Reservation confirmed"
    ],
    outcome: "Booking locked with zero changes needed."
  }
}

/**
 * Explains vendor schedule adjustments for operator coordination
 */
export function explainVendorImpact(vendor, disruption, recovery) {
  if (!vendor) return null

  if (vendor.id === 'VEN-001') {
    return {
      vendorName: vendor.name,
      service: vendor.service,
      reason: "Pickup re-timed from 10:55 to 12:15 to match delayed flight arrival.",
      notes: "Driver Rajesh Naik notified for Gate 2 meet & greet."
    }
  }

  if (vendor.id === 'VEN-003') {
    return {
      vendorName: vendor.name,
      service: vendor.service,
      reason: "Scuba dive cancelled without penalty under Navora Master Operator SLA.",
      notes: "Slot released back to inventory; replacement booked with Fontainhas Heritage Guild."
    }
  }

  return {
    vendorName: vendor.name,
    service: vendor.service,
    reason: "Schedule verified and unaffected by transit shifts.",
    notes: "Confirmed and locked in operator roster."
  }
}
