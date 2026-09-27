import { clientFallback } from './demoFallbackProvider'

/**
 * Builds compact, normalized copilot context from client state
 */
export function buildCopilotContext(
  tripPreferences = {},
  selectedExperiences = [],
  itinerary = {},
  currentPage = '/trip',
  disruptionContext = {},
  journeyHealth = null,
  journeyMemory = null
) {
  const days = itinerary?.days || []
  const summary = itinerary?.summary || {}
  const flexibility = itinerary?.flexibility || {}
  const { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans } = disruptionContext

  const compactDays = days.map(d => ({
    day: d.day,
    title: d.title,
    theme: d.theme,
    items: (d.items || []).map(i => ({
      id: i.id,
      type: i.type,
      title: i.title,
      startTime: i.startTime,
      endTime: i.endTime,
      cost: i.cost,
      movable: Boolean(i.movable),
      critical: Boolean(i.critical),
      intensity: i.intensity || 'moderate'
    }))
  }))

  return {
    currentPage,
    trip: {
      destination: tripPreferences.destination?.name || 'Goa, India',
      startDate: tripPreferences.startDate || '12 Oct 2026',
      endDate: tripPreferences.endDate || '15 Oct 2026',
      durationDays: tripPreferences.duration?.days || 4,
      travelers: tripPreferences.travelers || { adults: 2, total: 2 },
      interests: tripPreferences.interests || ['adventure', 'food', 'beaches'],
      travelStyle: tripPreferences.travelStyle || { pace: 'balanced', priority: 'experiences', accommodation: 'comfort' },
      budget: {
        total: tripPreferences.budget?.total || 35000,
        estimatedCost: summary.totalCost || 34620,
        remainingBuffer: summary.remainingBudget || 380,
        isOverBudget: Boolean(summary.isOverBudget)
      }
    },
    selectedExperiencesCount: selectedExperiences?.length || 0,
    selectedExperiences: (selectedExperiences || []).slice(0, 10).map(e => ({
      id: e.id || e.experienceId,
      title: e.title || e.name,
      price: e.price,
      category: e.category
    })),
    itineraryDays: compactDays,
    flexibility: {
      percentage: flexibility.percentage || 78,
      bufferFormatted: flexibility.bufferFormatted || '2h 15m',
      totalBufferMinutes: flexibility.totalBufferMinutes || 135
    },
    disruption: activeDisruption ? {
      isActive: true,
      type: activeDisruption.type,
      delayMinutes: activeDisruption.delayMinutes,
      newStartTime: activeDisruption.newStartTime,
      newEndTime: activeDisruption.newEndTime,
      conflictsCount: disruptionAnalysis?.counts?.conflicts || 0,
      impactedCount: disruptionAnalysis?.counts?.impacted || 0,
      protectedCount: disruptionAnalysis?.counts?.protected || 0,
      appliedRecovery: appliedRecovery ? (typeof appliedRecovery === 'string' ? appliedRecovery : appliedRecovery.title) : null,
      availableRecoveryStrategies: (recoveryPlans || []).map(p => ({
        id: p.id,
        title: p.title,
        strategy: p.strategy,
        costImpact: p.costImpact,
        flexibilityImpact: p.flexibilityImpact
      }))
    } : { isActive: false },
    journeyHealth: journeyHealth || { score: 94, status: 'EXCELLENT' },
    journeyMemory: journeyMemory || null
  }
}

/**
 * Builds compact operator context
 */
export function buildOperatorCopilotContext(
  operatorState = {},
  focalTour = {},
  disruptionContext = {},
  journeyHealth = null
) {
  const { operatorVendors = [], operatorAttentionItems = [], operatorEventLog = [] } = operatorState
  const { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans } = disruptionContext

  return {
    activeToursCount: 12,
    focalTour: focalTour.id ? {
      id: focalTour.id,
      title: focalTour.title || 'Goa Coastal Escape',
      destination: focalTour.destination || 'Goa, India',
      travelers: focalTour.travelersName || 'Aryan & Riya Sharma',
      pacing: focalTour.pacing || 'Balanced',
      hotel: focalTour.hotel || 'Casa Sol Heritage Villa',
      leadGuide: focalTour.leadGuide || 'Rajesh Naik',
      status: focalTour.status || (activeDisruption ? 'disruption_active' : 'on_track')
    } : {
      id: 'GOA-2048',
      title: 'Goa Coastal Escape',
      destination: 'Goa, India',
      travelers: 'Aryan & Riya Sharma',
      status: activeDisruption ? 'disruption_active' : 'on_track'
    },
    disruptions: activeDisruption ? [
      {
        id: 'DIS-2024-001',
        severity: 'High',
        status: appliedRecovery ? 'Resolved' : 'Active',
        title: 'Flight 6E-204 Delayed',
        description: 'Inbound flight Mumbai (BOM) → Goa (GOI) delayed by 90 minutes',
        tourId: 'GOA-2048',
        timeChange: '09:20 → 10:50',
        affectedTags: ['Airport Transfer', 'Hotel Check-in', 'Scuba Diving']
      }
    ] : [],
    vendors: (operatorVendors || []).map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      service: v.service,
      status: v.status,
      scheduledTime: v.scheduledTime,
      updatedTime: v.updatedTime,
      tourId: v.tourId || 'GOA-2048'
    })),
    attentionItems: (operatorAttentionItems || []).map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      status: a.status,
      vendorName: a.vendorName,
      tourId: a.tourId || 'GOA-2048'
    })),
    recentEvents: (operatorEventLog || []).slice(-3),
    journeyHealth: journeyHealth || { score: 94, status: 'OPTIMAL' },
    operationalReadiness: '98.5%'
  }
}

/**
 * Main Frontend Copilot Provider
 */
export const copilotService = {
  async ask({ role = 'traveler', message = '', context = {}, history = [] }) {
    // Natural slight think pause
    await new Promise(resolve => setTimeout(resolve, 350))

    try {
      // Execute intelligent deterministic response directly from context
      const result = clientFallback.ask({ role, message, context })
      return result
    } catch (err) {
      console.error('[CopilotService] Error generating response:', err)
      return {
        success: true,
        intent: 'GENERAL',
        message: 'Your journey is operating smoothly with confirmed vendor allocations and healthy buffer times.',
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        source: 'computed'
      }
    }
  }
}
