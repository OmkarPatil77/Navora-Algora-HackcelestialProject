/**
 * Journey Health Engine
 * Calculates deterministic multidimensional health scores and risks for a travel journey.
 */

export const HEALTH_STATUSES = {
  EXCELLENT: { label: "Excellent", minScore: 90, color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  STABLE: { label: "Stable", minScore: 80, color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  WATCH: { label: "Watch Alert", minScore: 70, color: "text-amber-800 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  AT_RISK: { label: "At Risk", minScore: 50, color: "text-orange-800 bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  DISRUPTED: { label: "Disrupted", minScore: 0, color: "text-rose-800 bg-rose-50 border-rose-200", dot: "bg-rose-500" }
}

/**
 * Calculates deterministic journey health metrics based on current trip state
 */
export function calculateJourneyHealth({
  itinerary,
  selectedExperiences = [],
  tripPreferences = {},
  disruptionAnalysis = null,
  appliedRecovery = null,
  operatorVendors = []
}) {
  const day1 = itinerary?.days?.find(d => d.day === 1) || itinerary?.days?.[0]
  const items = day1?.items || []
  const flexibility = itinerary?.flexibility || {}
  const summary = itinerary?.summary || {}

  // 1. Schedule Resilience Dimension (0 - 100)
  let scheduleResilience = 92
  if (disruptionAnalysis && !appliedRecovery) {
    scheduleResilience = Math.max(45, 92 - (disruptionAnalysis.counts?.conflicts * 25) - (disruptionAnalysis.counts?.impacted * 8))
  } else if (appliedRecovery) {
    scheduleResilience = Math.min(98, 88 + Math.round((appliedRecovery.flexibilityDelta || 45) / 5))
  }

  // 2. Budget Health Dimension (0 - 100)
  let budgetHealth = 95
  const totalBudget = tripPreferences.budget?.total || 35000
  const estimatedCost = summary.totalCost || 34620
  const remaining = totalBudget - estimatedCost
  if (remaining < 0) {
    budgetHealth = Math.max(40, 95 - Math.round(Math.abs(remaining) / 500))
  } else if (appliedRecovery?.costDelta < 0) {
    budgetHealth = Math.min(100, 95 + Math.round(Math.abs(appliedRecovery.costDelta) / 300))
  }

  // 3. Experience Balance Dimension (0 - 100)
  let experienceBalance = 90
  const hasHighIntensity = items.some(i => i.intensity === 'high')
  const count = items.filter(i => i.type === 'experience').length
  if (count >= 2 && !hasHighIntensity) {
    experienceBalance = 94 // comfortable balanced pace
  } else if (hasHighIntensity && disruptionAnalysis && !appliedRecovery) {
    experienceBalance = 65 // high intensity trapped in tight window
  } else if (appliedRecovery) {
    experienceBalance = 96 // perfectly swapped to comfortable cultural pace
  }

  // 4. Operational Readiness Dimension (0 - 100)
  let operationalReadiness = 94
  const unconfirmedVendors = operatorVendors.filter(v => v.status === 'requires_action').length
  if (unconfirmedVendors > 0) {
    operationalReadiness = Math.max(60, 94 - (unconfirmedVendors * 15))
  }
  if (appliedRecovery) {
    operationalReadiness = Math.min(96, operationalReadiness + 5)
  }

  // 5. Recovery Readiness Dimension (0 - 100)
  let recoveryReadiness = 90
  if (disruptionAnalysis && !appliedRecovery) {
    recoveryReadiness = 82 // solutions computed & available to apply
  } else if (appliedRecovery) {
    recoveryReadiness = 98 // solution fully locked and synchronized
  }

  // Weighted Total Score Calculation
  // Schedule: 30%, Operational: 25%, Experience: 20%, Budget: 15%, Recovery: 10%
  const weightedScore = Math.round(
    (scheduleResilience * 0.30) +
    (operationalReadiness * 0.25) +
    (experienceBalance * 0.20) +
    (budgetHealth * 0.15) +
    (recoveryReadiness * 0.10)
  )

  const finalScore = Math.min(100, Math.max(10, weightedScore))

  // Determine Status
  let currentStatus = HEALTH_STATUSES.DISRUPTED
  if (finalScore >= 90) currentStatus = HEALTH_STATUSES.EXCELLENT
  else if (finalScore >= 80) currentStatus = HEALTH_STATUSES.STABLE
  else if (finalScore >= 70) currentStatus = HEALTH_STATUSES.WATCH
  else if (finalScore >= 50) currentStatus = HEALTH_STATUSES.AT_RISK

  // Generate deterministic Strengths & Risks
  const risks = []
  const strengths = []
  const recommendations = []

  if (disruptionAnalysis && !appliedRecovery) {
    risks.push(`Inbound flight delay (+${disruptionAnalysis.disruption?.delayMinutes || 90}m) directly encroaches on afternoon scuba schedule.`)
    risks.push(`Airport transfer requires immediate driver pickup re-timing at Gate 2.`)
    recommendations.push(`Apply Plan B (Balanced Recovery) to swap Scuba for Fontainhas Walk and recover +45m buffer.`)
  } else if (appliedRecovery) {
    strengths.push(`Plan B Balanced Recovery resolved all schedule collisions with zero cancellation penalties.`)
    strengths.push(`Saved ${appliedRecovery.costImpact} on admissions and gained ${appliedRecovery.flexibilityImpact}.`)
    strengths.push(`Evening Mandovi Catamaran sunset cruise & Fisherman's Wharf dinner are 100% guarded.`)
  } else {
    strengths.push(`All 8 itinerary nodes have clean transition buffers.`)
    strengths.push(`Budget is balanced within target allocation (₹${totalBudget.toLocaleString('en-IN')}).`)
    strengths.push(`Vendor allocations confirmed across transport and villa partners.`)
  }

  return {
    score: finalScore,
    status: currentStatus.label,
    statusMeta: currentStatus,
    dimensions: {
      scheduleResilience: { name: "Schedule Resilience", score: scheduleResilience, weight: "30%" },
      operationalReadiness: { name: "Operational Readiness", score: operationalReadiness, weight: "25%" },
      experienceBalance: { name: "Experience Balance", score: experienceBalance, weight: "20%" },
      budgetHealth: { name: "Budget Health", score: budgetHealth, weight: "15%" },
      recoveryReadiness: { name: "Recovery Readiness", score: recoveryReadiness, weight: "10%" }
    },
    risks,
    strengths,
    recommendations,
    summary: disruptionAnalysis && !appliedRecovery
      ? "Navora detected schedule pressure due to a simulated flight delay. Recovery solver generated 3 validated response strategies."
      : appliedRecovery
      ? "Journey successfully adapted. All schedule conflicts resolved, budget optimized, and vendor schedules synchronized."
      : "Journey is running in optimal health with all bookings and transition buffers confirmed."
  }
}
