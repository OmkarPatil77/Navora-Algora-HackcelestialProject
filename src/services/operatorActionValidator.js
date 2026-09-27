/**
 * Operator Action Validator
 * Validates structured actions proposed by the Ops Copilot before execution
 */

export function validateOperatorAction(action, context) {
  if (!action || typeof action !== 'object') {
    return { valid: false, error: 'Action payload is missing or not an object.' }
  }

  const { type } = action
  const validTypes = [
    'VIEW_IMPACT',
    'VIEW_RECOVERY',
    'CONFIRM_VENDOR',
    'PREPARE_NOTIFICATION',
    'APPLY_RECOVERY',
    'RESOLVE_ATTENTION_ITEM'
  ]

  if (!validTypes.includes(type)) {
    return { valid: false, error: `Unsupported operator action type: "${type}".` }
  }

  switch (type) {
    case 'CONFIRM_VENDOR': {
      if (!action.vendorId) {
        return { valid: false, error: 'Vendor ID is required for vendor confirmation.' }
      }
      return { valid: true }
    }

    case 'PREPARE_NOTIFICATION': {
      if (!action.tourId) {
        return { valid: false, error: 'Tour ID is required to prepare traveler notification.' }
      }
      return { valid: true }
    }

    case 'APPLY_RECOVERY': {
      const planId = action.planId || 'PLAN-B-BALANCED'
      if (!context?.recoveryPlans?.some(p => p.id === planId)) {
        return { valid: false, error: `Recovery strategy "${planId}" not found in active solutions.` }
      }
      return { valid: true }
    }

    case 'RESOLVE_ATTENTION_ITEM': {
      if (!action.itemId) {
        return { valid: false, error: 'Item ID is required to resolve attention queue item.' }
      }
      return { valid: true }
    }

    case 'VIEW_IMPACT':
    case 'VIEW_RECOVERY':
    default:
      return { valid: true }
  }
}
