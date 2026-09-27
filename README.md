# 🌍 Navora — Intelligent Travel Planning & Resilient Operations Platform

> **Plan it. Personalize it. Adapt it.**  
> Navora is a next-generation AI-powered travel orchestration platform that bridges personalized traveler journey blueprints with live tour operator fleet management and autonomous disruption recovery.

---

## 🌟 Unique Selling Propositions (USPs)

1. **Self-Healing Connected Dependency Graph**
   - Traditional itineraries break when a flight delays. Navora represents each trip as an interconnected dependency graph.
   - When a disruption occurs (e.g., +90m flight delay), the recovery solver identifies impacted nodes, calculates downstream ripple effects, protects critical evening milestones, and seamlessly substitutes conflicting activities with zero cancellation penalties.

2. **Dual-Sided Unified Ecosystem (Traveler + Fleet Operator)**
   - **Traveler Portal:** Dynamic multi-step journey planning, interest matching, budget buffer calibration, and live itinerary management.
   - **Operator Command Center:** Fleet-wide operational visibility across active tour cohorts, telemetry monitoring, vendor dispatch queues, attention items, and instant WhatsApp traveler notifications.

3. **Deterministic Core + LLM-Assisted Intelligence (Navora Copilot)**
   - Combines a mathematically grounded constraint solver with conversational LLM intelligence (Qwen 2.5 / Hugging Face).
   - The AI acts as a transparent advisor, proposing structured **`PROPOSED CHANGE`** and **`OPERATIONS ACTION`** cards that users can inspect and apply with a single click.

4. **Zero-Hallucination Action Validator & Executor Architecture**
   - AI suggestions are strictly validated against active inventory catalogues, time buffers, and financial ceilings before state execution.
   - Guarantees itinerary integrity and budget boundaries under all dynamic user queries.

5. **Decision Explainability & Journey Health Telemetry**
   - Complete algorithmic transparency: Travelers and operators can click *"Why was this adapted?"* or *"Why was this protected?"* to view exact constraints, factor weights, and trade-offs.
   - Real-time journey health scoring (0–100) evaluating fatigue distribution, buffer ratios, and schedule risk.

---

## 🚀 Core Functionalities

### 🎒 Traveler Journey Suite
- **Interactive Planning Flow:** Destination discovery (Goa, Jaipur, Kerala, Dubai, Singapore), dynamic duration, traveler composition, budget allocation, and interest tags.
- **Curated Experiences Catalogue:** Multi-destination catalog with category filters, ratings, pace levels, and duration breakdowns.
- **Dynamic Itinerary Engine:** Day-by-day timetable scheduling, flexible vs. fixed node tagging, and pacing adjustments (Relaxed, Balanced, Fast-Paced).
- **Famous Spots & Attraction Discovery:** Dynamic natural language query engine that calculates **Interest Match %**, **Budget Fit**, **Schedule Feasibility**, and personalized recommendations.
- **Simulated Disruption & Recovery:** Test flight delay scenarios and preview 3 algorithmic recovery strategies (Plan A: Deferral, Plan B: Balanced Substitution, Plan C: Minimal Impact).

### 🛡️ Operator Command Center
- **Active Tours Fleet Monitor:** Live overview of active tour cohorts with health scores, guide assignments, and status flags.
- **Vendor Dispatch & Action Queue:** Real-time ground coordination with chauffeurs, villa hosts, and activity providers.
- **Attention Items & Anomaly Resolution:** Automated flagging of time-sensitive tarmac delays and guide re-allocations.
- **Dedicated Operator Management Hubs:**
  - 📋 **Bookings:** Comprehensive booking ledger with lifecycle statuses, amounts, and traveler counts.
  - 🏢 **Vendors:** Tiered vendor registry with SLA ratings, service categories, and dispatch statuses.
  - ⚠️ **Disruptions:** Real-time incident logs, severity scoring, affected tags, and resolution triggers.
  - 💳 **Payments:** Inflow/outflow tracking, payment gateway health, and payout batch management.
  - 📊 **Reports:** Fleet metrics, on-time performance, customer satisfaction ratings, and incident resolution times.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** | Core UI component architecture |
| **Build Tool** | **Vite 8** | High-performance bundling and HMR |
| **Styling** | **Tailwind CSS 3** | Responsive utility styling with custom warm-editorial palette |
| **Animations** | **Framer Motion** | Micro-animations, drawer transitions, and modal flows |
| **Icons** | **Lucide React** | Consistent, modern iconography |
| **Routing** | **React Router v7** | Client-side routing with Role-Based Access Control (RBAC) |
| **LLM & AI Engine** | **Hugging Face Inference API** (`Qwen/Qwen2.5-Coder-32B-Instruct`) | Natural language understanding and copilot reasoning |
| **Fallback Engine** | **Deterministic Graph Solver** | In-client resilient fallback with 0 runtime errors |
| **Backend (Optional Proxy)** | **Express / Node.js** | Backend API for secure LLM proxying |

---

## 📂 Project Architecture

```
Navora-Hackcelestial3.0/
├── src/
│   ├── components/
│   │   ├── landing/          # Hero, planning features, adaptation preview, CTA
│   │   ├── layout/           # AppLayout, Navbar, Footer
│   │   ├── navigation/       # Traveler & Operator sidebar navigation
│   │   ├── operator/         # Operator Ops Copilot, recovery panels, vendor queues
│   │   ├── shared/           # Logo, modals, explainability dialogs, cards
│   │   └── traveler/         # Navora Copilot, step wizards, itinerary builders, widgets
│   ├── context/
│   │   ├── AuthContext.jsx          # Role-based auth (Traveler vs Operator)
│   │   └── TripPlanningContext.jsx  # Central trip state, disruptions, recovery solver
│   ├── data/
│   │   ├── experiences.js    # Curated experiences across all destinations
│   │   ├── realData.js       # Destinations, interests, default preferences
│   │   └── operatorData.js   # Fleet roster, vendor metrics, SLA stats
│   ├── pages/
│   │   ├── Home.jsx                 # Editorial landing page
│   │   ├── Plan.jsx                 # Multi-step trip planner wizard
│   │   ├── Recommendations.jsx      # Curated experience discovery
│   │   ├── Trip.jsx                 # Dynamic itinerary & disruption sandbox
│   │   ├── Checkout.jsx             # Booking confirmation & price summary
│   │   ├── OperatorDashboard.jsx    # Fleet overview command center
│   │   ├── OperatorBookings.jsx     # Booking management table
│   │   ├── OperatorVendors.jsx      # Vendor network & performance
│   │   ├── OperatorDisruptions.jsx  # Incident tracker & recovery console
│   │   ├── OperatorPayments.jsx     # Financial tracking & payouts
│   │   ├── OperatorReports.jsx      # Fleet analytics & SLA reports
│   │   └── OperatorTourDetail.jsx   # Deep-dive tour telemetry & recovery
│   └── services/
│       ├── aiActionValidator.js        # Validates traveler proposed AI actions
│       ├── aiActionExecutor.js         # Executes approved actions into state
│       ├── operatorActionValidator.js  # Validates operator operations actions
│       ├── operatorActionExecutor.js   # Executes operator operations into state
│       ├── copilotService.js           # Context builder & dual-provider router
│       └── demoFallbackProvider.js     # Deterministic NLP reasoning & spot engine
├── server/
│   ├── index.js              # Express backend server (port 3001)
│   ├── prompts/              # System prompts for traveler & operator roles
│   └── services/             # Hugging Face inference & context builder
└── scripts/
    ├── test_dynamic_chatbot.mjs  # Automated test suite for dynamic inputs
    └── rename_brand.mjs          # Brand alignment utility
```

## 👥 Roles & Access (Demo RBAC)

- **Traveler Mode:** Navigate to `/plan`, `/recommendations`, or `/trip` to build custom itineraries, chat with Navora Copilot, and test flight disruptions.
- **Operator Mode:** Switch role via Navbar or navigate to `/operator` to access the Command Center, manage active cohorts, monitor vendors, and trigger recovery strategies.

---

## 📄 License
MIT License © 2026 **Navora**. Engineered for HackCelestial 3.0.
