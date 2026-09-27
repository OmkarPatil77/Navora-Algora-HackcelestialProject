import { HfInference } from '@huggingface/inference'
import { TRAVELER_SYSTEM_PROMPT } from '../prompts/travelerPrompt.js'
import { OPERATOR_SYSTEM_PROMPT } from '../prompts/operatorPrompt.js'
import { parseAndValidateLLMResponse } from './copilotValidator.js'

const MODEL_NAME = 'Qwen/Qwen2.5-Coder-32B-Instruct'

export class HuggingFaceProvider {
  constructor(apiKey) {
    this._explicitApiKey = apiKey
    this._client = null
    this._cachedKey = null
  }

  getApiKey() {
    return this._explicitApiKey || process.env.HUGGINGFACEHUB_API_TOKEN || process.env.HF_TOKEN
  }

  getClient() {
    const key = this.getApiKey()
    if (!key) return null
    if (!this._client || this._cachedKey !== key) {
      this._client = new HfInference(key.trim())
      this._cachedKey = key
    }
    return this._client
  }

  isAvailable() {
    const key = this.getApiKey()
    return Boolean(
      key && 
      key !== 'your_huggingface_token_here' && 
      key.trim().length > 5
    )
  }

  async generateResponse({ role = 'traveler', userMessage, context = {}, history = [] }) {
    if (!this.isAvailable()) {
      throw new Error('Hugging Face API token is missing or unconfigured.')
    }

    const client = this.getClient()
    const systemPrompt = role === 'operator' ? OPERATOR_SYSTEM_PROMPT : TRAVELER_SYSTEM_PROMPT

    // Construct clean prompt messages
    const formattedMessages = [
      {
        role: 'system',
        content: `${systemPrompt}\n\nCURRENT APPLICATION STATE CONTEXT (SOURCE OF TRUTH):\n${JSON.stringify(context, null, 2)}`
      }
    ]

    // Append recent message history (up to last 4 messages for brevity)
    if (Array.isArray(history)) {
      const recent = history.slice(-4)
      for (const h of recent) {
        if (h && h.text && (h.role === 'user' || h.role === 'assistant')) {
          formattedMessages.push({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: typeof h.text === 'string' ? h.text : JSON.stringify(h.text)
          })
        }
      }
    }

    // Append the user's latest query
    formattedMessages.push({
      role: 'user',
      content: userMessage
    })

    try {
      const response = await client.chatCompletion({
        model: MODEL_NAME,
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.2
      })

      const rawContent = response?.choices?.[0]?.message?.content
      if (!rawContent) {
        throw new Error('Empty response received from Hugging Face model.')
      }

      const validationResult = parseAndValidateLLMResponse(rawContent, role)
      if (!validationResult.isValid) {
        console.warn('[HuggingFaceProvider] JSON parse warning, attempting recovery:', validationResult.error)
        throw new Error(validationResult.error)
      }

      return {
        ...validationResult.data,
        source: 'llm_assisted'
      }
    } catch (err) {
      console.warn(`[HuggingFaceProvider] Model ${MODEL_NAME} call error:`, err.message)
      throw err
    }
  }
}
