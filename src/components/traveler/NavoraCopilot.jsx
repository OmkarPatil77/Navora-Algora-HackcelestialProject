import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, X, ArrowDown, Check, Compass, MessageSquare
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { copilotService, buildCopilotContext } from '@/services/copilotService'
import { validateAiAction } from '@/services/aiActionValidator'
import { executeAiAction } from '@/services/aiActionExecutor'
import { allExperiences } from '@/data/experiences'

export const NavoraCopilot = () => {
  const location = useLocation()
  const context = useTripPlan()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    addExperience,
    removeExperience,
    replaceExperience,
    setBudget,
    setTravelStyle,
    regenerateSingleDay,
    regenerateFullItinerary,
    journeyHealth,
    journeyMemory
  } = context

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'Your journey blueprint and preferences are synchronized. Ask me anything about your schedule, budget, pacing, or logistics.',
      source: 'computed'
    }
  ])

  const messagesEndRef = useRef(null)

  const defaultQuickPrompts = [
    { label: 'Famous spots in Jaipur', query: 'What are the famous spots in Jaipur and what should I add to my itinerary?' },
    { label: 'How much budget do I have left?', query: 'How much budget do I have left?' },
    { label: "What's flexible?", query: "What's flexible in my itinerary and what's fixed?" },
    { label: 'Make Day 2 more relaxed', query: 'Make Day 2 more relaxed' },
    { label: 'How is my trip health?', query: 'How is my trip health?' },
    { label: 'What did you learn about my preferences?', query: 'What did you learn about my preferences?' }
  ]

  const disruptionQuickPrompts = [
    { label: 'Why was scuba replaced?', query: 'Why was scuba replaced?' },
    { label: 'Famous spots in Jaipur', query: 'What are the famous spots in Jaipur and what should I add to my itinerary?' },
    { label: 'Why is sunset cruise unchanged?', query: 'Why is the sunset cruise unchanged?' },
    { label: 'How much budget do I have left?', query: 'How much budget do I have left?' },
    { label: "What's flexible?", query: "What's flexible in my itinerary and what's fixed?" },
    { label: 'What risks remain?', query: 'What risks remain for my trip?' }
  ]

  const quickPrompts = activeDisruption ? disruptionQuickPrompts : defaultQuickPrompts

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, isOpen])

  const contextMethods = {
    addExperience,
    removeExperience,
    replaceExperience,
    setBudget,
    setTravelStyle,
    regenerateSingleDay,
    regenerateFullItinerary
  }

  const handleSendMessage = async (textToSend) => {
    const userQuery = textToSend || inputValue.trim()
    if (!userQuery || isThinking) return

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userQuery
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsThinking(true)

    const copilotContext = buildCopilotContext(
      tripPreferences,
      selectedExperiences,
      itinerary,
      location.pathname,
      { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans },
      journeyHealth,
      journeyMemory
    )

    try {
      const response = await copilotService.ask({
        role: 'traveler',
        message: userQuery,
        context: copilotContext,
        history: messages
      })

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response.message || 'I have analyzed your request based on current journey state.',
        actions: response.actions || [],
        recommendedExperienceIds: response.recommendedExperienceIds || [],
        explanation: response.explanation || null,
        source: response.source || 'computed'
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      console.error('Copilot Error:', e)
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'The assistant is temporarily using Navora\'s built-in journey intelligence. Your itinerary and bookings remain safe.',
          source: 'demo_fallback'
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleApplyAction = (action, messageId) => {
    const validation = validateAiAction(action, {
      tripPreferences,
      selectedExperiences,
      itinerary
    })

    if (!validation.isValid) {
      alert(`Cannot apply change: ${validation.error}`)
      return
    }

    const result = executeAiAction(validation.sanitizedAction || action, contextMethods, context)

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
        id: `sys-confirm-${Date.now()}`,
        role: 'assistant',
        text: `✓ Change applied: ${result.message}`,
        source: 'computed'
      }
    ])
  }

  const handleDismissAction = (messageId) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, actionDismissed: true }
      }
      return msg
    }))
  }

  const renderSourceLabel = (source) => {
    switch (source) {
      case 'llm_assisted':
        return 'AI-assisted explanation'
      case 'demo_fallback':
        return 'Demo mode'
      case 'computed':
      default:
        return 'Computed from your trip plan'
    }
  }

  // Hide on public landing page
  if (location.pathname === '/') {
    return null
  }

  return (
    <>
      {/* Floating Concierge Opener Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-charcoal-900 hover:bg-charcoal-950 text-white border border-charcoal-800 shadow-soft-lg transition-all select-none group"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta-500 text-white">
            <Compass className="w-3.5 h-3.5" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="font-serif font-bold text-xs block leading-tight text-white">Navora</span>
            <span className="text-[10px] text-sand-300 block">Journey Assistant</span>
          </div>

          {isOpen && <X className="w-4 h-4 ml-1 text-sand-400 group-hover:text-white" />}
        </motion.button>
      </div>

      {/* Slide-out Editorial Copilot Panel */}
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
                <h3 className="font-serif font-bold text-base text-charcoal-950">Navora</h3>
                <p className="text-[11px] text-charcoal-600">Your journey, understood.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-sand-200/60 transition-colors"
                aria-label="Close assistant"
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

                      {/* Structured Proposed Actions Card */}
                      {msg.actions && msg.actions.length > 0 && !msg.actionApplied && !msg.actionDismissed && (
                        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-300/80 space-y-3 shadow-soft-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700">
                              PROPOSED CHANGE
                            </span>
                          </div>

                          {msg.actions.map((act, actIdx) => (
                            <div key={actIdx} className="space-y-2 text-xs">
                              {act.type === 'REPLACE_EXPERIENCE' && (
                                <div className="space-y-1.5">
                                  <div className="p-2 rounded-lg bg-white border border-sand-200 text-charcoal-600 line-through text-[11px]">
                                    {act.removeExperienceTitle || 'Scuba Diving Expedition (12:30–17:00)'}
                                  </div>
                                  <div className="flex justify-center text-muted-foreground">
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="p-2 rounded-lg bg-white border border-terracotta-200 font-semibold text-charcoal-900 text-[11px]">
                                    {act.replacementExperience?.title || act.addExperienceTitle || 'Fontainhas Heritage Walk (16:00–18:30)'}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                                    <span>+45 min flexibility buffer</span>
                                    <span>•</span>
                                    <span>Protected evening schedule</span>
                                  </div>
                                </div>
                              )}

                              {act.type === 'ADD_EXPERIENCE' && (
                                <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-[11px] space-y-1.5 shadow-soft-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-emerald-950 text-xs">
                                      + {act.experience?.title || act.experienceId}
                                    </span>
                                    {act.matchPct && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                        🎯 {act.matchPct}% Match
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                                    <span>{act.experience?.category || 'Curated'}</span>
                                    <span>•</span>
                                    <span>⏱️ {act.experience?.durationHours || 3} Hours</span>
                                    {act.day && (
                                      <>
                                        <span>•</span>
                                        <span className="font-semibold text-charcoal-800">Day {act.day}</span>
                                      </>
                                    )}
                                    {act.experience?.pricePerPerson && (
                                      <>
                                        <span>•</span>
                                        <span className="font-mono font-bold text-charcoal-900">₹{act.experience.pricePerPerson.toLocaleString('en-IN')}/person</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              {act.type === 'REMOVE_EXPERIENCE' && (
                                <div className="p-2.5 rounded-lg bg-white border border-rose-200 text-[11px]">
                                  <span className="font-bold text-rose-800 line-through block">- Remove Experience: {act.experienceId}</span>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">Expands free time and relaxes schedule</p>
                                </div>
                              )}

                              {act.type === 'MODIFY_BUDGET' && (
                                <div className="p-2.5 rounded-lg bg-white border border-sand-200 text-[11px] space-y-1">
                                  <div className="font-bold text-charcoal-900">
                                    Set Target Trip Budget to ₹{Number(act.amount).toLocaleString('en-IN')}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">Recalculates buffer cushion across all booking categories</p>
                                </div>
                              )}

                              {act.type === 'MODIFY_PACING' && (
                                <div className="p-2 rounded-lg bg-white border border-sand-200 text-[11px]">
                                  Pacing change to <span className="font-bold uppercase text-charcoal-900">{act.pace}</span> rhythm with added rest buffers.
                                </div>
                              )}

                              {act.type === 'REGENERATE_DAY' && (
                                <div className="p-2 rounded-lg bg-white border border-sand-200 text-[11px]">
                                  Re-balance and optimize schedule for <span className="font-bold text-charcoal-900">Day {act.day}</span>.
                                </div>
                              )}

                              {act.reason && (
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                  {act.reason}
                                </p>
                              )}

                              <div className="pt-1 flex items-center gap-2">
                                <button
                                  onClick={() => handleDismissAction(msg.id)}
                                  className="flex-1 py-1.5 px-3 rounded-lg border border-sand-300 bg-white hover:bg-sand-50 text-[11px] font-semibold text-charcoal-700 transition-colors"
                                >
                                  Keep current
                                </button>
                                <button
                                  onClick={() => handleApplyAction(act, msg.id)}
                                  className="flex-1 py-1.5 px-3 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-[11px] font-semibold transition-colors"
                                >
                                  Apply change
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Done Indicator */}
                      {msg.actionApplied && (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Change applied to your active itinerary</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="p-3 rounded-2xl bg-sand-50/70 border border-sand-100 text-xs text-charcoal-500 animate-pulse">
                  Analyzing trip schedule and logistics...
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
                  placeholder="Ask Navora..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-sand-50/80 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isThinking}
                  className="p-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-40 text-white transition-colors"
                  aria-label="Send query"
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

export default NavoraCopilot
