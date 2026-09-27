import { allExperiences, getExperiencesByDestination } from '../data/experiences.js'

/**
 * Client-Side Deterministic & Dynamic Natural Language Reasoning Engine
 * Provides rich, context-aware, dynamic responses, destination spot recommendations,
 * interest match scoring, schedule impact analysis, and action proposals.
 */

export class ClientDemoFallbackProvider {
  ask({ role = 'traveler', message = '', context = {} }) {
    const q = (message || '').toLowerCase().trim()

    if (role === 'operator') {
      return this.handleOperatorQuery(q, context, message)
    }
    return this.handleTravelerQuery(q, context, message)
  }

  // ==========================================
  // TRAVELER INTEL ENGINE
  // ==========================================
  handleTravelerQuery(q, ctx, originalMessage) {
    const isDisruptionActive = ctx.disruption?.isActive || false
    const budgetTotal = ctx.trip?.budget?.total || ctx.budget?.total || 35000
    const budgetEstimated = ctx.trip?.budget?.estimatedCost || ctx.budget?.estimatedCost || 34620
    const budgetRemaining = ctx.trip?.budget?.remainingBuffer || ctx.budget?.remainingBuffer || (budgetTotal - budgetEstimated)
    const activeDestination = ctx.trip?.destination || ctx.destination || 'Goa, India'
    const durationDays = ctx.trip?.durationDays || ctx.durationDays || 4
    const travelers = ctx.trip?.travelers || { adults: 2, total: 2 }
    const healthScore = ctx.journeyHealth?.score || 94
    const itineraryDays = ctx.itineraryDays || []
    const userInterests = ctx.trip?.interests || ['culture', 'food', 'photography', 'history', 'adventure', 'beaches']

    // ----------------------------------------------------------------------
    // 0. FAMOUS SPOTS / DESTINATION PLACES / ATTRACTIONS RECOMMENDATION QUERY
    // (e.g. "famous spots in jaipur", "places to visit in goa", "spots in kerala", "top spots", "attractions")
    // ----------------------------------------------------------------------
    const isSpotQuery = (/\b(spots?|places?|attractions?|sights?|things to do|what to do|what to see|must visit|explore)\b/i.test(q) || q.includes('famous in')) &&
      !q.includes('replace') && 
      !q.includes('why') &&
      !q.includes('cancel')

    // Detect target destination from query or fallback to active trip destination
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
        // Calculate Interest Match %, Budget Fit, and Schedule Impact for each spot
        const scoredSpots = candidateExperiences.map(exp => {
          // Calculate interest overlap and deduplicate
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

        // Format detailed spot listings in clean human format without markdown asterisks
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
          success: true,
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

    // ----------------------------------------------------
    // 1. SPECIFIC DAY QUERIES (e.g. "What are we doing on Day 1?", "Day 2 schedule", "Day 3")
    // ----------------------------------------------------
    const dayMatch = q.match(/day\s*(\d+)/i) || (q.includes('today') ? [, '1'] : (q.includes('tomorrow') ? [, '2'] : null))
    if (dayMatch && !q.includes('more relaxed') && !q.includes('make day') && !q.includes('change day')) {
      const dayNum = parseInt(dayMatch[1], 10)
      const dayData = itineraryDays.find(d => d.day === dayNum) || itineraryDays[dayNum - 1]

      if (dayData) {
        const items = dayData.items || []
        const itemListStr = items.length > 0 
          ? items.map(i => `• ${i.startTime || '09:00'} - ${i.endTime || '12:00'}: ${i.title} (${i.intensity || 'moderate'} intensity, ₹${(i.cost || 0).toLocaleString('en-IN')})`).join('\n')
          : 'Leisure and exploration day with unallocated flexibility buffers.'

        return {
          success: true,
          intent: 'DAY_SCHEDULE_QUERY',
          message: `Here is your schedule for Day ${dayNum} (${dayData.theme || dayData.title || 'Excursions & Leisure'}):\n\n${itemListStr}\n\nYou have healthy buffer windows between transfers. Would you like to adjust any activity or pacing for this day?`,
          actions: [],
          recommendedExperienceIds: items.map(i => i.id).filter(Boolean),
          explanation: {
            title: `Day ${dayNum} Blueprint`,
            reason: `Schedule retrieved from active itinerary.`,
            factors: [`${items.length} scheduled experiences`, `Theme: ${dayData.theme || 'Coastal & Cultural'}`],
            constraintsSatisfied: ['Buffer preservation', 'Zero transit overlaps'],
            outcome: `Day ${dayNum} operational schedule verified.`
          },
          confidence: 'high',
          source: 'computed'
        }
      }
    }

    // ----------------------------------------------------
    // 2. DISRUPTION / SCUBA / SUNSET CRUISE EXPLANATIONS
    // ----------------------------------------------------
    if (q.includes('scuba') && (q.includes('replace') || q.includes('why') || q.includes('cancel') || q.includes('what happened') || q.includes('change'))) {
      return {
        success: true,
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

    if (q.includes('sunset') || q.includes('cruise') || (q.includes('why') && q.includes('unchanged'))) {
      return {
        success: true,
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

    if (isDisruptionActive && (q.includes('disruption') || q.includes('delay') || q.includes('flight') || q.includes('recovery'))) {
      return {
        success: true,
        intent: 'EXPLAIN_DISRUPTION',
        message: 'Your inbound flight 6E-204 from Mumbai is delayed by 90 minutes. Our automated recovery engine adjusted your Day 1 airport pickup to 12:15 and recommended swapping the long scuba dive for the Fontainhas Heritage Walk to ensure you comfortably make the 18:45 sunset cruise.',
        actions: [
          {
            type: 'REPLACE_EXPERIENCE',
            removeExperienceId: 'goa-scuba-dive',
            addExperienceId: 'goa-fontainhas-heritage-walk',
            day: 1,
            reason: 'Absorbs flight delay deficit and protects evening catamaran slot.'
          }
        ],
        recommendedExperienceIds: ['goa-fontainhas-heritage-walk'],
        explanation: {
          title: 'Flight Delay Recovery Assessment',
          reason: 'Inbound delay of 90 minutes accommodated without loss of evening experiences.',
          factors: ['Pickup retimed to 12:15', 'Check-in: 13:15', 'Cruise: 18:45 on schedule'],
          constraintsSatisfied: ['All milestone connections secured'],
          outcome: 'Plan B Recovery Ready'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 3. BUDGET / COST / PRICE QUERIES & MODIFICATIONS
    // ----------------------------------------------------
    const budgetChangeMatch = q.match(/(?:change|set|update|make|increase|decrease)\s+(?:the\s+)?budget\s+(?:to\s+)?(?:₹|rs\.?|inr\s*)?(\d+)(k)?/i) ||
      q.match(/budget\s+(?:to\s+)?(?:₹|rs\.?|inr\s*)?(\d+)(k)?/i)

    if (budgetChangeMatch && (q.includes('set') || q.includes('change') || q.includes('update') || q.includes('make') || q.includes('increase') || q.includes('decrease') || q.includes('to'))) {
      let targetAmount = parseInt(budgetChangeMatch[1], 10)
      if (budgetChangeMatch[2] && budgetChangeMatch[2].toLowerCase() === 'k') {
        targetAmount *= 1000
      }
      if (targetAmount >= 5000 && targetAmount <= 500000) {
        return {
          success: true,
          intent: 'MODIFY_BUDGET',
          message: `I can update your target trip budget from ₹${budgetTotal.toLocaleString('en-IN')} to ₹${targetAmount.toLocaleString('en-IN')}. This gives you ₹${(targetAmount - budgetEstimated).toLocaleString('en-IN')} in remaining flexibility buffer.`,
          actions: [
            {
              type: 'MODIFY_BUDGET',
              amount: targetAmount,
              reason: `Adjusted target budget to ₹${targetAmount.toLocaleString('en-IN')} as requested.`
            }
          ],
          recommendedExperienceIds: [],
          explanation: {
            title: 'Trip Budget Calibration',
            reason: `Traveler requested new budget ceiling of ₹${targetAmount.toLocaleString('en-IN')}.`,
            factors: [`Previous budget: ₹${budgetTotal.toLocaleString('en-IN')}`, `Estimated cost: ₹${budgetEstimated.toLocaleString('en-IN')}`],
            constraintsSatisfied: ['Valid budget range ₹5,000 - ₹5,00,000'],
            outcome: `Budget buffer recalculated to ₹${(targetAmount - budgetEstimated).toLocaleString('en-IN')}`
          },
          confidence: 'high',
          source: 'computed'
        }
      }
    }

    if (q.includes('budget') || q.includes('cost') || q.includes('money') || q.includes('expense') || q.includes('spend') || q.includes('price') || q.includes('left') || q.includes('remaining')) {
      const isOver = budgetEstimated > budgetTotal
      return {
        success: true,
        intent: 'BUDGET_QUERY',
        message: `Your total trip budget is ₹${budgetTotal.toLocaleString('en-IN')}. The current estimated total for accommodations, experiences, and transfers is ₹${budgetEstimated.toLocaleString('en-IN')}. You have ₹${Math.abs(budgetRemaining).toLocaleString('en-IN')} ${isOver ? 'over allocated budget' : 'in unallocated buffer'}.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Financial Breakdown',
          reason: 'Real-time allocation analysis.',
          factors: [
            `Total Budget: ₹${budgetTotal.toLocaleString('en-IN')}`,
            `Committed Cost: ₹${budgetEstimated.toLocaleString('en-IN')}`,
            `Remaining Cushion: ₹${budgetRemaining.toLocaleString('en-IN')}`
          ],
          constraintsSatisfied: [isOver ? 'Budget review suggested' : 'Within target financial limits'],
          outcome: 'Budget calculations verified.'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 4. PACING & RELAXED / ACTIVE ADJUSTMENTS
    // ----------------------------------------------------
    if (q.includes('relaxed') || q.includes('slow') || q.includes('leisure') || q.includes('less rush') || q.includes('more time')) {
      const targetDay = dayMatch ? parseInt(dayMatch[1], 10) : 2
      return {
        success: true,
        intent: 'MODIFY_PACING',
        message: `I can adjust Day ${targetDay} pacing to a relaxed rhythm by adding 45 minutes of beachside leisure and spacing out the afternoon excursions.`,
        actions: [
          {
            type: 'MODIFY_PACING',
            pace: 'relaxed',
            reason: `Applied relaxed pacing for Day ${targetDay} with expanded buffer windows.`
          }
        ],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Pacing Optimization',
          reason: 'Switch pacing profile to relaxed',
          factors: ['Adds 45 min rest window', 'Lowers physical fatigue score', 'Expands leisure buffer'],
          constraintsSatisfied: ['Total trip duration maintained'],
          alternative: 'Keep balanced pace',
          outcome: 'Relaxed itinerary profile activated'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('active') || q.includes('fast') || q.includes('adventure') || q.includes('packed') || q.includes('more activities')) {
      return {
        success: true,
        intent: 'MODIFY_PACING',
        message: 'I can adjust your journey pacing to an active rhythm, adding high-engagement excursions and optimizing transit windows between sights.',
        actions: [
          {
            type: 'MODIFY_PACING',
            pace: 'fast-paced',
            reason: 'Traveler requested active adventure rhythm.'
          }
        ],
        recommendedExperienceIds: ['goa-baga-watersports', 'goa-dudhsagar-waterfall-trek'],
        explanation: {
          title: 'Active Adventure Mode',
          reason: 'Switch pacing profile to fast-paced',
          factors: ['Maximizes daily experiences', 'Optimizes transit times'],
          constraintsSatisfied: ['Safety buffer preserved'],
          outcome: 'Active itinerary generated'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 5. EXPERIENCE ADDITION / REPLACEMENT / REMOVAL
    // ----------------------------------------------------
    const matchedExp = allExperiences.find(exp => 
      q.includes(exp.title.toLowerCase()) || 
      (exp.id.includes('amber') && q.includes('amber')) ||
      (exp.id.includes('hawa') && q.includes('hawa mahal')) ||
      (exp.id.includes('johari') && q.includes('johari')) ||
      (exp.id.includes('chokhi') && q.includes('chokhi')) ||
      (exp.id.includes('houseboat') && q.includes('houseboat')) ||
      (exp.id.includes('munnar') && q.includes('munnar')) ||
      (exp.id.includes('dune') && q.includes('safari')) ||
      (exp.id.includes('burj') && q.includes('burj')) ||
      (exp.id.includes('cloud') && q.includes('gardens')) ||
      (exp.id.includes('spice') && (q.includes('spice') || q.includes('plantation'))) ||
      (exp.id.includes('waterfall') && (q.includes('waterfall') || q.includes('dudhsagar'))) ||
      (exp.id.includes('scuba') && q.includes('scuba')) ||
      (exp.id.includes('fontainhas') && (q.includes('fontainhas') || q.includes('heritage walk') || q.includes('latin quarter'))) ||
      (exp.id.includes('watersports') && (q.includes('jet ski') || q.includes('parasailing') || q.includes('watersports') || q.includes('water sports'))) ||
      (exp.id.includes('cabo') && (q.includes('cabo') || q.includes('fort sunset') || q.includes('secret cove'))) ||
      (exp.id.includes('cruise') && (q.includes('cruise') || q.includes('catamaran')))
    )

    if (matchedExp && (q.includes('add') || q.includes('include') || q.includes('book') || q.includes('can i do') || q.includes('want to do') || q.includes('suggest'))) {
      return {
        success: true,
        intent: 'ADD_EXPERIENCE',
        message: `"${matchedExp.title}" is an excellent match for your journey! It lasts ~${matchedExp.durationHours} hours and costs ₹${matchedExp.pricePerPerson.toLocaleString('en-IN')}/person. It features: ${matchedExp.highlights ? matchedExp.highlights.slice(0, 2).join(' and ') : matchedExp.description}. Would you like me to add it to your itinerary?`,
        actions: [
          {
            type: 'ADD_EXPERIENCE',
            experienceId: matchedExp.id,
            experience: matchedExp,
            reason: `Add ${matchedExp.title} to journey blueprint.`
          }
        ],
        recommendedExperienceIds: [matchedExp.id],
        explanation: {
          title: `Experience Recommendation: ${matchedExp.title}`,
          reason: `High interest alignment with ${matchedExp.category} and ${matchedExp.pace} pacing.`,
          factors: [`Duration: ${matchedExp.durationHours}h`, `Price: ₹${matchedExp.pricePerPerson}/person`, `Rating: ${matchedExp.rating}★`],
          constraintsSatisfied: ['Catalog item verified', 'Slots available'],
          outcome: `Ready to attach to Day ${dayMatch ? dayMatch[1] : '2'}`
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    if (matchedExp && (q.includes('remove') || q.includes('delete') || q.includes('drop'))) {
      return {
        success: true,
        intent: 'REMOVE_EXPERIENCE',
        message: `I can remove "${matchedExp.title}" from your active journey. This will free up approximately ${matchedExp.durationHours} hours of relaxation buffer and reduce costs by ₹${matchedExp.pricePerPerson.toLocaleString('en-IN')}/person.`,
        actions: [
          {
            type: 'REMOVE_EXPERIENCE',
            experienceId: matchedExp.id,
            reason: `Remove ${matchedExp.title} to free up buffer time.`
          }
        ],
        recommendedExperienceIds: [],
        explanation: {
          title: `Remove ${matchedExp.title}`,
          reason: 'Traveler requested activity removal.',
          factors: [`Reclaims ${matchedExp.durationHours}h flexibility buffer`],
          constraintsSatisfied: ['No cancellation penalty'],
          outcome: 'Itinerary buffer expanded'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 6. LOGISTICS, DRIVER, GUIDE & HOTEL DETAILS
    // ----------------------------------------------------
    if (q.includes('driver') || q.includes('car') || q.includes('cab') || q.includes('pickup') || q.includes('transfer') || q.includes('rajesh') || q.includes('taxi')) {
      return {
        success: true,
        intent: 'LOGISTICS_QUERY',
        message: `Your private airport transfer and local transit in ${activeDestination} is handled by Goa Transfers Fleet. Your assigned chauffeur is Rajesh Naik (+91 98221 44821) in a sanitized Toyota Innova Crysta. All pickup times are synchronized with your flight telemetry.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Ground Logistics Verification',
          reason: 'Driver assignment verified with Goa Dispatch Hub.',
          factors: ['Driver: Rajesh Naik', 'Vehicle: Innova Crysta (GA-03-N-4421)', 'Status: Confirmed'],
          constraintsSatisfied: ['Flight-tracking enabled'],
          outcome: 'Logistics ready'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('hotel') || q.includes('stay') || q.includes('villa') || q.includes('checkin') || q.includes('check-in') || q.includes('accommodation') || q.includes('casa sol')) {
      return {
        success: true,
        intent: 'ACCOMMODATION_QUERY',
        message: `You are staying at Casa Sol Heritage Villa in Candolim, North Goa. Check-in is prepared with welcome refreshments, high-speed Wi-Fi, and private plunge pool access. Your villa host Maria D'Souza is expecting your arrival.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Accommodation Details',
          reason: 'Booking confirmed under Navora Gold Tier.',
          factors: ['Property: Casa Sol Heritage Villa', 'Location: Candolim, North Goa', 'Room: Premium Portuguese Suite'],
          constraintsSatisfied: ['Flexible late check-in buffer secured'],
          outcome: 'Hotel reservation active'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 7. WEATHER, FOOD, DINING & LOCAL RECOMMENDATIONS
    // ----------------------------------------------------
    if (q.includes('weather') || q.includes('rain') || q.includes('climate') || q.includes('temperature') || q.includes('forecast')) {
      return {
        success: true,
        intent: 'WEATHER_QUERY',
        message: `The weather in ${activeDestination} is currently pleasant and sunny with a high of 29°C and gentle coastal breezes in the evening. UV levels are moderate, making late afternoons ideal for outdoor walking tours and catamaran cruises.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('food') || q.includes('restaurant') || q.includes('eat') || q.includes('dinner') || q.includes('lunch') || q.includes('cafe') || q.includes('dining') || q.includes('dish')) {
      return {
        success: true,
        intent: 'DINING_RECOMMENDATION',
        message: `For authentic dining near your itinerary stops, we highly recommend:\n• Fisherman's Wharf (Panjim) for fresh Kingfish Recheado & Butter Garlic Prawns\n• Confeitaria 31 de Janeiro in Fontainhas for traditional Bebinca & Poi bread\n• Thalassa or Pisco by the Beach for golden hour sunset dining with sea views.`,
        actions: [],
        recommendedExperienceIds: ['goa-fontainhas-heritage-walk'],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 8. TRIP HEALTH, FLEXIBILITY & RISK QUERIES
    // ----------------------------------------------------
    if (q.includes('health') || q.includes('score') || q.includes('status') || q.includes('safe')) {
      return {
        success: true,
        intent: 'HEALTH_QUERY',
        message: `Your journey health score is ${healthScore}/100 (Optimal). All core travel segments have verified buffer windows, physical fatigue distribution is well-balanced across all ${durationDays} days, and zero cancellation risks are present.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Journey Health Telemetry',
          reason: 'Continuous diagnostic evaluation of itinerary safety and buffer times.',
          factors: ['Fatigue index: Low', 'Schedule overlap: 0%', 'Buffer ratio: 24%'],
          constraintsSatisfied: ['All travel health guardrails satisfied'],
          outcome: 'Optimal journey state'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('flexible') || q.includes('flexibility') || q.includes('fixed')) {
      const buffer = ctx.flexibility?.bufferFormatted || '2h 15m'
      return {
        success: true,
        intent: 'FLEXIBILITY_QUERY',
        message: `You currently have ${buffer} of flexible buffer across your trip (${ctx.flexibility?.percentage || 78}% flexibility rating). Afternoon leisure and cultural walks are highly flexible, while airport transfers, villa check-in, and the private catamaran cruise are fixed critical milestones.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('learn') || q.includes('memory') || q.includes('preference')) {
      return {
        success: true,
        intent: 'MEMORY_QUERY',
        message: `Based on your itinerary selections and travel style, I have learned that you value authentic culinary experiences, coastal heritage walks, and unhurried evening dinners with protected buffer windows for ${travelers.total || 2} travelers.`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 9. GREETINGS & GENERAL CONVERSATION
    // ----------------------------------------------------
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'help' || q.startsWith('hi ') || q.startsWith('hello ')) {
      return {
        success: true,
        intent: 'GREETING',
        message: `Hello! I'm your Navora Journey Assistant. I'm actively monitoring your ${durationDays}-day trip to ${activeDestination}. You can ask me to adjust pacing, explore famous spots in Jaipur/Goa/Kerala, breakdown your budget, or explain any schedule detail. How can I help you right now?`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    if (q.includes('thank') || q.includes('awesome') || q.includes('great') || q.includes('cool') || q.includes('perfect')) {
      return {
        success: true,
        intent: 'ACKNOWLEDGEMENT',
        message: `You're very welcome! I'll continue keeping your ${activeDestination} itinerary protected, flexible, and perfectly synchronized. Enjoy your journey!`,
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // ----------------------------------------------------
    // 10. INTELLIGENT DYNAMIC CATCH-ALL
    // ----------------------------------------------------
    const destExperiences = getExperiencesByDestination(activeDestination)
    const topExpNames = destExperiences.slice(0, 3).map(e => e.title).join(', ')
    return {
      success: true,
      intent: 'DYNAMIC_QUERY_HANDLED',
      message: `I've analyzed your query regarding your ${activeDestination} journey (${durationDays} days for ${travelers.total || 2} travelers). Your itinerary is currently on track with ₹${budgetRemaining.toLocaleString('en-IN')} in remaining buffer and a health score of ${healthScore}/100. Top experiences in your destination include ${topExpNames}. Feel free to ask me for famous spots, schedule changes, or budget advice!`,
      actions: [],
      recommendedExperienceIds: destExperiences.slice(0, 2).map(e => e.id),
      explanation: null,
      confidence: 'high',
      source: 'computed'
    }
  }

  // ==========================================
  // OPERATOR INTEL ENGINE
  // ==========================================
  handleOperatorQuery(q, ctx, originalMessage) {
    const focalTourId = ctx.activeTour?.id || ctx.focalTour?.id || 'GOA-2048'
    const isDisruption = ctx.disruptions?.length > 0 || ctx.disruption?.isActive || false

    // 1. Summarize operations
    if (q.includes('summar') || q.includes('today') || q.includes('overview') || q.includes('status') || q.includes('dashboard')) {
      return {
        success: true,
        intent: 'OPERATIONS_SUMMARY',
        message: `${focalTourId} has ${isDisruption ? 'one active disruption' : 'all systems operational'}. The 90-minute inbound delay on Flight 6E-204 shifted airport transfer and hotel check-in times. The sunset cruise and dinner remain strictly protected. Two vendor actions are currently in the queue.`,
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

    // 2. Which vendors need action?
    if (q.includes('vendor') || q.includes('action') || q.includes('attention') || q.includes('confirm') || q.includes('driver')) {
      return {
        success: true,
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
        explanation: {
          title: 'Vendor Action Queue',
          reason: 'Time-sensitive ground coordination required to prevent guest waiting at arrival gate.',
          factors: ['Driver assigned: Rajesh Naik (+91 98221 44821)', 'Villa Host notified: Maria D\'Souza'],
          constraintsSatisfied: ['Transfer ready on tarmac touchdown'],
          alternative: 'Manual telephone dispatch',
          outcome: 'Automated vendor dispatch trigger prepared'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // 3. Explain disruption
    if (q.includes('disruption') || q.includes('delay') || q.includes('flight') || q.includes('incident') || q.includes('scuba')) {
      return {
        success: true,
        intent: 'DISRUPTION_ANALYSIS',
        message: 'Flight 6E-204 from Mumbai (BOM) to Goa (GOI) is delayed by 90 minutes due to air traffic hold. Arrival moved from 09:20 to 10:50. This creates an afternoon schedule deficit affecting the 4.5-hour scuba session, while evening catamaran cruise and riverside dining remain unaffected.',
        actions: [
          {
            type: 'APPLY_RECOVERY',
            tourId: focalTourId,
            planId: 'B'
          }
        ],
        recommendedExperienceIds: [],
        explanation: {
          title: 'Incident Analysis: DIS-2024-001',
          reason: 'Inbound flight delay ripple propagation',
          factors: ['90m Flight delay', 'Transfer shifted to 12:15', 'Check-in shifted to 13:15'],
          constraintsSatisfied: ['Evening cruise window (18:45) protected'],
          alternative: 'Plan A (Defer activities to Day 2)',
          outcome: 'Plan B Balanced Recovery recommended'
        },
        confidence: 'high',
        source: 'computed'
      }
    }

    // 4. Prepare traveler update
    if (q.includes('notification') || q.includes('update') || q.includes('message') || q.includes('whatsapp') || q.includes('traveler') || q.includes('guest') || q.includes('sms')) {
      return {
        success: true,
        intent: 'NOTIFICATION_PREPARE',
        message: 'Prepared WhatsApp and in-app traveler update for Aryan & Riya Sharma: Informing them that driver Rajesh Naik will greet them at Goa Airport at 12:15 with luggage assistance, and welcome drinks are arranged at Casa Sol Villa.',
        actions: [
          {
            type: 'PREPARE_NOTIFICATION',
            tourId: focalTourId,
            channel: 'whatsapp',
            text: 'Hi Aryan & Riya! We tracked your flight delay. Your driver Rajesh is confirmed for 12:15 gate pickup. Casa Sol check-in is prepared!'
          }
        ],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // 5. Remaining risks & health
    if (q.includes('risk') || q.includes('health') || q.includes('sla') || q.includes('fleet')) {
      return {
        success: true,
        intent: 'RISK_ASSESSMENT',
        message: 'Current operational risk index is low (94/100 readiness). Weather conditions across Goa, Jaipur, and Kerala hubs are clear. The only active risk is delayed tarmac transfer on GOA-2048, which is fully insulated by Plan B recovery.',
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'high',
        source: 'computed'
      }
    }

    // Default operator response
    return {
      success: true,
      intent: 'OPERATIONS_GENERAL',
      message: `Monitoring 12 active tour cohorts across Goa, Jaipur, Kerala, Ladakh, and Varanasi. System health is optimal with 1 active incident under automated recovery supervision. Telemetry and vendor links are live.`,
      actions: [],
      recommendedExperienceIds: [],
      explanation: null,
      confidence: 'high',
      source: 'computed'
    }
  }
}

export const clientFallback = new ClientDemoFallbackProvider()
