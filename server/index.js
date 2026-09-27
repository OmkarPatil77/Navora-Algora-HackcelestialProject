import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { copilotService } from './services/copilotService.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Health Check
app.get('/api/health', (req, res) => {
  const token = process.env.HUGGINGFACEHUB_API_TOKEN || process.env.HF_TOKEN
  res.json({
    status: 'online',
    service: 'Navora Copilot Backend',
    model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    hfConfigured: Boolean(token && token.trim().length > 5)
  })
})

// POST /api/copilot
app.post('/api/copilot', async (req, res) => {
  try {
    const { role, message, context, history } = req.body || {}
    const result = await copilotService.ask({ role, message, context, history })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[Server Error in /api/copilot]:', err)
    return res.status(200).json({
      success: true,
      intent: 'GENERAL',
      message: 'The assistant is temporarily using Navora\'s built-in journey intelligence.',
      actions: [],
      recommendedExperienceIds: [],
      explanation: null,
      source: 'demo_fallback'
    })
  }
})

app.listen(PORT, () => {
  const token = process.env.HUGGINGFACEHUB_API_TOKEN || process.env.HF_TOKEN
  console.log(`[Navora Backend] Server listening on http://localhost:${PORT}`)
  console.log(`[Navora Backend] HF Token Status: ${token ? 'Configured' : 'Missing (Using Deterministic Fallback Engine)'}`)
})
