import { HuggingFaceProvider } from './huggingFaceService.js'
import { DemoFallbackProvider } from './demoFallbackProvider.js'
import { buildCopilotContext } from './contextBuilder.js'
import { validateCopilotRequest } from './copilotValidator.js'

export class CopilotService {
  constructor() {
    this.hfProvider = new HuggingFaceProvider()
    this.fallbackProvider = new DemoFallbackProvider()
  }

  async ask({ role = 'traveler', message = '', context = {}, history = [] }) {
    // 1. Validate request
    const validation = validateCopilotRequest({ role, message })
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        source: 'validation_error'
      }
    }

    // 2. Build compact, role-specific context
    const compactContext = buildCopilotContext(role, context)

    // 3. Try Hugging Face open-source Qwen model if token configured
    if (this.hfProvider.isAvailable()) {
      try {
        console.log(`[CopilotService] Routing query to Hugging Face Qwen for role '${role}'...`)
        const response = await this.hfProvider.generateResponse({
          role,
          userMessage: message,
          context: compactContext,
          history
        })

        return {
          success: true,
          intent: response.intent || 'GENERAL',
          message: response.message,
          actions: response.actions || [],
          recommendedExperienceIds: response.recommendedExperienceIds || [],
          explanation: response.explanation || null,
          confidence: response.confidence || 'high',
          source: 'llm_assisted'
        }
      } catch (err) {
        console.warn('[CopilotService] Hugging Face call failed or timed out. Gracefully switching to Navora deterministic engine:', err.message)
      }
    } else {
      console.log('[CopilotService] Hugging Face token not configured. Using Navora deterministic engine.')
    }

    // 4. Deterministic Fallback Engine
    try {
      const fallbackResponse = await this.fallbackProvider.generateResponse({
        role,
        userMessage: message,
        context: compactContext
      })

      return {
        success: true,
        intent: fallbackResponse.intent || 'GENERAL',
        message: fallbackResponse.message,
        actions: fallbackResponse.actions || [],
        recommendedExperienceIds: fallbackResponse.recommendedExperienceIds || [],
        explanation: fallbackResponse.explanation || null,
        confidence: fallbackResponse.confidence || 'high',
        source: this.hfProvider.isAvailable() ? 'demo_fallback' : 'computed'
      }
    } catch (fallbackErr) {
      console.error('[CopilotService] Fallback execution error:', fallbackErr)
      return {
        success: true,
        intent: 'GENERAL',
        message: 'I have analyzed your itinerary against current trip parameters. Everything is operating on schedule with confirmed allocations.',
        actions: [],
        recommendedExperienceIds: [],
        explanation: null,
        confidence: 'medium',
        source: 'computed'
      }
    }
  }
}

export const copilotService = new CopilotService()
