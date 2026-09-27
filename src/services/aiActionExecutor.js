import { validateAiAction } from '@/services/aiActionValidator'

/**
 * Executes a validated AI action through existing application handlers
 */
export function executeAiAction(action, contextMethods, currentContext) {
  const validation = validateAiAction(action, currentContext)
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.error || "Action validation failed."
    }
  }

  const {
    replaceExperience,
    removeExperience,
    addExperience,
    setBudget,
    setTravelStyle,
    regenerateSingleDay,
    regenerateFullItinerary
  } = contextMethods

  const sanitized = validation.sanitizedAction

  try {
    switch (sanitized.type) {
      case 'REPLACE_EXPERIENCE': {
        if (replaceExperience && sanitized.replacementExperience) {
          replaceExperience(sanitized.removeExperienceId, sanitized.replacementExperience)
          return {
            success: true,
            message: `Successfully replaced activity with ${sanitized.replacementExperience.title}.`
          }
        }
        break
      }

      case 'REMOVE_EXPERIENCE': {
        if (removeExperience) {
          removeExperience(sanitized.experienceId)
          return {
            success: true,
            message: `Removed experience from your journey.`
          }
        }
        break
      }

      case 'ADD_EXPERIENCE': {
        if (addExperience && sanitized.experience) {
          addExperience(sanitized.experience)
          return {
            success: true,
            message: `Added ${sanitized.experience.title} to your journey blueprint.`
          }
        }
        break
      }

      case 'MODIFY_BUDGET': {
        if (setBudget) {
          setBudget(sanitized.amount)
          return {
            success: true,
            message: `Updated target trip budget to ₹${sanitized.amount.toLocaleString('en-IN')}.`
          }
        }
        break
      }

      case 'MODIFY_PACING': {
        if (setTravelStyle) {
          setTravelStyle({ pace: sanitized.pace })
          return {
            success: true,
            message: `Adjusted journey pacing to ${sanitized.pace}.`
          }
        }
        break
      }

      case 'REGENERATE_DAY': {
        if (regenerateSingleDay) {
          regenerateSingleDay(sanitized.day)
          return {
            success: true,
            message: `Rebalanced Day ${sanitized.day} schedule.`
          }
        }
        break
      }

      case 'OPTIMIZE_ITINERARY': {
        if (regenerateFullItinerary) {
          regenerateFullItinerary()
          return {
            success: true,
            message: `Re-optimized complete itinerary.`
          }
        }
        break
      }

      default:
        return {
          success: false,
          message: `Unknown action type '${sanitized.type}'.`
        }
    }

    return {
      success: true,
      message: "Action executed successfully."
    }
  } catch (error) {
    console.error("AI Action Execution error:", error)
    return {
      success: false,
      message: "Failed to apply changes due to an internal error."
    }
  }
}
