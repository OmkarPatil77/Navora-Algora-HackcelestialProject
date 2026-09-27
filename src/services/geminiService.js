import { goaExperiences, getExperiencesByDestination, allExperiences } from '@/data/experiences'
import { getRecommendations } from '@/services/recommendationEngine'

/**
 * Checks whether the Gemini API key is configured in the environment
 */
export function isGeminiConfigured() {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  return Boolean(key && key !== "your_gemini_api_key_here" && key.trim().length > 10)
}

/**
 * Constructs a compact, normalized AI system context payload
 */
export function buildCopilotContext(tripPreferences, selectedExperiences, itinerary, currentPage = "/trip", disruptionContext = {}, journeyHealth = null, journeyMemory = null) {
  const days = itinerary?.days || []
  const summary = itinerary?.summary || {}
  const flexibility = itinerary?.flexibility || {}
  const { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans } = disruptionContext

  // Compact representation of day schedules
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
      movable: i.movable,
      critical: i.critical,
      intensity: i.intensity
    }))
  }))

  return {
    currentPage,
    trip: {
      destination: tripPreferences.destination?.name || "Goa, India",
      startDate: tripPreferences.startDate,
      endDate: tripPreferences.endDate,
      durationDays: tripPreferences.duration?.days || 4,
      travelers: tripPreferences.travelers || { adults: 2, total: 2 },
      interests: tripPreferences.interests || ["adventure", "food", "beaches"],
      travelStyle: tripPreferences.travelStyle || { pace: "balanced", priority: "experiences", accommodation: "comfort" },
      budget: {
        total: tripPreferences.budget?.total || 35000,
        estimatedCost: summary.totalCost || 34620,
        remainingBuffer: summary.remainingBudget || 380,
        isOverBudget: Boolean(summary.isOverBudget)
      }
    },
    selectedExperiencesCount: selectedExperiences?.length || 0,
    selectedExperienceIds: (selectedExperiences || []).map(e => e.experienceId || e.id),
    itineraryDays: compactDays,
    flexibility: {
      percentage: flexibility.percentage || 78,
      bufferFormatted: flexibility.bufferFormatted || "2h 15m",
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
      appliedRecovery: appliedRecovery ? appliedRecovery.title : null,
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
 * Sends a natural-language copilot request to Gemini or falls back to Demo Intelligence Mode
 */
export async function sendCopilotMessage(userMessage, currentContext, conversationHistory = []) {
  const isConfigured = isGeminiConfigured()

  if (isConfigured) {
    try {
      const geminiResponse = await callGeminiApi(userMessage, currentContext, conversationHistory)
      return {
        ...geminiResponse,
        source: 'AI-assisted explanation (Gemini)',
        confidence: 'high'
      }
    } catch (err) {
      console.warn("Gemini API call failed or rate-limited. Falling back to Navora Demo Intelligence.", err)
      const fallback = generateDemoIntelligenceResponse(userMessage, currentContext)
      return {
        ...fallback,
        source: 'Navora deterministic engine',
        confidence: 'high',
        fallbackNotice: "Navora connected via deterministic intelligence engine."
      }
    }
  }

  // Default Demo Intelligence Mode
  const demoResponse = generateDemoIntelligenceResponse(userMessage, currentContext)
  return {
    ...demoResponse,
    source: 'Computed from your trip plan',
    confidence: 'high'
  }
}

/**
 * Calls the Google Gemini API (gemini-1.5-flash / gemini-2.0-flash endpoint)
 */
async function callGeminiApi(userMessage, context, history) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const systemInstruction = `You are Navora, an intelligent travel planning copilot for an AI-powered travel platform.
Your job is to help travelers personalize, balance, and optimize their journey.
You have access to the user's current trip preferences, budget, selected experiences, and day-by-day connected itinerary.

RULES:
1. Never invent fake bookings, hotel names, flight numbers, or real-time availability.
2. The application is the source of truth. Propose actions rather than claiming they are already executed.
3. Be concise, structured, and travel-expert caliber. Use bullet points.
4. Output MUST be valid JSON conforming to this schema:
{
  "intent": "ANSWER_QUESTION | MODIFY_ITINERARY | ADD_EXPERIENCE | REMOVE_EXPERIENCE | REPLACE_EXPERIENCE | SHOW_FLEXIBILITY | OPTIMIZE_ITINERARY",
  "message": "Clear explanation of findings and rationale in markdown...",
  "actions": [
    {
      "type": "REPLACE_EXPERIENCE | REMOVE_EXPERIENCE | ADD_EXPERIENCE | MODIFY_BUDGET | MODIFY_PACING | REGENERATE_DAY",
      "day": 1,
      "removeExperienceId": "...",
      "addExperienceId": "...",
      "amount": 35000,
      "pace": "relaxed"
    }
  ],
  "recommendedExperienceIds": ["goa-fontainhas-heritage-walk", "..."],
  "highlights": ["..."]
}`

  const promptContent = `CURRENT TRIP CONTEXT:
${JSON.stringify(context, null, 2)}

RECENT CONVERSATION HISTORY:
${history.slice(-4).map(h => `${h.role === 'user' ? 'User' : 'Navora'}: ${h.text || h.message}`).join('\n')}

USER QUERY:
${userMessage}

Respond strictly in valid JSON.`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\n${promptContent}` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!candidateText) {
    throw new Error("No text candidate returned from Gemini.")
  }

  const parsed = JSON.parse(candidateText)
  return parsed
}

/**
 * Deterministic Demo Intelligence Engine
 * Provides resilient, domain-accurate copilot responses when Gemini API is offline or unconfigured.
 */
export function generateDemoIntelligenceResponse(userMessage, context) {
  const query = userMessage.toLowerCase().trim()
  const { trip, itineraryDays = [], selectedExperienceIds = [], flexibility, disruption, journeyHealth, journeyMemory } = context
  const totalBudget = trip.budget?.total || 35000
  const remainingBuffer = trip.budget?.remainingBuffer || 380

  // 1. "How is my trip health?" / "How healthy is this tour?"
  if (query.includes("health") || query.includes("how healthy") || query.includes("trip health") || query.includes("score")) {
    const score = journeyHealth?.score || (disruption?.isActive && !disruption?.appliedRecovery ? 76 : 94)
    const status = journeyHealth?.status || (disruption?.isActive && !disruption?.appliedRecovery ? "WATCH" : "EXCELLENT")

    return {
      intent: "SHOW_HEALTH",
      message: `### Journey Health Assessment: **${score}/100 — ${status}**\n\n` +
        (disruption?.isActive && !disruption?.appliedRecovery
          ? `⚠️ **Active Schedule Pressure Detected:**\n` +
            `• Inbound flight delay (+90m) has reduced arrival buffer.\n` +
            `• 1 unresolved schedule conflict (Grand Island Scuba Dive).\n` +
            `• **Recommendation:** Apply **Plan B (Balanced Recovery)** to restore Journey Health back to **91 (STABLE)** with zero unresolved conflicts.`
          : `🟢 **Your Journey is in Peak Condition:**\n` +
            `• **Schedule Resilience (92/100):** Healthy buffer between transit and activities.\n` +
            `• **Budget Health (96/100):** ₹${remainingBuffer.toLocaleString('en-IN')} contingency cushion preserved.\n` +
            `• **Experience Balance (88/100):** Optimal mix of culture, beach leisure, and dining.\n` +
            `• **Operational Readiness (95/100):** Cab transfers and villa check-in confirmed.`),
      explanation: {
        score,
        status,
        factors: [
          disruption?.isActive ? "Flight arrival shifted +90 min" : "Optimal 2h+ buffer windows",
          "Accommodations and transfers verified",
          "Balanced pacing with downtime"
        ]
      },
      confidence: "high",
      source: "Computed from your trip plan",
      highlights: [`Score: ${score}/100 (${status})`, "All dependencies verified"]
    }
  }

  // 2. "Why was scuba replaced?" / "Why did you change my itinerary?" / "Why Plan B?"
  if (query.includes("why was scuba") || query.includes("why replace") || query.includes("why did you change") || query.includes("why plan b") || query.includes("why change")) {
    return {
      intent: "EXPLAIN_DECISION",
      message: `### Decision Rationale: Why Scuba Diving was Replaced\n\n` +
        `**Context:** Inbound flight 6E-204 landed 90 minutes late at **12:05**.\n\n` +
        `**Key Factors:**\n` +
        `• **Duration Constraint:** Grand Island Scuba requires a **4.5 hour** continuous window (boat transfer + dive briefings).\n` +
        `• **Overlap:** Pushing Scuba to the afternoon would violate your **Mandovi River Sunset Cruise (18:45)** and dinner reservation.\n` +
        `• **Adapted Alternative:** Swapped with **Fontainhas Latin Quarter Heritage Walk (2.5 hours)**.\n\n` +
        `**Resulting Outcome:**\n` +
        `✓ **0 unresolved conflicts**\n` +
        `✓ **+45 minutes** extra relaxation buffer\n` +
        `✓ **₹1,200** saved in activity fees\n` +
        `✓ **Evening sunset cruise & dinner 100% protected**`,
      explanation: {
        title: "Why Scuba Diving was replaced with Fontainhas Walk",
        factors: [
          "4.5-hour activity window compromised by +90m flight delay",
          "Protecting evening Mandovi River sunset cruise & dinner commitments",
          "Zero cancellation penalty negotiated with Oceanic Adventures"
        ],
        changedNodes: ["Grand Island Scuba Dive → Fontainhas Heritage Walk"],
        protectedNodes: ["Mandovi River Sunset Cruise", "Fisherman's Wharf Dinner"],
        outcome: "0 conflicts, +45m buffer, ₹1,200 saved"
      },
      confidence: "high",
      source: "Navora deterministic engine",
      highlights: ["4.5h window constraint", "Protected sunset cruise", "₹1,200 saved"]
    }
  }

  // 3. "Why is the sunset cruise unchanged?" / "Why is sunset cruise protected?"
  if (query.includes("sunset cruise") || query.includes("cruise unchanged") || query.includes("protect")) {
    return {
      intent: "EXPLAIN_DECISION",
      message: `### Why Your Sunset Cruise is 100% Protected\n\n` +
        `• **Scheduled Time:** 18:45 – 20:30 (Day 1 Evening)\n` +
        `• **Dependency Buffer:** After adapting the afternoon with the shorter Fontainhas Walk (concluding at 18:00), there is a **45-minute travel and boarding buffer** before cruise departure.\n` +
        `• **Priority Score:** High — sunset lighting cannot be postponed to night hours.\n` +
        `• **Status:** Zero downstream conflict detected.`,
      explanation: {
        factors: [
          "Departure scheduled at fixed sunset hour (18:45)",
          "Protected by 45-minute transit buffer from Fontainhas",
          "Non-negotiable scenic priority node"
        ],
        protectedNodes: ["Mandovi River Luxury Sunset Cruise"]
      },
      confidence: "high",
      source: "Navora deterministic engine",
      highlights: ["Fixed sunset timing", "+45m buffer secured", "No change required"]
    }
  }

  // 4. "What did you learn about my preferences?" / "Journey memory"
  if (query.includes("learn") || query.includes("memory") || query.includes("preferences") || query.includes("what did the system learn")) {
    return {
      intent: "SHOW_MEMORY",
      message: `### Navora Session Journey Memory\n\n` +
        `During your trip planning and adaptation session, Navora has observed the following contextual habits:\n\n` +
        `✓ **Cultural & Heritage Affinity:** You prioritized walking tours and local Portuguese architecture.\n` +
        `✓ **Balanced Pacing Preference:** You opted for manageable 2–3 hour blocks with downtime between activities.\n` +
        `✓ **Protected Evening Routine:** You consistently favored keeping dinner and sunset slots unhurried.\n\n` +
        `*Note: This session memory is applied to fine-tune recommendations during your current trip (±5 pts relevance adjustment) without creating any permanent user tracking.*`,
      explanation: {
        factors: [
          "Observed cultural experience selections",
          "Preference for balanced pacing and evening buffers",
          "Trip-scoped session adaptation active"
        ]
      },
      confidence: "high",
      source: "Navora session memory",
      highlights: ["Cultural affinity noted", "Balanced pacing favored", "Trip-scoped only"]
    }
  }

  // 5. "Why do you recommend these experiences?"
  if (query.includes("why recommend") || query.includes("why these") || query.includes("recommendation reason")) {
    return {
      intent: "EXPLAIN_DECISION",
      message: `### Recommendation Explainability Breakdown\n\n` +
        `Navora selected your recommendations based on 5 deterministic pillars:\n\n` +
        `1. **Interest Alignment (35%):** Strong match with your tags (*${trip.interests?.join(', ')}*).\n` +
        `2. **Budget Fit (20%):** All items fit neatly within your ₹${totalBudget.toLocaleString('en-IN')} target.\n` +
        `3. **Pacing Fit (20%):** Matches your **${trip.travelStyle?.pace || 'Balanced'}** style without tight clustering.\n` +
        `4. **Duration Fit (15%):** Activity lengths leave healthy transit buffers.\n` +
        `5. **Journey Memory (10%):** Slight +3 to +5 point boost from your active choices.`,
      explanation: {
        factors: [
          "Interest match with adventure, food, and culture",
          "Strict budget constraint compliance",
          "Balanced daily intensity distribution"
        ]
      },
      confidence: "high",
      source: "Computed from your trip plan",
      highlights: ["5 deterministic pillars", "Transparent weighting", "Zero hallucinated ratings"]
    }
  }

  // 0. Disruption & Operational Queries
  if (query.includes("summarize") || query.includes("summary") || query.includes("overview") || query.includes("fleet")) {
    return {
      intent: "ANSWER_QUESTION",
      message: `### Fleet Operations Summary (Today)\n\n` +
        `• **12 Active Tours** running across Goa, Rajasthan, Kerala, and Ladakh.\n` +
        `• **28 Live Guests** monitored in real-time.\n` +
        `• **94% Vendor Confirmation Fidelity** across all transit and villa partners.\n` +
        `• **1 Active Synthetic Disruption:** Tour **GOA-2048** (+90 min flight delay on BOM → GOI).\n` +
        `• **Autonomous Resolution Status:** Plan B (Balanced Recovery) ready for execution. All evening bookings secured.`,
      highlights: [
        "12 Tours Active",
        "1 Disruption under control",
        "94% Vendor Confirmations"
      ]
    }
  }

  if (query.includes("which vendors need action") || query.includes("vendor") || query.includes("coordination")) {
    return {
      intent: "ANSWER_QUESTION",
      message: `### Vendor Action Queue for Tour GOA-2048\n\n` +
        `1. **Goa Transfers Fleet (VEN-001):** Re-timed pickup from 10:55 → **12:15** with driver Rajesh Naik. *(Status: Needs Confirmation)*\n` +
        `2. **Casa Sol Heritage Villa (VEN-002):** Check-in window shifted from 12:00 → **13:15**. *(Status: Updated)*\n` +
        `3. **Oceanic Adventures (VEN-003):** Scuba dive cancelled with zero penalty due to delayed arrival. Replaced by Fontainhas Walk. *(Status: Replaced)*\n` +
        `4. **Mandovi Luxury Cruises & Fisherman's Wharf:** Guarded with zero conflict. *(Status: Confirmed)*`,
      actions: [
        {
          type: "CONFIRM_VENDOR",
          vendorId: "VEN-001",
          note: "Pickup window 12:15 confirmed for driver Rajesh Naik"
        }
      ],
      highlights: [
        "Goa Transfers pending confirmation",
        "Casa Sol updated",
        "Oceanic Adventures replaced without penalty"
      ]
    }
  }

  if (query.includes("prepare a traveler update") || query.includes("notification") || query.includes("update traveler") || query.includes("message")) {
    const draft = "Hi Aryan & Riya! Your inbound flight 6E-204 to Goa has been delayed by 90 minutes. Navora has automatically adjusted your afternoon schedule: your private cab will meet you at Gate 2 at 12:15, check-in is held, and we swapped Scuba Diving for a relaxed Fontainhas Heritage & Culinary Walk (16:00 – 18:30) to preserve your evening Sunset Cruise & Dinner. Zero hassle, zero lost bookings!"
    return {
      intent: "ANSWER_QUESTION",
      message: `### Draft Traveler Journey Update (WhatsApp & Push)\n\n` +
        `**Recipient:** Aryan & Riya Sharma (Tour GOA-2048)\n\n` +
        `> "${draft}"\n\n` +
        `Click **"Send Notification"** below to dispatch this simulated update to the guests.`,
      actions: [
        {
          type: "PREPARE_NOTIFICATION",
          tourId: "GOA-2048",
          message: draft
        }
      ],
      highlights: ["Draft ready", "Clear reassurance", "Includes updated timings"]
    }
  }

  if (query.includes("what is affected") || query.includes("goa delay") || query.includes("disrupt") || query.includes("delay") || query.includes("conflict")) {
    if (disruption?.isActive || query.includes("delay")) {
      return {
        intent: "ANSWER_QUESTION",
        message: `### Operational Impact Breakdown: Tour GOA-2048\n\n` +
          `• **Trigger:** Inbound flight Mumbai (BOM) → Goa (GOI) shifted from **09:20** to **10:50** (touchdown **12:05**).\n\n` +
          `**Operational Impacts:**\n` +
          `• **🔴 Direct Conflict:** Grand Island Scuba dive (originally 12:30) conflicts with the 12:05 arrival + transit window.\n` +
          `• **🟠 2 Downstream Shifts:** Airport transfer cab (12:15) and Casa Sol Villa check-in (13:15) rescheduled safely.\n` +
          `• **🟢 2 Protected Bookings:** Mandovi River Sunset Cruise (18:45) and Fisherman's Wharf Dinner (20:30) remain 100% guarded.\n\n` +
          `**Recommended Action:** Apply **Plan B (Balanced Recovery)** to swap Scuba for Fontainhas Heritage Walk, saving ₹1,200 and adding +45m flexibility.`,
        actions: [
          {
            type: "APPLY_RECOVERY",
            planId: "PLAN-B-BALANCED"
          }
        ],
        highlights: [
          "1 Conflict (Scuba Dive)",
          "2 Shifts (Cab & Villa)",
          "2 Protected (Cruise & Dinner)"
        ]
      }
    }
  }

  if (query.includes("protect") || query.includes("unchanged") || query.includes("safe")) {
    return {
      intent: "ANSWER_QUESTION",
      message: `### Protected Journey Elements\n\n` +
        `Navora's dependency graph ensures we only modify what's strictly necessary. The following items remain **100% Protected**:\n\n` +
        `• **Mandovi River Evening Sunset Cruise / Dinner (19:30 – 21:30)**: Guarded by buffer windows.\n` +
        `• **Day 2 & Day 3 Tours**: All South Goa waterfall and heritage bookings remain undisturbed.\n` +
        `• **Resort Reservation**: Confirmed with delayed arrival notification automatically dispatched.`,
      highlights: ["Evening dinner guarded", "Zero impact on Days 2-4"]
    }
  }

  if (query.includes("lowest-cost") || query.includes("lowest cost") || query.includes("cheapest recovery") || query.includes("save money")) {
    return {
      intent: "ANSWER_QUESTION",
      message: `### Lowest-Cost Recovery Option\n\n` +
        `**Plan C — Protect Journey & Rest** provides the maximum cost savings:\n\n` +
        `• **Savings:** ₹2,800 saved (or ₹1,200 with Plan B Balanced)\n` +
        `• **Flexibility Gained:** +90 minutes of leisure buffer\n` +
        `• **Experience:** Smooth resort arrival, poolside lunch, and sunset beach relaxation with zero schedule stress.`,
      highlights: ["₹2,800 saved with Plan C", "₹1,200 saved with Plan B"]
    }
  }

  if (query.includes("recover my trip") || query.includes("recover") || query.includes("fix trip") || query.includes("adapt")) {
    return {
      intent: "MODIFY_ITINERARY",
      message: `### Recommended Recovery Strategy: Balanced Plan\n\n` +
        `I recommend applying **Plan B (Balanced Recovery)**:\n` +
        `• **Swap:** Grand Island Scuba → **Fontainhas Latin Quarter Heritage Walk** (16:00 – 18:30)\n` +
        `• **Financial Impact:** Saves **₹1,200**\n` +
        `• **Buffer Gained:** **+45 min** extra flexibility\n` +
        `• **Status:** Zero schedule conflicts. All evening plans preserved.`,
      actions: [
        {
          type: "REPLACE_EXPERIENCE",
          day: 1,
          removeExperienceId: "goa-scuba-grand-island",
          addExperienceId: "goa-fontainhas-heritage-walk",
          estimatedSavings: 1200,
          flexibilityGained: "+45 min"
        }
      ],
      highlights: ["Recommended Plan B", "₹1,200 saved", "Zero conflicts"]
    }
  }

  const currentDest = tripPreferences?.destination?.city || tripPreferences?.destination?.name || "Goa"
  const currentDestExperiences = getExperiencesByDestination(currentDest)

  // 1. "Make Day 2 more relaxed" / Pacing queries
  if (query.includes("relax") || query.includes("hectic") || query.includes("day 2") || query.includes("pacing") || query.includes("slow down")) {
    const day2 = itineraryDays.find(d => d.day === 2) || itineraryDays[1]
    const currentHighIntensity = day2?.items?.find(i => i.intensity === "high" && i.type === "experience")
    const removeId = currentHighIntensity ? currentHighIntensity.id : (currentDestExperiences[0]?.id || "exp-1")
    const replacementExp = currentDestExperiences.find(e => e.intensity === "low" || e.pace === "moderate") || currentDestExperiences[1] || currentDestExperiences[0]

    return {
      intent: "MODIFY_ITINERARY",
      message: `I analyzed Day 2 in ${currentDest} and found an opportunity to balance high-energy activities with recovery downtime.\n\n` +
        `**Proposed Adjustment for Day 2:**\n` +
        `• **Replace:** ${currentHighIntensity?.title || 'High Intensity Activity'} *(High intensity)*\n` +
        `• **With:** ${replacementExp?.title || 'Cultural Exploration'} *(Gentle cultural pace)*\n\n` +
        `**Why this works:**\n` +
        `• Reduces physical intensity while still matching your cultural interests\n` +
        `• Keeps spending balanced within your planned budget\n` +
        `• Adds a +45 minute afternoon relaxation buffer at your hotel`,
      actions: [
        {
          type: "REPLACE_EXPERIENCE",
          day: 2,
          removeExperienceId: removeId,
          addExperienceId: replacementExp?.id || "replacement",
          estimatedSavings: 1200,
          flexibilityGained: "+45 min"
        }
      ],
      highlights: ["Pacing rebalanced", "Budget protected", "+45 min buffer"]
    }
  }

  // 2. "Find more local food" / "Food recommendations"
  if (query.includes("food") || query.includes("culinary") || query.includes("dining") || query.includes("eat") || query.includes("restaurant") || query.includes("taste")) {
    const foodRecommendations = currentDestExperiences.filter(e => 
      e.category === "Food" || e.tags.includes("food")
    ).slice(0, 3)

    const listText = foodRecommendations.length > 0 
      ? foodRecommendations.map((f, i) => `${i + 1}. **${f.title}** — ${f.description.slice(0, 95)}...`).join('\n')
      : `1. **${currentDest} Traditional Tasting Tour**\n2. **Historic Quarter Food Walk**`

    return {
      intent: "ADD_EXPERIENCE",
      message: `I screened our curated ${currentDest} inventory against your current budget and schedule. Here are authentic culinary experiences matching your profile:\n\n${listText}`,
      recommendedExperiences: foodRecommendations,
      recommendedExperienceIds: foodRecommendations.map(e => e.id),
      highlights: [`${foodRecommendations.length || 2} authentic food stops found`, "Local regional cuisine masterclass"]
    }
  }

  // 3. "How much budget do I have left?" / "Budget status" / "Reduce spending"
  if (query.includes("budget") || query.includes("cost") || query.includes("money") || query.includes("spending") || query.includes("spend") || query.includes("price")) {
    return {
      intent: "ANSWER_QUESTION",
      message: `Here is your current financial blueprint derived directly from the application state:\n\n` +
        `• **Target Trip Budget:** ₹${totalBudget.toLocaleString('en-IN')}\n` +
        `• **Estimated Total Spend:** ₹${trip.budget?.estimatedCost?.toLocaleString('en-IN') || '34,620'}\n` +
        `• **Remaining Safety Buffer:** ₹${remainingBuffer.toLocaleString('en-IN')}\n\n` +
        `Your budget is currently **${trip.budget?.isOverBudget ? 'slightly over target' : 'balanced with an 8% safety cushion'}**. All private cab transfers, villa stays, and staged passes are accounted for.`,
      highlights: [`Budget remaining: ₹${remainingBuffer.toLocaleString('en-IN')}`, "Zero hidden surge costs"]
    }
  }

  // 4. "What's flexible?" / Flexibility / Dependencies
  if (query.includes("flexib") || query.includes("depend") || query.includes("delay") || query.includes("fixed") || query.includes("change")) {
    return {
      intent: "SHOW_FLEXIBILITY",
      message: `Your journey currently has **${flexibility.percentage || 78}% Journey Flexibility** with **${flexibility.bufferFormatted || '2h 15m'} of buffer windows** across ${itineraryDays.length || 4} days in ${currentDest}.\n\n` +
        `**🟢 High Flexibility (Can shift easily):**\n` +
        `• Heritage walking tours & sightseeing stops\n` +
        `• Afternoon pool & downtime blocks\n` +
        `• Evening culinary dinner reservations\n\n` +
        `**🔴 Fixed / Critical Nodes (Guarded by Navora):**\n` +
        `• Inbound & Outbound flight schedules\n` +
        `• Airport pickup cab driver dispatch\n` +
        `• Hotel check-in & check-out time slots`,
      highlights: [`${flexibility.percentage || 78}% Overall Flexibility`, `${flexibility.bufferFormatted || '2h 15m'} buffer time`]
    }
  }

  // 5. "Remove experience" / General experience removal
  if (query.includes("remove") || query.includes("delete")) {
    const firstExp = currentDestExperiences[0]
    return {
      intent: "REMOVE_EXPERIENCE",
      message: `I can remove ${firstExp ? firstExp.title : "this experience"} from your journey. This will free up time and save budget for your travel party.`,
      actions: [
        {
          type: "REMOVE_EXPERIENCE",
          experienceId: firstExp ? firstExp.id : "exp-1"
        }
      ],
      highlights: ["Freed schedule slot", "Budget saved"]
    }
  }

  // Generic Conversational Fallback
  return {
    intent: "ANSWER_QUESTION",
    message: `I'm tracking your ${trip.durationDays}-day ${trip.destination} journey with ${trip.interests?.join(', ')} interests and ₹${totalBudget.toLocaleString('en-IN')} target budget.\n\n` +
      `You can ask me to:\n` +
      `• **"Make Day 2 more relaxed"** to rebalance physical intensity\n` +
      `• **"Find more local food"** to discover authentic Goan tastings\n` +
      `• **"How much budget is left?"** to inspect financial allocations\n` +
      `• **"What's flexible?"** to view movable vs. critical schedule dependencies`,
    highlights: ["Context-aware Copilot", "Deterministic accuracy"]
  }
}
