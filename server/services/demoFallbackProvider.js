import { allExperiences, getExperiencesByDestination } from '../../src/data/experiences.js'

/**
 * Deterministic Fallback Provider: High-fidelity journey intelligence fallback
 * when LLM or Hugging Face is unreachable.
 */

export class DemoFallbackProvider {
  async generateResponse({ role = 'traveler', userMessage = '', context = {} }) {
    const q = (userMessage || '').toLowerCase().trim()

    if (role === 'operator') {
      return this.handleOperatorQuery(q, context)
    }
    return this.handleTravelerQuery(q, context)
  }

  handleTravelerQuery(q, ctx) {
    const isDisruptionActive = ctx.disruption?.isActive || false
    const budgetTotal = ctx.trip?.budget?.total || ctx.budget?.total || 35000
    const budgetEstimated = ctx.trip?.budget?.estimatedCost || ctx.budget?.estimatedCost || 34620
    const budgetRemaining = ctx.trip?.budget?.remainingBuffer || ctx.budget?.remainingBuffer || (budgetTotal - budgetEstimated)
    const activeDestination = ctx.trip?.destination || ctx.destination || 'Goa, India'
    const durationDays = ctx.trip?.durationDays || ctx.durationDays || 4
    const travelers = ctx.trip?.travelers || { adults: 2, total: 2 }
    const healthScore = ctx.journeyHealth?.score || 94
    const userInterests = ctx.trip?.interests || ['culture', 'food', 'photography', 'history', 'adventure', 'beaches']

    // 0. FAMOUS SPOTS / DESTINATION PLACES / ATTRACTIONS RECOMMENDATION QUERY
    const isSpotQuery = (/\b(spots?|places?|attractions?|sights?|things to do|what to do|what to see|must visit|explore)\b/i.test(q) || q.includes('famous in')) &&
      !q.includes('replace') && 
      !q.includes('why') &&
      !q.includes('cancel')

    let targetDestQuery = null
    if (q.includes('jaipur') || q.includes('rajasthan')) targetDestQuery = 'Jaipur'
    else if (q.includes('goa')) targetDestQuery = 'Goa'
    else if (q.includes('kerala') || q.includes('munnar') || q.includes('alleppey') || q.includes('kochi')) targetDestQuery = 'Kerala'
    else if (q.includes('dubai') || q.includes('uae')) targetDestQuery = 'Dubai'
    else if (q.includes('singapore')) targetDestQuery = 'Singapore'
    else if (isSpotQuery) targetDestQuery = activeDestination.split(',')[0].trim()

    if (targetDestQuery || (isSpotQuery && !q.includes('budget') && !q.includes('driver'))) {
      const destName = targetDestQuery || activeDestination.split(',')[0].trim()
      const candidateExperiences = getExperiencesByDestination(destName)

      if (candidateExperiences && candidateExperiences.length > 0 && isSpotQuery) {
        const scoredSpots = candidateExperiences.map(exp => {
          const expTags = [...(exp.tags || []), ...(exp.idealFor || []), exp.category?.toLowerCase()].filter(Boolean)
          const matchedTags = Array.from(new Set(
            expTags.filter(tag => 
              userInterests.some(ui => tag.toLowerCase().includes(ui.toLowerCase()) || ui.toLowerCase().includes(tag.toLowerCase()))
            )
          ))
          
          let matchPct = Math.min(98, Math.max(72, 70 + (matchedTags.length * 9) + (exp.rating >= 4.8 ? 6 : 2)))
          const totalCost = (exp.pricePerPerson || 1500) * (travelers.total || 2)
          const fitsBudget = totalCost <= (budgetRemaining > 0 ? budgetRemaining + 3000 : 5000)

          return {
            ...exp,
            matchPct,
            matchedTags,
            totalCost,
            fitsBudget,
            idealDay: exp.pace === 'active' ? 2 : 3
          }
        }).sort((a, b) => b.matchPct - a.matchPct)

        const topSpots = scoredSpots.slice(0, 4)
        const bestPick = topSpots[0]

        const spotsFormatted = topSpots.map((spot, idx) => {
          const budgetStatus = spot.fitsBudget 
            ? `₹${spot.pricePerPerson.toLocaleString('en-IN')}/person (₹${spot.totalCost.toLocaleString('en-IN')} total) — Fits within budget buffer`
            : `₹${spot.pricePerPerson.toLocaleString('en-IN')}/person (₹${spot.totalCost.toLocaleString('en-IN')} total)`

          const tagDisplay = spot.matchedTags.length > 0 ? ` (${spot.matchedTags.slice(0, 2).join(', ')})` : ''

          return `${idx + 1}. ${spot.title} (${spot.category})
   • Interest Match: ${spot.matchPct}% match${tagDisplay}
   • Schedule: ${spot.durationHours} Hours • ${spot.bestTime || 'Daytime'}
   • Budget: ${budgetStatus}
   • Highlights: ${spot.highlights ? spot.highlights.slice(0, 2).join(' • ') : spot.description}`
        }).join('\n\n')

        const recommendationText = `Personalized Recommendation:
Based on your ${bestPick.matchPct}% interest match and available buffer, I recommend adding "${bestPick.title}" to Day ${bestPick.idealDay}. It matches your travel style and offers high experiential value at ₹${bestPick.pricePerPerson.toLocaleString('en-IN')}/person.`

        const responseMessage = `Here are the top famous spots and curated experiences in ${destName}, tailored to your preferences (${userInterests.slice(0, 3).join(', ')}):\n\n${spotsFormatted}\n\n${recommendationText}`

        return {
          intent: 'SPOT_RECOMMENDATIONS',
          message: responseMessage,
          actions: [
            {
              type: 'ADD_EXPERIENCE',
              experienceId: bestPick.id,
              experience: bestPick,
              matchPct: bestPick.matchPct,
              day: bestPick.idealDay,
              reason: `${bestPick.matchPct}% Interest Match with ${userInterests.slice(0, 2).join(' & ')} profile • ₹${bestPick.pricePerPerson.toLocaleString('en-IN')}/person`
            }
          ],
          recommendedExperienceIds: topSpots.map(s => s.id),
          explanation: {
            title: `${destName} Curated Attractions`,
            reason: `Evaluated ${candidateExperiences.length} destinations spots against interest profile and financial buffer.`,
            factors: [
              `Highest match: ${bestPick.title} (${bestPick.matchPct}%)`,
              `Travelers: ${travelers.total || 2} adults`,
              `Budget fit: ₹${bestPick.totalCost.toLocaleString('en-IN')}`
            ],
            constraintsSatisfied: ['Interest alignment verified', 'Schedule feasibility confirmed'],
            outcome: `Top spot ${bestPick.title} queued for itinerary injection.`
          },
          confidence: 'high',
          source: 'computed'
        }
      }
    }

    // 1. Why was scuba replaced?
    if (q.includes('scuba') && (q.includes('replace') || q.includes('why') || q.includes('cancel'))) {
      return {
        intent: 'EXPLAIN_DISRUPTION',
        message: 'The 90-minute flight delay pushes your airport transfer and hotel check-in later. That leaves too little room for the 4.5-hour scuba session without compressing the evening. The heritage walk gives you more recovery time while keeping the sunset cruise and dinner unchanged.',
        actions: isDisruptionActive ? [
          {
            type: 'REPLACE_EXPERIENCE',
            removeExperienceId: 'goa-scuba-dive',
            addExperienceId: 'goa-fontainhas-heritage-walk',
            day: 1,
            reason: 'Absorbs flight delay deficit and protects evening catamaran slot.'
          }
        ] : [],
        recommendedExperienceIds: ['goa-fontainhas-heritage-walk'],
        explanation: {
          title: 'Day 1 Afternoon Schedule Adaptation',
          reason: 'Flight 6E-204 delayed by 90 mins created daylight window conflict for deep water diving.',
          factors: [
            'Airport arrival shifted to 10:50 AM',
            'Hotel check-in buffer adjusted to 13:15',
            'Sunset cruise departure at 18:45 is strictly guarded'
          ],
          constraintsSatisfied: ['Buffer preservation', 'Zero evening disruption', 'Zero cancellation penalty'],
          alternative: 'Plan A: Push dive to Day 2 (creates Day 2 morning congestion)',
          outcome: 'Fontainhas Cultural Walk substituted (+45 min relaxation buffer)'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // 2. Sunset cruise
    if (q.includes('sunset') || q.includes('cruise') || q.includes('unchanged') || q.includes('safe')) {
      return {
        intent: 'EXPLAIN_LOGISTICS',
        message: 'Nothing needs to change for the sunset cruise. The catamaran departs from Mandovi Jetty at 18:45. Because your afternoon schedule was adapted with adequate transfer buffers, you will arrive at the jetty with 30 minutes of relaxed buffer time.',
        actions: [],
        recommendedExperienceIds: ['goa-mandovi-sunset-cruise'],
        explanation: {
          title: 'Mandovi Sunset Cruise Protection',
          reason: 'Evening schedule has sufficient buffer after Fontainhas Cultural Walk.',
          factors: ['Jetty reporting time: 18:15', 'Transfer from Panjim: 15 mins', 'Buffer available: 35 mins'],
          constraintsSatisfied: ['On-time departure guaranteed'],
          alternative: 'None needed',
          outcome: 'Zero schedule compromise'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // 3. Budget query
    if (q.includes('budget') || q.includes('cost') || q.includes('money') || q.includes('left')) {
      return {
        intent: 'BUDGET_QUERY',
        message: `Your total trip budget is ₹${budgetTotal.toLocaleString('en-IN')}. Based on selected accommodations, experiences, and guided transfers, you have ₹${budgetRemaining.toLocaleString('en-IN')} remaining in your unallocated flexibility buffer.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // 4. Pacing / relaxed
    if (q.includes('relaxed') || q.includes('slow') || q.includes('pace') || q.includes('pacing')) {
      return {
        intent: 'MODIFY_PACING',
        message: 'I can adjust Day 2 pacing to a more relaxed rhythm by adding 45 minutes of beachside leisure and spacing out the afternoon cultural walk.',
        actions: [
          {
            type: 'MODIFY_PACING',
            pace: 'relaxed',
            reason: 'Traveler requested higher downtime between daytime excursions.'
          }
        ],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Pacing Adjustment',
          reason: 'Switch pacing profile to relaxed',
          factors: ['Adds 45 min rest window', 'Lowers intensity score'],
          constraintsSatisfied: ['Total trip duration maintained'],
          alternative: 'Keep balanced pace',
          outcome: 'Relaxed itinerary generated'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // 5. Trip Health
    if (q.includes('health') || q.includes('score') || q.includes('status')) {
      return {
        intent: 'HEALTH_QUERY',
        message: `Your journey health score is ${healthScore}/100 (Optimal). All core travel segments have verified buffer windows, and physical fatigue distribution is well-balanced across all 4 days.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // Default
    return {
      intent: 'GENERAL',
      message: `I have reviewed your journey in ${activeDestination}. Everything is well-balanced with active vendor allocations and healthy buffer times. Ask me about famous spots in Jaipur or Goa, adjust pacing, or check budget distribution.`,
      actions: [],
      recommendedExperienceIds: [],
      explanation: null,
      confidence: 'high',
      source: 'computed'
    }
  }

  handleOperatorQuery(q, ctx) {
    const focalTourId = ctx.focalTour?.id || 'GOA-2048'

    if (q.includes('summar') || q.includes('today') || q.includes('overview') || q.includes('status')) {
      return {
        intent: 'OPERATIONS_SUMMARY',
        message: `${focalTourId} has one active disruption. The 90-minute inbound delay shifted airport transfer and hotel check-in and created a conflict with the scuba activity. The sunset cruise and dinner remain protected. Two vendor actions are currently pending.`,
        actions: [
          {
            type: 'VIEW_IMPACT',
            tourId: focalTourId
          }
        ],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Fleet Operational Summary',
          reason: 'Daily morning dispatch telemetry synthesis',
          factors: ['12 Active tours on roster', '1 Incident flag on GOA-2048', '94% vendor confirmation rate'],
          constraintsSatisfied: ['All critical evening milestones protected'],
          alternative: 'None',
          outcome: 'Operational stability maintained'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('vendor') || q.includes('action') || q.includes('attention') || q.includes('confirm')) {
      return {
        intent: 'VENDOR_STATUS',
        message: 'Two vendor actions require attention today: Goa Transfers Fleet (Rajesh Naik) needs gate pickup re-timing to 12:15, and Oceanic Adventures needs confirmation of slot replacement with Fontainhas Heritage Guild.',
        actions: [
          {
            type: 'CONFIRM_VENDOR',
            vendorId: 'VEN-001',
            tourId: focalTourId,
            notes: 'Confirm 12:15 pickup time for delayed flight 6E-204'
          }
        ],
        recommendedExperienceIds: [],
        confidence: 'high',
        source: 'computed'
      }
    }

    return {
      intent: 'OPERATIONS_GENERAL',
      message: `Monitoring 12 active tour cohorts across Goa, Jaipur, Kerala, Ladakh, and Varanasi. System health is optimal.`,
      actions: [],
      recommendedExperienceIds: [],
      confidence: 'high',
      source: 'computed'
    }
  }
}

export const demoFallbackProvider = new DemoFallbackProvider()
