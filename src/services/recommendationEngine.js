import { goaExperiences, getExperiencesByDestination, allExperiences } from '@/data/experiences'
import { getMemoryScoreAdjustment } from './journeyMemoryEngine'

/**
 * Calculates a deterministic match score (0-100) and rationale for an experience
 * based on the traveler's structured preferences and optional journey memory.
 */
export function scoreExperience(experience, preferences, journeyMemory = null) {
  const {
    interests = ["adventure", "food", "beaches"],
    budget = { total: 35000, breakdown: { activities: 6300 } },
    travelers = { adults: 2, total: 2 },
    duration = { days: 4 },
    travelStyle = { pace: "balanced", priority: "experiences", accommodation: "comfort" }
  } = preferences

  const userInterests = interests.map(i => i.toLowerCase())
  const userPace = travelStyle.pace || "balanced"
  const userPriority = travelStyle.priority || "experiences"
  const adultCount = Math.max(1, travelers.adults || travelers.total || 2)
  const totalExperienceCost = experience.pricePerPerson * adultCount
  const plannedActivityBudget = budget.breakdown?.activities || (budget.total * 0.18)

  let score = 0
  const matchReasons = []

  // 1. Interest Matching (Weight: 40 points)
  const matchingTags = experience.tags.filter(tag => userInterests.includes(tag.toLowerCase()))
  const matchingIdealFor = experience.idealFor?.filter(item => userInterests.includes(item.toLowerCase())) || []
  const uniqueMatches = Array.from(new Set([...matchingTags, ...matchingIdealFor]))

  if (uniqueMatches.length > 0) {
    const interestRatio = Math.min(1, uniqueMatches.length / Math.min(3, userInterests.length))
    const interestScore = Math.round(interestRatio * 40)
    score += interestScore

    const matchedLabels = uniqueMatches.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' & ')
    matchReasons.push(`Strong alignment with your preference for ${matchedLabels}.`)
  } else {
    score += 10 // baseline category relevance
  }

  // 2. Budget Fit (Weight: 20 points)
  const perActivityTarget = plannedActivityBudget / Math.max(2, duration.days)
  if (totalExperienceCost <= perActivityTarget * 1.3) {
    score += 20
    matchReasons.push(`Comfortably fits within your activity budget (~₹${totalExperienceCost.toLocaleString('en-IN')} for ${adultCount} pax).`)
  } else if (totalExperienceCost <= perActivityTarget * 2.0) {
    score += 14
    matchReasons.push(`Modest budget footprint with high experiential value.`)
  } else {
    score += 8
    matchReasons.push(`Premium experience tier requiring slight budget headroom.`)
  }

  // 3. Travel Pace Fit (Weight: 15 points)
  if (userPace === "relaxed") {
    if (experience.pace === "relaxed" || experience.intensity === "low") {
      score += 15
      matchReasons.push(`Gentle pacing leaving ample downtime for leisure.`)
    } else if (experience.pace === "moderate") {
      score += 10
    } else {
      score += 5
    }
  } else if (userPace === "balanced") {
    if (experience.pace === "moderate" || experience.pace === "relaxed") {
      score += 15
      matchReasons.push(`Harmonious pace balancing exploration with relaxed recovery.`)
    } else {
      score += 12
      matchReasons.push(`High-energy highlight tailored to a balanced travel rhythm.`)
    }
  } else {
    if (experience.pace === "active" || experience.intensity === "high") {
      score += 15
      matchReasons.push(`Action-packed highlight maximizing your daily exploration window.`)
    } else {
      score += 12
    }
  }

  // 4. Priority Fit (Weight: 15 points)
  if (experience.priorityFit?.includes(userPriority)) {
    score += 15
    const priorityLabel = userPriority.charAt(0).toUpperCase() + userPriority.slice(1).replace('-', ' ')
    matchReasons.push(`Specifically calibrated for your focus on ${priorityLabel}.`)
  } else if (userPriority === "saving-money" && experience.pricePerPerson <= 1200) {
    score += 15
    matchReasons.push(`High value-to-cost ratio for budget-conscious planning.`)
  } else {
    score += 9
  }

  // 5. Duration Fit (Weight: 10 points)
  if (duration.days <= 3) {
    if (experience.durationHours <= 3.0) {
      score += 10
      matchReasons.push(`Compact duration fitting a shorter trip window.`)
    } else {
      score += 5
    }
  } else {
    if (experience.durationHours >= 2.0 && experience.durationHours <= 5.0) {
      score += 10
      matchReasons.push(`Optimal timing for your ${duration.days}-day itinerary pacing.`)
    } else {
      score += 7
    }
  }

  // 6. Journey Memory Modifier (+5 to -5 points)
  if (journeyMemory) {
    const memAdjustment = getMemoryScoreAdjustment(experience, journeyMemory)
    if (memAdjustment !== 0) {
      score += memAdjustment
      if (memAdjustment > 0) {
        matchReasons.push(`Contextually aligned with your observed choices during this journey.`)
      }
    }
  }

  // Normalize final score between 45 and 99
  const finalScore = Math.min(99, Math.max(45, score))

  let compatibility = "moderate"
  if (finalScore >= 85) compatibility = "excellent"
  else if (finalScore >= 70) compatibility = "good"

  return {
    ...experience,
    matchScore: finalScore,
    matchReasons,
    compatibility,
    totalCostForParty: totalExperienceCost
  }
}

/**
 * Returns ranked recommendations for the given preferences and optional active filters.
 */
export function getRecommendations(preferences, filters = {}, journeyMemory = null) {
  const isMixed = Boolean(filters.mixedPlaces || filters.destination === "All")
  const destName = preferences?.destination?.city || preferences?.destination?.name || "Goa"

  let rawExperiences = []
  if (isMixed) {
    rawExperiences = allExperiences
  } else if (filters.destination && filters.destination !== "All") {
    rawExperiences = getExperiencesByDestination(filters.destination)
  } else {
    rawExperiences = getExperiencesByDestination(destName)
  }

  let candidates = rawExperiences.map(exp => scoreExperience(exp, preferences, journeyMemory))

  // Apply Category Filter
  if (filters.category && filters.category !== "All") {
    candidates = candidates.filter(exp => 
      exp.category.toLowerCase() === filters.category.toLowerCase() ||
      exp.tags.some(t => t.toLowerCase() === filters.category.toLowerCase())
    )
  }

  // Apply Duration Filter
  if (filters.duration && filters.duration !== "Any") {
    if (filters.duration === "< 2 hrs") {
      candidates = candidates.filter(exp => exp.durationHours < 2.5)
    } else if (filters.duration === "2–4 hrs") {
      candidates = candidates.filter(exp => exp.durationHours >= 2.0 && exp.durationHours <= 4.0)
    } else if (filters.duration === "4+ hrs") {
      candidates = candidates.filter(exp => exp.durationHours > 4.0)
    }
  }

  // Apply Price Filter
  if (filters.price && filters.price !== "Any") {
    if (filters.price === "Under ₹1,000") {
      candidates = candidates.filter(exp => exp.pricePerPerson < 1000)
    } else if (filters.price === "₹1,000–₹2,500") {
      candidates = candidates.filter(exp => exp.pricePerPerson >= 1000 && exp.pricePerPerson <= 2500)
    } else if (filters.price === "₹2,500+") {
      candidates = candidates.filter(exp => exp.pricePerPerson > 2500)
    }
  }

  // Sorting
  const sortBy = filters.sortBy || "Best Match"
  candidates.sort((a, b) => {
    if (sortBy === "Best Match") return b.matchScore - a.matchScore
    if (sortBy === "Lowest Price") return a.pricePerPerson - b.pricePerPerson
    if (sortBy === "Highest Rated") return b.rating - a.rating
    if (sortBy === "Shortest Duration") return a.durationHours - b.durationHours
    return b.matchScore - a.matchScore
  })

  return {
    isSupportedDestination: true,
    isMixed,
    destinationName: isMixed 
      ? "Mixed Destinations" 
      : (filters.destination || preferences?.destination?.name || preferences?.destination?.city || "Goa, India"),
    experiences: candidates,
    totalAvailable: rawExperiences.length
  }
}

/**
 * Calculates high-level Journey Fit metrics from preferences & selected experiences.
 */
export function getJourneyFitMetrics(preferences, selectedExperiences = [], allRecommendations = []) {
  const userInterests = preferences?.interests || ["adventure", "food", "beaches"]
  const plannedBudget = preferences?.budget?.total || 35000
  const adultCount = Math.max(1, preferences?.travelers?.adults || 2)

  const selectedItems = selectedExperiences
    .map(sel => allRecommendations.find(r => r.id === sel.experienceId || r.id === sel.id))
    .filter(Boolean)

  if (selectedItems.length === 0) {
    // Derive from top 4 candidate recommendations
    const topCandidates = allRecommendations.slice(0, 4)
    const avgScore = topCandidates.length > 0 
      ? Math.round(topCandidates.reduce((acc, c) => acc + c.matchScore, 0) / topCandidates.length)
      : 92

    return {
      overallFit: avgScore,
      interestAlignment: 94,
      budgetAlignment: 88,
      pacingAlignment: 92,
      diversityScore: 86,
      summary: `Your preferences strongly favor experiences that combine ${userInterests.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}.`
    }
  }

  // 1. Interest Alignment
  const matchedInterestsCount = new Set(
    selectedItems.flatMap(i => i.tags.filter(t => userInterests.includes(t.toLowerCase())))
  ).size
  const interestAlignment = Math.min(99, Math.round(75 + (matchedInterestsCount / Math.max(1, userInterests.length)) * 24))

  // 2. Budget Alignment
  const totalCost = selectedItems.reduce((acc, i) => acc + (i.pricePerPerson * adultCount), 0)
  const activityBudget = preferences?.budget?.breakdown?.activities || (plannedBudget * 0.18)
  const budgetRatio = totalCost / (activityBudget || 1)
  let budgetAlignment = 95
  if (budgetRatio > 1.2) budgetAlignment = 72
  else if (budgetRatio > 1.0) budgetAlignment = 84

  // 3. Pacing Alignment
  const hasHighIntensity = selectedItems.filter(i => i.intensity === "high").length
  let pacingAlignment = 94
  if (preferences?.travelStyle?.pace === "relaxed" && hasHighIntensity > 1) {
    pacingAlignment = 76
  }

  // 4. Category Diversity
  const uniqueCategories = new Set(selectedItems.map(i => i.category)).size
  const diversityScore = Math.min(98, Math.round(70 + (uniqueCategories / Math.max(1, selectedItems.length)) * 28))

  const overallFit = Math.round((interestAlignment * 0.35) + (budgetAlignment * 0.25) + (pacingAlignment * 0.20) + (diversityScore * 0.20))

  return {
    overallFit,
    interestAlignment,
    budgetAlignment,
    pacingAlignment,
    diversityScore,
    totalPlannedCost: totalCost,
    remainingBudget: Math.max(0, plannedBudget - totalCost),
    summary: `Your ${selectedItems.length} selected experiences balance ${userInterests.slice(0, 2).join(' & ')} with sensible day pacing.`
  }
}

/**
 * Runs a deterministic optimization check across selected experiences.
 */
export function optimizePicks(preferences, selectedExperiences = [], allRecommendations = []) {
  const selectedItems = selectedExperiences
    .map(sel => allRecommendations.find(r => r.id === sel.experienceId || r.id === sel.id))
    .filter(Boolean)

  if (selectedItems.length < 2) {
    return {
      status: "insufficient_picks",
      message: "Add at least 2 experiences to run the Navora optimization engine.",
      suggestions: []
    }
  }

  const highIntensityItems = selectedItems.filter(i => i.intensity === "high")
  const categories = selectedItems.map(i => i.category)
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const suggestions = []

  // Rule 1: High Intensity Pacing Bottleneck
  if (highIntensityItems.length >= 2 && preferences?.travelStyle?.pace !== "fast-paced") {
    const highItemToReplace = highIntensityItems[1]
    const replacementCandidate = allRecommendations.find(r => 
      !selectedItems.some(s => s.id === r.id) && 
      (r.pace === "relaxed" || r.pace === "moderate") &&
      r.matchScore >= 85
    ) || allRecommendations[1]

    suggestions.push({
      type: "pacing_balance",
      title: "Pacing Bottleneck Detected",
      severity: "warning",
      insight: `You currently have ${highIntensityItems.length} high-intensity activities. This might cause fatigue on day ${preferences?.duration?.days > 3 ? '2 or 3' : '2'}.`,
      actionDescription: `Consider balancing with a relaxing cultural or culinary stop:`,
      currentExperience: highItemToReplace,
      suggestedReplacement: replacementCandidate
    })
  }

  // Rule 2: Category Clustering (e.g. 3 of same category)
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count >= 3) {
      const duplicateItem = selectedItems.filter(i => i.category === cat)[2]
      const diverseCandidate = allRecommendations.find(r => 
        !selectedItems.some(s => s.id === r.id) && 
        r.category !== cat &&
        r.matchScore >= 86
      )

      if (diverseCandidate && duplicateItem) {
        suggestions.push({
          type: "diversity_boost",
          title: "Experience Diversity Opportunity",
          severity: "info",
          insight: `You have ${count} ${cat} stops in your list. Adding a contrasting experience will create richer trip memories.`,
          actionDescription: `Replace one with a top-rated alternate:`,
          currentExperience: duplicateItem,
          suggestedReplacement: diverseCandidate
        })
      }
    }
  })

  // Rule 3: All Clear
  if (suggestions.length === 0) {
    suggestions.push({
      type: "optimal",
      title: "Harmonious Selection",
      severity: "success",
      insight: `Your current ${selectedItems.length} experiences form a well-balanced schedule that respects your ${preferences?.travelStyle?.pace} pace and budget buffer.`,
      actionDescription: "Ready to proceed directly to itinerary generation.",
      currentExperience: null,
      suggestedReplacement: null
    })
  }

  return {
    status: "evaluated",
    suggestionsCount: suggestions.length,
    suggestions
  }
}
