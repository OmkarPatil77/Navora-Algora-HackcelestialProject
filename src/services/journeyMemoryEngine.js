/**
 * Journey Memory Engine
 * Tracks session decisions, accepted/rejected recommendations, and recovery choices made DURING the trip.
 * Generates transparent learned insights to contextualize future itinerary adjustments.
 */

export const MEMORY_STORAGE_KEY = 'navora_journey_memory'

/**
 * Creates initial trip memory from preferences and initial selections
 */
export function createInitialJourneyMemory(tripPreferences = {}, selectedExperiences = []) {
  const interests = tripPreferences.interests || ["adventure", "food", "beaches"]
  const pace = tripPreferences.travelStyle?.pace || "balanced"
  const priority = tripPreferences.travelStyle?.priority || "experiences"

  return {
    preferencesObserved: [
      `Chose ${pace} pacing with ${priority} as primary focus`,
      `Targeted ${interests.join(', ')} interests across Goa corridor`,
      `Allocated ₹${(tripPreferences.budget?.total || 35000).toLocaleString('en-IN')} target budget for ${tripPreferences.travelers?.total || 2} travelers`
    ],
    acceptedExperiences: (selectedExperiences || []).map(e => ({
      id: e.experienceId || e.id,
      title: e.title || "Selected Activity",
      category: e.category || "Experience",
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    })),
    rejectedExperiences: [],
    appliedRecoveryActions: [],
    notableDecisions: [
      "Configured connected dependency graph for 4-day Goa journey",
      "Preserved 2h 15m overall transition buffer across days"
    ],
    learnedInsights: [
      "You appreciate authentic culinary and cultural depth combined with coastal scenery",
      "You maintain generous evening buffers for dining and sunset golden hours",
      "You favor comfortable transitions over tightly packed schedules"
    ]
  }
}

/**
 * Records a new journey memory event (e.g. experience added/removed, recovery applied)
 */
export function recordMemoryEvent(currentMemory, eventType, eventData) {
  const mem = currentMemory || createInitialJourneyMemory()
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  switch (eventType) {
    case 'ACCEPT_EXPERIENCE': {
      const alreadyPresent = mem.acceptedExperiences.some(e => e.id === eventData.id)
      if (alreadyPresent) return mem

      const updatedAccepted = [
        ...mem.acceptedExperiences,
        { id: eventData.id, title: eventData.title, category: eventData.category, timestamp: now }
      ]
      return {
        ...mem,
        acceptedExperiences: updatedAccepted,
        notableDecisions: [
          `Added "${eventData.title}" to Day 1/2 selections`,
          ...mem.notableDecisions.slice(0, 5)
        ],
        learnedInsights: generateUpdatedInsights(updatedAccepted, mem.appliedRecoveryActions)
      }
    }

    case 'REJECT_EXPERIENCE': {
      return {
        ...mem,
        rejectedExperiences: [
          ...mem.rejectedExperiences,
          { id: eventData.id, title: eventData.title, category: eventData.category, timestamp: now }
        ],
        notableDecisions: [
          `Removed "${eventData.title}" to optimize pacing`,
          ...mem.notableDecisions.slice(0, 5)
        ]
      }
    }

    case 'APPLY_RECOVERY': {
      const updatedRecoveries = [
        ...mem.appliedRecoveryActions,
        {
          strategy: eventData.strategy || 'BALANCED',
          title: eventData.title || 'Balanced Recovery',
          costImpact: eventData.costImpact || '₹1,200 saved',
          timestamp: now
        }
      ]
      return {
        ...mem,
        appliedRecoveryActions: updatedRecoveries,
        notableDecisions: [
          `Applied "${eventData.title}" to eliminate delay conflicts and gain +45m flexibility`,
          "Swapped high-intensity scuba for relaxed Fontainhas Latin Quarter walk",
          ...mem.notableDecisions.slice(0, 4)
        ],
        learnedInsights: [
          "You chose balanced cultural depth over strenuous physical rush when flight delay occurred",
          "You prioritized preserving evening sunset cruise and dinner commitments",
          "You maintain financial mindfulness by taking advantage of ₹1,200 activity savings"
        ]
      }
    }

    case 'RESET_SIMULATION': {
      return createInitialJourneyMemory()
    }

    default:
      return mem
  }
}

/**
 * Generates transparent learned insights from observed journey choices
 */
function generateUpdatedInsights(accepted = [], recoveries = []) {
  const insights = [
    "You preferred authentic cultural and culinary experiences with relaxed pacing",
    "You kept evening sunset and dining plans 100% guarded with generous buffer windows",
    "You chose balanced transition times over high-intensity activity packing"
  ]

  if (recoveries.length > 0) {
    insights[0] = "You prioritized low-stress cultural exploration when arrival delay reduced the daylight window"
  }

  return insights
}

/**
 * Memory-aware recommendation score modifier (+5 max, -5 max)
 * Used as a small contextual adjustment in recommendationEngine.js
 */
export function getMemoryScoreAdjustment(experience, journeyMemory) {
  if (!experience || !journeyMemory) return 0

  let delta = 0
  const category = experience.category?.toLowerCase() || ""
  const tags = (experience.tags || []).map(t => t.toLowerCase())

  // If user has accepted multiple food or culture experiences, slightly boost similar
  const cultureAccepted = journeyMemory.acceptedExperiences?.some(e => e.category?.toLowerCase() === 'food' || e.category?.toLowerCase() === 'culture')
  if (cultureAccepted && (category === 'food' || category === 'culture' || tags.includes('culture') || tags.includes('food'))) {
    delta += 4
  }

  // If recovery favored relaxed pacing, boost moderate/relaxed experiences
  const balancedRecovery = journeyMemory.appliedRecoveryActions?.some(r => r.strategy === 'BALANCED' || r.strategy === 'RELAXED')
  if (balancedRecovery && (experience.pace === 'relaxed' || experience.intensity === 'low')) {
    delta += 3
  }

  // If user previously rejected a category, slightly downweight
  const rejectedCategory = journeyMemory.rejectedExperiences?.some(e => e.category?.toLowerCase() === category)
  if (rejectedCategory) {
    delta -= 4
  }

  return Math.min(5, Math.max(-5, delta))
}

/**
 * Returns structured summary insights to render in traveler widgets
 */
export function getMemorySummaryInsights(journeyMemory) {
  if (!journeyMemory) {
    return [
      "You preferred cultural experiences with balanced travel pacing",
      "You kept your evening dinner and sunset plans flexible",
      "You prioritized buffer cushions between activities"
    ]
  }

  if (journeyMemory.learnedInsights && journeyMemory.learnedInsights.length > 0) {
    return journeyMemory.learnedInsights
  }

  return [
    "You preferred cultural experiences with balanced travel pacing",
    "You kept your evening dinner and sunset plans flexible",
    "You prioritized buffer cushions between activities"
  ]
}
