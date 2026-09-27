import { validateOperatorAction } from './operatorActionValidator'

/**
 * Executes a validated structured operator action against the shared TripPlanningContext
 */
export function executeOperatorAction(action, contextMethods, fullContext) {
  const validation = validateOperatorAction(action, fullContext)
  if (!validation.valid) {
    return {
      success: false,
      message: `Action execution rejected: ${validation.error}`
    }
  }

  const {
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    addOperatorEvent
  } = contextMethods

  switch (action.type) {
    case 'CONFIRM_VENDOR': {
      confirmOperatorVendor(action.vendorId, action.note || 'Confirmed via Ops Copilot action')
      return {
        success: true,
        message: `Vendor ${action.vendorId} successfully confirmed.`
      }
    }

    case 'PREPARE_NOTIFICATION': {
      const notif = sendOperatorTravelerNotification(action.tourId || "GOA-2048", action.message)
      return {
        success: true,
        message: `Traveler update notification dispatched for Tour ${action.tourId || "GOA-2048"}.`
      }
    }

    case 'APPLY_RECOVERY': {
      const planId = action.planId || 'PLAN-B-BALANCED'
      const applied = applyDisruptionRecovery(planId)
      if (applied) {
        return {
          success: true,
          message: `Recovery strategy "${planId}" applied to Tour GOA-2048 and synchronized with traveler app.`
        }
      }
      return {
        success: false,
        message: `Failed to apply recovery strategy "${planId}".`
      }
    }

    case 'RESOLVE_ATTENTION_ITEM': {
      resolveOperatorAttentionItem(action.itemId)
      return {
        success: true,
        message: `Attention item ${action.itemId} resolved.`
      }
    }

    case 'VIEW_IMPACT': {
      const el = document.getElementById('operator-impact-section')
      el?.scrollIntoView({ behavior: 'smooth' })
      return {
        success: true,
        message: "Scrolled to Disruption Impact Graph."
      }
    }

    case 'VIEW_RECOVERY': {
      const el = document.getElementById('operator-recovery-section')
      el?.scrollIntoView({ behavior: 'smooth' })
      return {
        success: true,
        message: "Scrolled to Recovery Recommendation."
      }
    }

    default:
      return {
        success: false,
        message: `Unhandled action type: ${action.type}`
      }
  }
}
