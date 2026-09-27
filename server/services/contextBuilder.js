/**
 * Context Builder: Constructs compact, role-specific contextual payloads for the LLM
 */

export function buildCopilotContext(role = 'traveler', rawContext = {}) {
  if (role === 'operator') {
    return buildOperatorContext(rawContext)
  }
  return buildTravelerContext(rawContext)
}

function buildTravelerContext(ctx = {}) {
  const {
    trip = {},
    selectedExperiences = [],
    itineraryDays = [],
    flexibility = {},
    disruption = {},
    journeyHealth = null,
    journeyMemory = null
  } = ctx

  return {
    role: 'traveler',
    destination: trip.destination || 'Goa, India',
    travelDates: {
      start: trip.startDate || '12 Oct 2026',
      end: trip.endDate || '15 Oct 2026',
      durationDays: trip.durationDays || 4
    },
    party: trip.travelers || { adults: 2, total: 2 },
    preferences: {
      interests: trip.interests || ['beaches', 'culture', 'culinary'],
      travelStyle: trip.travelStyle || { pace: 'balanced', priority: 'experiences' }
    },
    budget: {
      total: trip.budget?.total || 35000,
      estimatedCost: trip.budget?.estimatedCost || 34620,
      remainingBuffer: trip.budget?.remainingBuffer || 380,
      isOverBudget: Boolean(trip.budget?.isOverBudget)
    },
    selectedExperiences: (selectedExperiences || []).slice(0, 10).map(e => ({
      id: e.id || e.experienceId,
      title: e.title || e.name,
      category: e.category,
      price: e.price,
      duration: e.durationHours || e.duration
    })),
    itinerary: (itineraryDays || []).map(d => ({
      day: d.day,
      theme: d.theme || d.title,
      items: (d.items || []).map(i => ({
        id: i.id,
        title: i.title,
        startTime: i.startTime,
        endTime: i.endTime,
        type: i.type,
        status: i.status || 'scheduled',
        movable: Boolean(i.movable),
        critical: Boolean(i.critical)
      }))
    })),
    flexibility: {
      scorePercentage: flexibility.percentage || flexibility.scorePercentage || 78,
      bufferFormatted: flexibility.bufferFormatted || '2h 15m'
    },
    disruption: disruption?.isActive ? {
      isActive: true,
      type: disruption.type || 'FLIGHT_DELAY',
      delayMinutes: disruption.delayMinutes || 90,
      impact: {
        conflicts: disruption.conflictsCount || 1,
        impacted: disruption.impactedCount || 2,
        protected: disruption.protectedCount || 2
      },
      appliedRecovery: disruption.appliedRecovery || null,
      availableRecoveryPlans: (disruption.availableRecoveryStrategies || []).map(p => ({
        id: p.id,
        title: p.title,
        strategy: p.strategy,
        costImpact: p.costImpact,
        flexibilityImpact: p.flexibilityImpact
      }))
    } : { isActive: false },
    journeyHealth: journeyHealth ? {
      score: journeyHealth.score || 94,
      status: journeyHealth.status || 'EXCELLENT',
      fatigueIndex: journeyHealth.fatigueIndex || 'LOW'
    } : { score: 94, status: 'EXCELLENT' },
    journeyMemory: journeyMemory ? {
      learnedPreferences: journeyMemory.learnedPreferences || [],
      adaptiveNotes: journeyMemory.adaptiveNotes || []
    } : null
  }
}

function buildOperatorContext(ctx = {}) {
  const {
    activeTours = [],
    activeTour = {},
    disruptions = [],
    vendors = [],
    attentionItems = [],
    recentEvents = [],
    journeyHealth = null,
    operationalReadiness = null
  } = ctx

  return {
    role: 'operator',
    activeToursCount: activeTours.length || 12,
    focalTour: activeTour.id ? {
      id: activeTour.id,
      title: activeTour.title || 'Goa Coastal Escape',
      destination: activeTour.destination || 'Goa, India',
      travelers: activeTour.travelersName || 'Aryan & Riya Sharma',
      pacing: activeTour.pacing || 'Balanced',
      hotel: activeTour.hotel || 'Casa Sol Heritage Villa',
      leadGuide: activeTour.leadGuide || 'Rajesh Naik',
      status: activeTour.status || 'disruption_active'
    } : {
      id: 'GOA-2048',
      title: 'Goa Coastal Escape',
      destination: 'Goa, India',
      travelers: 'Aryan & Riya Sharma',
      status: 'disruption_active'
    },
    disruptions: (disruptions || []).map(d => ({
      id: d.id,
      severity: d.severity,
      status: d.status,
      title: d.title,
      description: d.description,
      tourId: d.tourId,
      timeChange: d.timeChange,
      affectedTags: d.affectedTags || []
    })),
    vendors: (vendors || []).slice(0, 8).map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      service: v.service,
      status: v.status,
      scheduledTime: v.scheduledTime,
      updatedTime: v.updatedTime,
      tourId: v.tourId
    })),
    attentionItems: (attentionItems || []).map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      status: a.status,
      vendorName: a.vendorName,
      tourId: a.tourId
    })),
    recentEvents: (recentEvents || []).slice(-4),
    operationalHealth: journeyHealth || { score: 94, status: 'OPTIMAL' },
    readinessScore: operationalReadiness || '98.5%'
  }
}
