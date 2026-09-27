/**
 * Copilot Validator: Validates request payloads and sanitizes structured LLM outputs
 */

const ALLOWED_TRAVELER_ACTIONS = [
  'REPLACE_EXPERIENCE',
  'REMOVE_EXPERIENCE',
  'ADD_EXPERIENCE',
  'MODIFY_BUDGET',
  'MODIFY_PACING',
  'REGENERATE_DAY'
]

const ALLOWED_OPERATOR_ACTIONS = [
  'CONFIRM_VENDOR',
  'PREPARE_NOTIFICATION',
  'APPLY_RECOVERY',
  'RESOLVE_ATTENTION_ITEM',
  'VIEW_IMPACT'
]

export function validateCopilotRequest(body) {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object.' }
  }

  const { role, message } = body

  if (!role || !['traveler', 'operator'].includes(role.toLowerCase())) {
    return { isValid: false, error: "Role must be either 'traveler' or 'operator'." }
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { isValid: false, error: 'Message must be a non-empty string.' }
  }

  return { isValid: true, role: role.toLowerCase(), message: message.trim() }
}

export function parseAndValidateLLMResponse(rawText, role = 'traveler') {
  if (!rawText || typeof rawText !== 'string') {
    return { isValid: false, error: 'Empty LLM response text.' }
  }

  let cleaned = rawText.trim()

  // Remove markdown code fences if present (e.g. ```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }

  // Attempt JSON extraction if extra preamble exists
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  let parsed = null
  try {
    parsed = JSON.parse(cleaned)
  } catch (err) {
    return { isValid: false, error: `Invalid JSON returned by LLM: ${err.message}`, rawText }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { isValid: false, error: 'Parsed LLM output is not a valid object.' }
  }

  const allowedActions = role === 'operator' ? ALLOWED_OPERATOR_ACTIONS : ALLOWED_TRAVELER_ACTIONS

  // Validate and sanitize actions array
  const sanitizedActions = []
  if (Array.isArray(parsed.actions)) {
    for (const act of parsed.actions) {
      if (act && typeof act === 'object' && allowedActions.includes(act.type)) {
        sanitizedActions.push(act)
      }
    }
  }

  // Sanitize explanation
  let sanitizedExplanation = null
  if (parsed.explanation && typeof parsed.explanation === 'object') {
    sanitizedExplanation = {
      title: String(parsed.explanation.title || 'Decision Rationale'),
      reason: String(parsed.explanation.reason || ''),
      factors: Array.isArray(parsed.explanation.factors) ? parsed.explanation.factors.map(String) : [],
      constraintsSatisfied: Array.isArray(parsed.explanation.constraintsSatisfied) ? parsed.explanation.constraintsSatisfied.map(String) : [],
      alternative: parsed.explanation.alternative ? String(parsed.explanation.alternative) : '',
      outcome: parsed.explanation.outcome ? String(parsed.explanation.outcome) : ''
    }
  }

  return {
    isValid: true,
    data: {
      intent: String(parsed.intent || 'GENERAL'),
      message: String(parsed.message || 'I have analyzed your request based on the current trip context.'),
      actions: sanitizedActions,
      recommendedExperienceIds: Array.isArray(parsed.recommendedExperienceIds) ? parsed.recommendedExperienceIds.map(String) : [],
      explanation: sanitizedExplanation,
      confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'high',
      source: 'llm_assisted'
    }
  }
}
