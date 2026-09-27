import { allExperiences } from '@/data/experiences'

/**
 * Validates AI-proposed actions against the current trip state and inventory rules
 * before allowing execution.
 */
export function validateAiAction(action, currentContext) {
  if (!action || !action.type) {
    return { isValid: false, error: "Action payload is missing a valid type." }
  }

  const {
    tripPreferences = {},
    selectedExperiences = [],
    itinerary = {}
  } = currentContext

  const daysCount = tripPreferences.duration?.days || 4

  switch (action.type) {
    case 'REPLACE_EXPERIENCE': {
      const { removeExperienceId, addExperienceId, day } = action

      if (!removeExperienceId || !addExperienceId) {
        return { isValid: false, error: "Replacement requires both an item to remove and a replacement candidate." }
      }

      const replacementExp = allExperiences.find(e => e.id === addExperienceId)
      if (!replacementExp) {
        return { isValid: false, error: `Candidate experience '${addExperienceId}' was not found in active inventory.` }
      }

      if (day && (day < 1 || day > daysCount)) {
        return { isValid: false, error: `Invalid day ${day}. Trip duration is ${daysCount} days.` }
      }

      return {
        isValid: true,
        sanitizedAction: {
          ...action,
          replacementExperience: replacementExp
        }
      }
    }

    case 'REMOVE_EXPERIENCE': {
      const { experienceId } = action
      if (!experienceId) {
        return { isValid: false, error: "Missing experienceId to remove." }
      }

      const isSelected = selectedExperiences.some(e => e.experienceId === experienceId || e.id === experienceId)
      if (!isSelected && selectedExperiences.length > 0) {
        // Find if it exists in inventory to at least give clean warning
        const exists = allExperiences.find(e => e.id === experienceId)
        if (!exists) {
          return { isValid: false, error: `Experience '${experienceId}' is not part of this journey.` }
        }
      }

      return { isValid: true, sanitizedAction: action }
    }

    case 'ADD_EXPERIENCE': {
      const { experienceId } = action
      if (!experienceId) {
        return { isValid: false, error: "Missing experienceId to add." }
      }

      const expToAdd = allExperiences.find(e => e.id === experienceId)
      if (!expToAdd) {
        return { isValid: false, error: `Experience '${experienceId}' not found in catalog.` }
      }

      return {
        isValid: true,
        sanitizedAction: {
          ...action,
          experience: expToAdd
        }
      }
    }

    case 'MODIFY_BUDGET': {
      const { amount } = action
      const num = Number(amount)
      if (isNaN(num) || num < 5000 || num > 500000) {
        return { isValid: false, error: "Proposed budget must be between ₹5,000 and ₹5,00,000." }
      }
      return { isValid: true, sanitizedAction: { ...action, amount: num } }
    }

    case 'MODIFY_PACING': {
      const { pace } = action
      if (!['relaxed', 'balanced', 'fast-paced'].includes(pace?.toLowerCase())) {
        return { isValid: false, error: "Pacing must be 'relaxed', 'balanced', or 'fast-paced'." }
      }
      return { isValid: true, sanitizedAction: { ...action, pace: pace.toLowerCase() } }
    }

    case 'REGENERATE_DAY': {
      const { day } = action
      const dayNum = Number(day)
      if (isNaN(dayNum) || dayNum < 1 || dayNum > daysCount) {
        return { isValid: false, error: `Target day must be between 1 and ${daysCount}.` }
      }
      return { isValid: true, sanitizedAction: { ...action, day: dayNum } }
    }

    case 'OPTIMIZE_ITINERARY': {
      return { isValid: true, sanitizedAction: action }
    }

    default:
      return { isValid: true, sanitizedAction: action }
  }
}
