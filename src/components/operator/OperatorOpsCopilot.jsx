import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, X, Check, ShieldCheck, Store, AlertTriangle, 
  MessageSquare, Compass, ArrowRight, Eye, Phone
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { copilotService, buildOperatorCopilotContext } from '@/services/copilotService'
import { validateOperatorAction } from '@/services/operatorActionValidator'
import { executeOperatorAction } from '@/services/operatorActionExecutor'

export const OperatorOpsCopilot = () => {
  const navigate = useNavigate()
  const context = useTripPlan()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    operatorVendors,
    operatorAttentionItems,
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    addOperatorEvent,
    journeyHealth
  } = context

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'ops-welcome',
      role: 'assistant',
      text: 'Monitoring 12 active tours, vendor dispatch schedules, and live anomaly streams. How can I assist your fleet operations today?',
      source: 'computed'
    }
  ])

  const messagesEndRef = useRef(null)

  const quickPrompts = [
    { label: "Summarize today's operations", query: "Summarize today's operations" },
    { label: 'Which vendors need action?', query: 'Which vendors need action for the Goa disruption?' },
    { label: 'Explain this disruption', query: 'Explain the current disruption on Tour GOA-2048' },
    { label: 'Prepare a traveler update', query: 'Prepare a traveler update notification for Tour GOA-2048' },
    { label: 'What risks remain?', query: 'What operational risks remain across active tours?' }
  ]

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, isOpen])

  const contextMethods = {
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    addOperatorEvent
  }

  const handleSendMessage = async (textToSend) => {
    const userQuery = textToSend || inputValue.trim()
    if (!userQuery || isThinking) return

    const userMsg = {
      id: `ops-user-${Date.now()}`,
      role: 'user',
      text: userQuery
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsThinking(true)

    const copilotContext = buildOperatorCopilotContext(
      {
        operatorVendors,
        operatorAttentionItems
      },
      { id: 'GOA-2048', title: 'Goa Coastal Escape', destination: 'Goa, India' },
      { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans },
      journeyHealth
    )

    try {
      const response = await copilotService.ask({
        role: 'operator',
        message: userQuery,
        context: copilotContext,
        history: messages
      })

      const assistantMsg = {
        id: `ops-assistant-${Date.now()}`,
        role: 'assistant',
        text: response.message || 'I have analyzed the fleet operational context.',
        actions: response.actions || [],
        explanation: response.explanation || null,
        source: response.source || 'computed'
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      console.error('Ops Copilot Error:', e)
      setMessages(prev => [
        ...prev,
        {
          id: `ops-err-${Date.now()}`,
          role: 'assistant',
          text: 'The assistant is temporarily using Navora\'s built-in journey intelligence. All fleet records remain protected.',
          source: 'demo_fallback'
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleApplyAction = (action, messageId) => {
    const validation = validateOperatorAction(action, context)
    if (!validation.valid) {
      alert(`Cannot execute action: ${validation.error}`)
      return
    }

    const result = executeOperatorAction(action, contextMethods, context)

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          actionApplied: true,
          actionResultText: result.message
        }
      }
      return msg
    }))

    setMessages(prev => [
      ...prev,
      {
        id: `ops-confirm-${Date.now()}`,
        role: 'assistant',
        text: `✓ Operation executed: ${result.message}`,
        source: 'computed'
      }
    ])
  }

  const renderSourceLabel = (source) => {
    switch (source) {
      case 'llm_assisted':
        return 'AI-assisted explanation'
      case 'demo_fallback':
        return 'Demo mode'
      case 'computed':
      default:
        return 'Computed from operations state'
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-charcoal-900 text-white shadow-soft-lg border border-charcoal-800 hover:bg-charcoal-950 transition-all select-none"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta-600 text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs tracking-wide">Ops Assistant</span>
          {activeDisruption && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              1 Alert
            </span>
          )}
          {isOpen && <X className="w-4 h-4 ml-1 text-sand-400 group-hover:text-white" />}
        </motion.button>
      </div>

      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[620px] h-[580px] rounded-3xl bg-white border border-sand-200/90 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-sand-50/90 border-b border-sand-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-950">Navora Ops Copilot</h3>
                <p className="text-[11px] text-charcoal-600">Fleet Operations & Incident Intelligence</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-200/60 transition-colors"
                aria-label="Close ops assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-white text-xs text-charcoal-900">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl bg-sand-100/90 text-charcoal-900 px-4 py-2.5 font-medium leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-charcoal-800 leading-relaxed font-normal text-xs sm:text-[13px] bg-sand-50/50 p-3.5 rounded-2xl border border-sand-100 whitespace-pre-line">
                        {msg.text}

                        {/* Source Tag */}
                        {msg.source && (
                          <div className="mt-2.5 pt-2 border-t border-sand-200/60 flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            <span>{renderSourceLabel(msg.source)}</span>
                          </div>
                        )}
                      </div>

                      {/* Structured Operations Actions Card */}
                      {msg.actions && msg.actions.length > 0 && !msg.actionApplied && (
                        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-300/80 space-y-3 shadow-soft-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                            OPERATIONS ACTION
                          </span>

                          {msg.actions.map((act, actIdx) => (
                            <div key={actIdx} className="space-y-2 text-xs">
                              {act.type === 'CONFIRM_VENDOR' && (
                                <div className="p-2.5 rounded-xl bg-white border border-sand-200 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-charcoal-900">Goa Transfers Fleet (Rajesh Naik)</span>
                                    <span className="text-[10px] font-mono text-amber-700 font-semibold">12:15 Pickup</span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">{act.notes || 'Confirm gate pickup re-timing for delayed flight.'}</p>
                                </div>
                              )}

                              {act.type === 'APPLY_RECOVERY' && (
                                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                                  <span className="font-bold text-emerald-900 block">Plan B • Balanced Recovery Strategy</span>
                                  <p className="text-[11px] text-muted-foreground">Applies +90m airport transfer buffer and Fontainhas Cultural Walk substitution.</p>
                                </div>
                              )}

                              {act.type === 'PREPARE_NOTIFICATION' && (
                                <div className="p-2.5 rounded-xl bg-white border border-sand-200 space-y-1">
                                  <span className="font-bold text-charcoal-900 block">Guest Notification Draft</span>
                                  <p className="text-[11px] text-muted-foreground italic">"{act.text || 'Pickup time and updated afternoon timeline ready for guest push.'}"</p>
                                </div>
                              )}

                              {act.type === 'VIEW_IMPACT' && (
                                <div className="p-2.5 rounded-xl bg-white border border-sand-200 text-[11px] text-charcoal-700">
                                  Tour {act.tourId || 'GOA-2048'} timeline inspection ready.
                                </div>
                              )}

                              {act.type === 'RESOLVE_ATTENTION' && (
                                <div className="p-2.5 rounded-xl bg-white border border-sand-200 space-y-1">
                                  <span className="font-bold text-charcoal-900 block">Resolve Attention Item</span>
                                  <p className="text-[11px] text-muted-foreground">{act.notes || 'Acknowledge and mark attention flag resolved.'}</p>
                                </div>
                              )}

                              <div className="pt-1 flex items-center gap-2">
                                {act.type === 'VIEW_IMPACT' ? (
                                  <button
                                    onClick={() => {
                                      navigate(`/operator/tours/${act.tourId || 'GOA-2048'}`)
                                      setIsOpen(false)
                                    }}
                                    className="w-full py-1.5 px-3 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-[11px] font-semibold transition-colors text-center"
                                  >
                                    View Impacted Tour →
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleApplyAction(act, msg.id)}
                                    className="w-full py-1.5 px-3 rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white text-[11px] font-semibold transition-colors text-center"
                                  >
                                    Execute Action →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Executed Indicator */}
                      {msg.actionApplied && (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Operation logged & state synchronized</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="p-3 rounded-2xl bg-sand-50/70 border border-sand-100 text-xs text-charcoal-500 animate-pulse">
                  Analyzing operations roster and dependency graphs...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-2.5 bg-sand-50/70 border-t border-sand-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-sand-100 text-charcoal-700 border border-sand-200/90 transition-colors shrink-0 shadow-soft-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-sand-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Ops Copilot..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-sand-50/80 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isThinking}
                  className="p-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-40 text-white transition-colors"
                  aria-label="Send ops query"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OperatorOpsCopilot
