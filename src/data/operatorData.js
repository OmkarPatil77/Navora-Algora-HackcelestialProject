/**
 * Centralized mock data and constants for Navora Operator Command Center
 */

export const operatorInfo = {
  id: "OP-001",
  name: "Apex Coastal Operations",
  hub: "Goa Hub (GOI-DABOLIM)",
  leadDispatcher: "Devendra Verma",
  role: "Lead Tour Operations Director",
  shift: "Morning Shift (07:00 – 19:00 IST)",
  systemHealth: "Optimal",
  lastSync: "Just now"
}

export const initialOperatorKPIs = {
  activeTours: 12,
  totalTravelers: 28,
  vendorConfirmationsPct: 94,
  openActions: 3,
  activeDisruptions: 1,
  onTimeRate: "97.4%",
  csatScore: "4.92 / 5.0"
}

export const initialOperatorTours = [
  {
    id: "GOA-2048",
    title: "Goa Coastal Escape",
    destination: "Goa, India",
    travelersCount: 2,
    travelersName: "Aryan & Riya Sharma",
    startDate: "12 Oct 2026",
    endDate: "15 Oct 2026",
    durationDays: 4,
    budgetTotal: 35000,
    status: "disruption_active", // dynamically synced with TripPlanningContext
    leadGuide: "Rajesh Naik",
    hotel: "Casa Sol Heritage Villa, Panjim",
    flightRef: "6E-204 (BOM → GOI)",
    pacing: "Balanced",
    tags: ["Active", "Coastal", "Culinary"]
  },
  {
    id: "JAIPUR-1021",
    title: "Royal Rajputana Palaces",
    destination: "Jaipur, Rajasthan",
    travelersCount: 4,
    travelersName: "Kulkarni Family (4 Pax)",
    startDate: "12 Oct 2026",
    endDate: "16 Oct 2026",
    durationDays: 5,
    budgetTotal: 68000,
    status: "on_track",
    leadGuide: "Vikram Rathore",
    hotel: "Alsisar Haveli, Jaipur",
    flightRef: "AI-481 (DEL → JAI)",
    pacing: "Moderate",
    tags: ["Heritage", "Architecture"]
  },
  {
    id: "KERALA-3382",
    title: "Kerala Backwaters & Tea Trails",
    destination: "Munnar & Alleppey",
    travelersCount: 6,
    travelersName: "Mehta Corporate Retreat",
    startDate: "13 Oct 2026",
    endDate: "18 Oct 2026",
    durationDays: 6,
    budgetTotal: 112000,
    status: "on_track",
    leadGuide: "Mathew George",
    hotel: "Spice Tree Munnar & Luxury Houseboat",
    flightRef: "6E-512 (BLR → COK)",
    pacing: "Relaxed",
    tags: ["Nature", "Wellness"]
  },
  {
    id: "LADAKH-4190",
    title: "High Altitude Nubra & Pangong",
    destination: "Leh Ladakh",
    travelersCount: 3,
    travelersName: "Aditya & Friends",
    startDate: "14 Oct 2026",
    endDate: "20 Oct 2026",
    durationDays: 7,
    budgetTotal: 84000,
    status: "on_track",
    leadGuide: "Stanzin Norbu",
    hotel: "Grand Dragon Leh",
    flightRef: "AI-445 (DEL → IXL)",
    pacing: "Active",
    tags: ["Adventure", "Photography"]
  },
  {
    id: "VARANASI-5012",
    title: "Spiritual Ghats & Sarnath Walk",
    destination: "Varanasi, UP",
    travelersCount: 2,
    travelersName: "Dr. Arvind Gupta & Spouse",
    startDate: "12 Oct 2026",
    endDate: "14 Oct 2026",
    durationDays: 3,
    budgetTotal: 29000,
    status: "on_track",
    leadGuide: "Pandit Ramkishan",
    hotel: "BrijRama Palace Varanasi",
    flightRef: "6E-219 (BOM → VNS)",
    pacing: "Gentle",
    tags: ["Culture", "Spiritual"]
  },
  {
    id: "COORG-6110",
    title: "Coffee Estate & Wilderness Trail",
    destination: "Coorg, Karnataka",
    travelersCount: 2,
    travelersName: "Sneha & Rohan",
    startDate: "13 Oct 2026",
    endDate: "16 Oct 2026",
    durationDays: 4,
    budgetTotal: 42000,
    status: "on_track",
    leadGuide: "Bopanna K.",
    hotel: "Evolve Back Kabini / Coorg",
    flightRef: "Self Drive (BLR)",
    pacing: "Relaxed",
    tags: ["Nature", "Couples"]
  }
]

export const initialVendors = [
  {
    id: "VEN-001",
    name: "Goa Transfers Fleet",
    category: "Transport",
    service: "Airport Transfer (Innova Crysta)",
    contactPerson: "Rajesh Naik",
    phone: "+91 98221 44821",
    rating: 4.9,
    status: "requires_action", // "requires_action" | "confirmed" | "updated" | "replaced" | "scheduled"
    statusLabel: "Requires action",
    statusVariant: "danger",
    tourId: "GOA-2048",
    scheduledTime: "10:55",
    updatedTime: "12:15",
    note: "Delayed flight hold down. Gate pickup confirmed to 12:15."
  },
  {
    id: "VEN-002",
    name: "Casa Sol Heritage Villa",
    category: "Accommodation",
    service: "Villa Check-in & Beach Suite",
    contactPerson: "Maria D'Souza",
    phone: "+91 98224 99182",
    rating: 4.8,
    status: "updated",
    statusLabel: "Updated",
    statusVariant: "warning",
    tourId: "GOA-2048",
    scheduledTime: "12:00",
    updatedTime: "13:15",
    note: "Check-in window adjusted for delayed arrival. Welcome drinks held."
  },
  {
    id: "VEN-003",
    name: "Oceanic Adventures",
    category: "Experience / Water Sports",
    service: "Grand Island Scuba Expedition",
    contactPerson: "Captain Vikram",
    phone: "+91 98112 33112",
    rating: 4.7,
    status: "replaced",
    statusLabel: "Replaced",
    statusVariant: "secondary",
    tourId: "GOA-2048",
    scheduledTime: "12:30",
    updatedTime: "16:00",
    note: "Afternoon slot cancelled without penalty. Replaced with Fontainhas Cultural Walk."
  },
  {
    id: "VEN-004",
    name: "Fontainhas Heritage Guild",
    category: "Experience / Cultural Walk",
    service: "Latin Quarter Heritage & Culinary Walk",
    contactPerson: "Luis Fernandes",
    phone: "+91 98228 11982",
    rating: 4.9,
    status: "scheduled",
    statusLabel: "Scheduled",
    statusVariant: "info",
    tourId: "GOA-2048",
    scheduledTime: "16:00",
    updatedTime: "16:00",
    note: "Confirmed for 2 pax late afternoon cultural walk & feni sommelier tasting."
  },
  {
    id: "VEN-005",
    name: "Mandovi Luxury Cruises",
    category: "Experience / Cruise",
    service: "Mandovi River Catamaran Sunset Cruise",
    contactPerson: "Jetty Master",
    phone: "+91 98221 88371",
    rating: 4.8,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "GOA-2048",
    scheduledTime: "18:45",
    updatedTime: "18:45",
    note: "Guarded evening golden-hour slot. Zero conflict."
  },
  {
    id: "VEN-006",
    name: "Fisherman's Wharf Panjim",
    category: "Dining / Culinary",
    service: "Candlelight Riverside Table",
    contactPerson: "Maitre D' Derek",
    phone: "+91 832 242 1500",
    rating: 4.9,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "GOA-2048",
    scheduledTime: "20:30",
    updatedTime: "20:30",
    note: "Table reservation guarded. Coastal Goan set menu pre-arranged."
  },
  {
    id: "VEN-007",
    name: "Rajasthan Royal Transport",
    category: "Transport",
    service: "Heritage Tour Bus (AC Coach)",
    contactPerson: "Mahendra Singh",
    phone: "+91 98290 55142",
    rating: 4.7,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "JAIPUR-1021",
    scheduledTime: "09:00",
    updatedTime: "09:00",
    note: "Daily pickup confirmed for 4-day tour."
  },
  {
    id: "VEN-008",
    name: "Alsisar Haveli",
    category: "Accommodation",
    service: "Heritage Suite (2 Rooms)",
    contactPerson: "Reception Desk",
    phone: "+91 141 247 0001",
    rating: 4.8,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "JAIPUR-1021",
    scheduledTime: "14:00",
    updatedTime: "14:00",
    note: "Welcome ceremony with traditional refreshments."
  },
  {
    id: "VEN-009",
    name: "Kerala Houseboat Operators",
    category: "Experience",
    service: "Premium Houseboat (1 Night)",
    contactPerson: "Captain Thomas",
    phone: "+91 481 236 1241",
    rating: 4.9,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "KERALA-3382",
    scheduledTime: "12:00",
    updatedTime: "12:00",
    note: "Alleppey backwaters cruise with chef on board."
  },
  {
    id: "VEN-010",
    name: "Spice Tree Plantation",
    category: "Experience",
    service: "Tea Estate Tour & Stay",
    contactPerson: "Plantation Manager",
    phone: "+91 486 253 7890",
    rating: 4.8,
    status: "confirmed",
    statusLabel: "Confirmed",
    statusVariant: "success",
    tourId: "KERALA-3382",
    scheduledTime: "10:00",
    updatedTime: "10:00",
    note: "Spice tour and plantation stay confirmed."
  }
]

export const initialDisruptions = [
  {
    id: "DIS-2024-001",
    severity: "High",
    severityVariant: "danger",
    status: "Active",
    statusVariant: "danger",
    title: "Flight 6E-204 Delayed",
    description: "Inbound flight Mumbai (BOM) → Goa (GOI) delayed by 90 minutes due to air traffic congestion",
    tourId: "GOA-2048",
    detectedAt: "2024-09-27 09:15",
    timeChange: "09:20 → 10:50",
    resolutionEta: "2024-09-27 12:00",
    affectedTags: ["Airport Transfer", "Hotel Check-in", "Scuba Diving"],
    aiRecoveryPlan: "Plan B • Balanced recovery applied",
    iconType: "flight"
  },
  {
    id: "DIS-2024-002",
    severity: "Medium",
    severityVariant: "warning",
    status: "Monitoring",
    statusVariant: "warning",
    title: "Heavy Rain Alert",
    description: "IMD issued yellow alert for heavy rainfall in Alleppey region for next 48 hours",
    tourId: "KERALA-3382",
    detectedAt: "2024-09-26 18:30",
    timeChange: null,
    resolutionEta: "2024-09-28 18:00",
    affectedTags: ["Houseboat Cruise", "Backwater Activities"],
    aiRecoveryPlan: "Contingency indoor activities planned",
    iconType: "weather"
  },
  {
    id: "DIS-2024-003",
    severity: "Low",
    severityVariant: "info",
    status: "Resolved",
    statusVariant: "success",
    title: "Guide Schedule Conflict",
    description: "Lead guide Vikram Rathore has a minor scheduling conflict on Day 3 afternoon",
    tourId: "JAIPUR-1021",
    detectedAt: "2024-09-25 14:20",
    timeChange: "15:00 → 16:30",
    resolutionEta: "2024-09-25 16:00",
    affectedTags: ["City Walking Tour"],
    aiRecoveryPlan: "Alternate guide arranged, tour shifted by 90 minutes",
    iconType: "guide"
  }
]

export const initialPayments = [
  {
    transactionId: "PAY-2024-3421",
    subId: "UPI123456789",
    bookingId: "BK-2024-0892",
    tourId: "GOA-2048",
    amount: "₹21,000",
    rawAmount: 21000,
    method: "UPI",
    methodType: "upi",
    date: "2024-09-15",
    type: "Advance",
    status: "Completed",
    statusVariant: "success"
  },
  {
    transactionId: "PAY-2024-3422",
    subId: "NEFT987654321",
    bookingId: "BK-2024-0893",
    tourId: "JAIPUR-1021",
    amount: "₹68,000",
    rawAmount: 68000,
    method: "Bank Transfer",
    methodType: "bank",
    date: "2024-09-14",
    type: "Full",
    status: "Completed",
    statusVariant: "success"
  },
  {
    transactionId: "PAY-2024-3423",
    subId: "CC456789123",
    bookingId: "BK-2024-0894",
    tourId: "KERALA-3382",
    amount: "₹56,000",
    rawAmount: 56000,
    method: "Credit Card",
    methodType: "card",
    date: "2024-09-16",
    type: "Advance",
    status: "Completed",
    statusVariant: "success"
  },
  {
    transactionId: "PAY-2024-3424",
    subId: "UPI789123456",
    bookingId: "BK-2024-0896",
    tourId: "VARANASI-5012",
    amount: "₹29,000",
    rawAmount: 29000,
    method: "UPI",
    methodType: "upi",
    date: "2024-09-10",
    type: "Full",
    status: "Completed",
    statusVariant: "success"
  },
  {
    transactionId: "PAY-2024-3425",
    subId: "PENDING-001",
    bookingId: "BK-2024-0892",
    tourId: "GOA-2048",
    amount: "₹14,000",
    rawAmount: 14000,
    method: "Pending",
    methodType: "pending",
    date: "2024-09-27",
    type: "Balance",
    status: "Pending",
    statusVariant: "warning"
  }
]

export const initialPaymentSummary = [
  {
    customer: "Aryan & Riya Sharma",
    tourId: "GOA-2048",
    location: "Goa, India",
    paid: "₹21,000",
    total: "₹35,000",
    percentage: 60
  },
  {
    customer: "Kulkarni Family (4 Pax)",
    tourId: "JAIPUR-1021",
    location: "Jaipur, Rajasthan",
    paid: "₹68,000",
    total: "₹68,000",
    percentage: 100
  },
  {
    customer: "Mehta Corporate Retreat",
    tourId: "KERALA-3382",
    location: "Munnar & Alleppey",
    paid: "₹56,000",
    total: "₹1,12,000",
    percentage: 50
  },
  {
    customer: "Aditya & Friends",
    tourId: "LADAKH-4190",
    location: "Leh Ladakh",
    paid: "₹0",
    total: "₹84,000",
    percentage: 0
  },
  {
    customer: "Dr. Arvind Gupta & Spouse",
    tourId: "VARANASI-5012",
    location: "Varanasi, UP",
    paid: "₹29,000",
    total: "₹29,000",
    percentage: 100
  }
]

export const initialBookings = [
  {
    id: "BK-2024-0892",
    tourId: "GOA-2048",
    customerName: "Aryan & Riya Sharma",
    email: "aryan.sharma@example.com",
    phone: "+91 98765 43210",
    destination: "Goa Coastal Escape",
    pax: 2,
    bookingDate: "15 Sep 2024",
    travelDates: "12 Oct - 15 Oct 2026",
    totalAmount: "₹35,000",
    paidAmount: "₹21,000",
    paymentStatus: "Partial",
    status: "Active",
    statusVariant: "success",
    hotel: "Casa Sol Heritage Villa",
    guide: "Rajesh Naik"
  },
  {
    id: "BK-2024-0893",
    tourId: "JAIPUR-1021",
    customerName: "Kulkarni Family",
    email: "anand.kulkarni@example.com",
    phone: "+91 98110 99887",
    destination: "Royal Rajputana Palaces",
    pax: 4,
    bookingDate: "14 Sep 2024",
    travelDates: "12 Oct - 16 Oct 2026",
    totalAmount: "₹68,000",
    paidAmount: "₹68,000",
    paymentStatus: "Paid",
    status: "Confirmed",
    statusVariant: "success",
    hotel: "Alsisar Haveli",
    guide: "Vikram Rathore"
  },
  {
    id: "BK-2024-0894",
    tourId: "KERALA-3382",
    customerName: "Mehta Corporate Retreat",
    email: "retreats@mehtagroup.com",
    phone: "+91 99201 55432",
    destination: "Kerala Backwaters & Tea Trails",
    pax: 6,
    bookingDate: "16 Sep 2024",
    travelDates: "13 Oct - 18 Oct 2026",
    totalAmount: "₹1,12,000",
    paidAmount: "₹56,000",
    paymentStatus: "Partial",
    status: "Confirmed",
    statusVariant: "success",
    hotel: "Spice Tree Munnar & Houseboat",
    guide: "Mathew George"
  },
  {
    id: "BK-2024-0895",
    tourId: "LADAKH-4190",
    customerName: "Aditya & Friends",
    email: "aditya.v@example.com",
    phone: "+91 98330 12345",
    destination: "High Altitude Nubra & Pangong",
    pax: 3,
    bookingDate: "18 Sep 2024",
    travelDates: "14 Oct - 20 Oct 2026",
    totalAmount: "₹84,000",
    paidAmount: "₹0",
    paymentStatus: "Pending",
    status: "Pending",
    statusVariant: "warning",
    hotel: "Grand Dragon Leh",
    guide: "Stanzin Norbu"
  },
  {
    id: "BK-2024-0896",
    tourId: "VARANASI-5012",
    customerName: "Dr. Arvind Gupta & Spouse",
    email: "arvind.gupta@meduniv.ac.in",
    phone: "+91 94150 88776",
    destination: "Spiritual Ghats & Sarnath Walk",
    pax: 2,
    bookingDate: "10 Sep 2024",
    travelDates: "12 Oct - 14 Oct 2026",
    totalAmount: "₹29,000",
    paidAmount: "₹29,000",
    paymentStatus: "Paid",
    status: "Confirmed",
    statusVariant: "success",
    hotel: "BrijRama Palace Varanasi",
    guide: "Pandit Ramkishan"
  }
]

export const initialRecentActivity = [
  {
    id: "ACT-01",
    type: "booking",
    title: "New booking received",
    detail: "GOA-2048 - Aryan & Riya Sharma",
    time: "2 hours ago"
  },
  {
    id: "ACT-02",
    type: "payment",
    title: "Payment completed",
    detail: "₹21,000 via UPI for BK-2024-0892",
    time: "3 hours ago"
  },
  {
    id: "ACT-03",
    type: "disruption",
    title: "Disruption resolved",
    detail: "Guide schedule conflict for JAIPUR-1021",
    time: "5 hours ago"
  },
  {
    id: "ACT-04",
    type: "vendor",
    title: "Vendor confirmed",
    detail: "Casa Sol Heritage Villa check-in",
    time: "6 hours ago"
  },
  {
    id: "ACT-05",
    type: "tour",
    title: "Tour completed",
    detail: "VARANASI-5012 - Spiritual Ghats Tour",
    time: "1 day ago"
  }
]

export const initialAttentionItems = [
  {
    id: "ATTN-001",
    type: "VENDOR_CONFIRMATION",
    title: "Airport Transfer Gate Re-timing",
    vendorName: "Goa Transfers Fleet",
    vendorId: "VEN-001",
    tourId: "GOA-2048",
    time: "12:15 Pickup",
    description: "Confirm delayed flight pickup window with driver Rajesh Naik.",
    status: "pending", // "pending" | "resolved"
    actionLabel: "Confirm Vendor"
  },
  {
    id: "ATTN-002",
    type: "ACTIVITY_REPLACEMENT",
    title: "Slot Replacement Review",
    vendorName: "Oceanic Adventures",
    vendorId: "VEN-003",
    tourId: "GOA-2048",
    time: "16:00 Shift",
    description: "Scuba dive replaced with Fontainhas Walk to avoid daylight conflict.",
    status: "pending",
    actionLabel: "Review Replacement"
  },
  {
    id: "ATTN-003",
    type: "TRAVELER_NOTIFICATION",
    title: "Traveler Journey Update",
    vendorName: "Guest Communication",
    tourId: "GOA-2048",
    time: "Immediate",
    description: "Dispatch simulated WhatsApp / In-App notification with adapted Day 1 timetable.",
    status: "pending",
    actionLabel: "Send Notification"
  }
]

export const initialOperatorEventLog = [
  { time: "08:30", text: "Fleet monitoring initialized across 12 active tours.", type: "SYSTEM" },
  { time: "09:00", text: "Tour GOA-2048 scheduled. Inbound flight 6E-204 departing Mumbai.", type: "TOUR" },
  { time: "09:20", text: "All Day 1 vendor allocations confirmed across Goa network.", type: "VENDOR" }
]

