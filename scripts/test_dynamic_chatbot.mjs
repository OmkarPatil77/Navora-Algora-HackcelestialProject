import { ClientDemoFallbackProvider } from '../src/services/demoFallbackProvider.js'

const provider = new ClientDemoFallbackProvider()

// Sample mock traveler context
const mockTravelerContext = {
  currentPage: '/trip',
  trip: {
    destination: 'Goa, India',
    startDate: '12 Oct 2026',
    endDate: '15 Oct 2026',
    durationDays: 4,
    travelers: { adults: 2, total: 2 },
    interests: ['culture', 'food', 'photography', 'history', 'adventure', 'beaches'],
    travelStyle: { pace: 'balanced', priority: 'experiences', accommodation: 'comfort' },
    budget: {
      total: 35000,
      estimatedCost: 34620,
      remainingBuffer: 380,
      isOverBudget: false
    }
  },
  selectedExperiences: [
    { id: 'goa-scuba-dive', title: 'Grand Island Scuba Diving', price: 2800 },
    { id: 'goa-mandovi-sunset-cruise', title: 'Mandovi Sunset Cruise', price: 1800 }
  ],
  itineraryDays: [
    {
      day: 1,
      title: 'Arrival & Coastal Sunset',
      theme: 'Coastal & Cultural',
      items: [
        { id: 'trans-1', title: 'Airport Chauffeur Transfer', startTime: '12:15', endTime: '13:15', cost: 1200, intensity: 'low' },
        { id: 'stay-1', title: 'Check-in at Casa Sol Heritage Villa', startTime: '13:15', endTime: '14:30', cost: 0, intensity: 'low' },
        { id: 'goa-fontainhas-heritage-walk', title: 'Fontainhas Latin Quarter Heritage Walk', startTime: '15:30', endTime: '18:00', cost: 1600, intensity: 'low' },
        { id: 'goa-mandovi-sunset-cruise', title: 'Mandovi Luxury Catamaran Sunset Cruise', startTime: '18:45', endTime: '20:45', cost: 1800, intensity: 'low' }
      ]
    },
    {
      day: 2,
      title: 'Heritage & Spice Groves',
      theme: 'Spices & History',
      items: [
        { id: 'exp-spice', title: 'Sahakari Spice Plantation Tour', startTime: '10:00', endTime: '13:30', cost: 1100, intensity: 'low' },
        { id: 'exp-cabo', title: 'Cabo de Rama Fort Sunset Walk', startTime: '16:30', endTime: '19:00', cost: 1200, intensity: 'moderate' }
      ]
    }
  ],
  flexibility: {
    percentage: 78,
    bufferFormatted: '2h 15m',
    totalBufferMinutes: 135
  },
  disruption: {
    isActive: true,
    type: 'FLIGHT_DELAY',
    delayMinutes: 90
  },
  journeyHealth: { score: 94, status: 'EXCELLENT' }
}

// Sample mock operator context
const mockOperatorContext = {
  activeToursCount: 12,
  focalTour: {
    id: 'GOA-2048',
    title: 'Goa Coastal Escape',
    destination: 'Goa, India',
    travelers: 'Aryan & Riya Sharma',
    status: 'disruption_active'
  },
  disruptions: [
    {
      id: 'DIS-2024-001',
      severity: 'High',
      status: 'Active',
      title: 'Flight 6E-204 Delayed',
      tourId: 'GOA-2048'
    }
  ],
  journeyHealth: { score: 94, status: 'OPTIMAL' }
}

const testCases = [
  // 1. Famous spots in Jaipur with interest match %, budget/schedule fit, and personalized addition
  {
    role: 'traveler',
    query: 'famous spots in jaipur',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('Jaipur')) return 'Missing Jaipur in response'
      if (!res.message.includes('Amber Fort') && !res.message.includes('Hawa Mahal')) return 'Missing key Jaipur spots'
      if (!res.message.includes('Interest Match:') || !res.message.includes('% match')) return 'Missing Interest Match percentage'
      if (!res.message.includes('Budget:') || !res.message.includes('Schedule:')) return 'Missing Budget or Schedule analysis'
      if (!res.message.includes('Personalized Recommendation:')) return 'Missing Personalized Recommendation'
      if (res.message.includes('**')) return 'Response contains raw asterisks (should be clean human format)'
      if (res.message.includes('food, food')) return 'Response contains duplicate tags'
      const addAct = res.actions.find(a => a.type === 'ADD_EXPERIENCE')
      if (!addAct || !addAct.experienceId.includes('jaipur')) return 'Missing ADD_EXPERIENCE action for recommended Jaipur spot'
      return null
    }
  },
  // 2. Places to visit in Kerala
  {
    role: 'traveler',
    query: 'what are the best places to visit in kerala?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('Kerala')) return 'Missing Kerala destination'
      if (!res.message.includes('Houseboat') && !res.message.includes('Tea Plantation')) return 'Missing Kerala spots'
      if (!res.message.includes('Interest Match:')) return 'Missing Interest Match percentage'
      return null
    }
  },
  // 3. Traveler: Disruption explanation
  {
    role: 'traveler',
    query: 'Why was scuba replaced?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.toLowerCase().includes('flight') && !res.message.toLowerCase().includes('delay')) return 'Message missing delay reasoning'
      if (!res.actions.some(a => a.type === 'REPLACE_EXPERIENCE')) return 'Missing REPLACE_EXPERIENCE action'
      return null
    }
  },
  // 4. Traveler: Budget status
  {
    role: 'traveler',
    query: 'How much budget do I have left?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('35,000') || !res.message.includes('380')) return 'Message missing exact budget numbers'
      return null
    }
  },
  // 5. Traveler: Dynamic budget modification
  {
    role: 'traveler',
    query: 'Can you change my budget to 45000?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      const act = res.actions.find(a => a.type === 'MODIFY_BUDGET')
      if (!act || act.amount !== 45000) return 'Missing or incorrect MODIFY_BUDGET action for 45000'
      return null
    }
  },
  // 6. Traveler: Day 1 schedule query
  {
    role: 'traveler',
    query: 'What are we doing on Day 1?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('Day 1') || !res.message.includes('Casa Sol') || !res.message.includes('Sunset Cruise')) return 'Day 1 activities missing from response'
      return null
    }
  },
  // 7. Traveler: Pacing change
  {
    role: 'traveler',
    query: 'Make Day 2 more relaxed',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      const act = res.actions.find(a => a.type === 'MODIFY_PACING')
      if (!act || act.pace !== 'relaxed') return 'Missing MODIFY_PACING relaxed action'
      return null
    }
  },
  // 8. Traveler: Driver / Guide query
  {
    role: 'traveler',
    query: 'Who is our driver in Goa?',
    context: mockTravelerContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('Rajesh Naik')) return 'Missing driver name Rajesh Naik'
      return null
    }
  },
  // 9. Operator: Summarize today's operations
  {
    role: 'operator',
    query: "Summarize today's fleet operations",
    context: mockOperatorContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('GOA-2048')) return 'Missing focal tour reference'
      if (!res.actions.some(a => a.type === 'VIEW_IMPACT')) return 'Missing VIEW_IMPACT action'
      return null
    }
  },
  // 10. Operator: Vendor action queue
  {
    role: 'operator',
    query: 'Which vendors need action for the flight delay?',
    context: mockOperatorContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.message.includes('Rajesh Naik')) return 'Missing vendor details'
      if (!res.actions.some(a => a.type === 'CONFIRM_VENDOR')) return 'Missing CONFIRM_VENDOR action'
      return null
    }
  },
  // 11. Operator: Prepare traveler update
  {
    role: 'operator',
    query: 'Prepare traveler update notification',
    context: mockOperatorContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.actions.some(a => a.type === 'PREPARE_NOTIFICATION')) return 'Missing PREPARE_NOTIFICATION action'
      return null
    }
  },
  // 12. Operator: Disruption analysis
  {
    role: 'operator',
    query: 'Explain the current disruption on Tour GOA-2048',
    context: mockOperatorContext,
    validate: (res) => {
      if (!res.success) return 'Response success is false'
      if (!res.actions.some(a => a.type === 'APPLY_RECOVERY')) return 'Missing APPLY_RECOVERY action'
      return null
    }
  }
]

let passed = 0
let failed = 0

console.log('====================================================')
console.log('🤖 RUNNING DYNAMIC SPOTS & CHATBOT INTELLIGENCE TESTS')
console.log('====================================================\n')

testCases.forEach((tc, i) => {
  const result = provider.ask({
    role: tc.role,
    message: tc.query,
    context: tc.context
  })

  const err = tc.validate(result)
  if (err) {
    console.error(`❌ Test #${i + 1} FAILED [${tc.role}]: "${tc.query}"`)
    console.error(`   Error: ${err}`)
    console.error(`   Got message:\n`, result.message)
    failed++
  } else {
    console.log(`✅ Test #${i + 1} PASSED [${tc.role}]: "${tc.query}"`)
    console.log(`   ↳ Intent: ${result.intent} | Actions: ${result.actions.map(a => a.type).join(', ') || 'None'}`)
    console.log(`   ↳ Sample:\n"${result.message.slice(0, 160)}..."\n`)
    passed++
  }
})

console.log('====================================================')
console.log(`📊 TEST RESULTS: ${passed} PASSED / ${failed} FAILED (Total: ${testCases.length})`)
console.log('====================================================')

if (failed > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
