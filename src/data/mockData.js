export const mockDestinations = [
  {
    id: "goa",
    name: "Goa, India",
    city: "Goa",
    country: "India",
    tagline: "Sun-drenched coastlines, heritage Latin quarters, and vibrant seafood.",
    description: "A tropical blend of Portuguese heritage, serene southern coves, bustling northern beaches, and coastal culinary traditions.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    vibes: ["Coastal", "Heritage", "Laid-back", "Nightlife", "Water Sports"],
    defaultDurationDays: 4,
    recommendedBudget: 35000,
    region: "West Coast, India"
  },
  {
    id: "jaipur",
    name: "Jaipur, Rajasthan",
    city: "Jaipur",
    country: "India",
    tagline: "Regal palaces, timeless forts, and vibrant artisan bazaars.",
    description: "The historic Pink City steeped in royal Rajput history, grand hill forts, culinary royalty, and authentic block-print textile crafts.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    vibes: ["Royal", "Architecture", "Culinary", "Artisan", "History"],
    defaultDurationDays: 4,
    recommendedBudget: 42000,
    region: "North India"
  },
  {
    id: "kerala",
    name: "Munnar & Alleppey, Kerala",
    city: "Kerala",
    country: "India",
    tagline: "Emerald tea plantations, tranquil backwaters, and Ayurvedic calm.",
    description: "God's Own Country offering mist-kissed Western Ghats highlands, lush spice hills, and leisurely private houseboat journeys.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    vibes: ["Nature", "Backwaters", "Wellness", "Tea Hills", "Slow Travel"],
    defaultDurationDays: 5,
    recommendedBudget: 48000,
    region: "South India"
  },
  {
    id: "dubai",
    name: "Dubai, United Arab Emirates",
    city: "Dubai",
    country: "UAE",
    tagline: "Futuristic architecture, desert safaris, and luxury waterfronts.",
    description: "A dynamic metropolis where soaring skyline feats meet desert adventures, Michelin-starred gastronomy, and luxury leisure.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    vibes: ["Luxury", "Skyline", "Desert Safari", "Shopping", "Modern"],
    defaultDurationDays: 5,
    recommendedBudget: 95000,
    region: "Middle East"
  },
  {
    id: "singapore",
    name: "Singapore",
    city: "Singapore",
    country: "Singapore",
    tagline: "Garden city marvels, world-class hawker culture, and urban serenity.",
    description: "An ultra-modern garden metropolis blending verdant biodiversity at Gardens by the Bay with legendary street food enclaves.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    vibes: ["Urban Nature", "Hawker Food", "Futuristic", "Culture", "Walkable"],
    defaultDurationDays: 4,
    recommendedBudget: 110000,
    region: "Southeast Asia"
  }
];

export const interestCatalogue = [
  { id: "adventure", label: "Adventure", iconName: "Mountain", desc: "Trekking, diving, rafting & thrills" },
  { id: "beaches", label: "Beaches", iconName: "Waves", desc: "Coastal relaxation & sunset coves" },
  { id: "food", label: "Food & Dining", iconName: "UtensilsCrossed", desc: "Street tastings, fine dining & cafes" },
  { id: "culture", label: "Culture & Living", iconName: "Landmark", desc: "Traditions, local life & festivals" },
  { id: "nature", label: "Nature & Wildlife", iconName: "Trees", desc: "National parks, trails & greenery" },
  { id: "nightlife", label: "Nightlife", iconName: "Sparkles", desc: "Live music, cocktail bars & clubs" },
  { id: "wellness", label: "Wellness & Spa", iconName: "HeartHandshake", desc: "Yoga retreats, thermal baths & calm" },
  { id: "shopping", label: "Shopping", iconName: "ShoppingBag", desc: "Artisan markets & designer boutiques" },
  { id: "history", label: "History", iconName: "Hourglass", desc: "Monuments, ancient ruins & relics" },
  { id: "art", label: "Art & Architecture", iconName: "Palette", desc: "Galleries, installations & design" },
  { id: "photography", label: "Photography", iconName: "Camera", desc: "Scenic vantage points & golden hours" },
  { id: "luxury", label: "Luxury & Leisure", iconName: "Gem", desc: "Private charters & bespoke luxury" }
];

export const defaultTripPreferences = {
  destination: {
    name: "Goa, India",
    city: "Goa",
    country: "India",
    region: "West Coast, India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
  },
  startDate: "2026-10-12",
  endDate: "2026-10-16",
  duration: {
    days: 4,
    nights: 3,
    formatted: "4 Days / 3 Nights"
  },
  travelers: {
    adults: 2,
    children: 0,
    infants: 0,
    total: 2,
    composition: "2 Adults"
  },
  interests: ["adventure", "food", "beaches"],
  travelStyle: {
    pace: "balanced", // relaxed, balanced, fast-paced
    accommodation: "comfort", // budget, comfort, premium, luxury
    transportation: ["flight", "private-car"], // flight, train, bus, private-car, rental-car, public-transport
    priority: "experiences" // experiences, comfort, saving-money, convenience
  },
  budget: {
    total: 35000,
    currency: "INR",
    breakdown: {
      accommodation: 12250, // ~35%
      transport: 8750,      // ~25%
      activities: 6300,     // ~18%
      food: 4900,           // ~14%
      buffer: 2800          // ~8%
    }
  }
};

export const defaultTripPlan = {
  id: "trip-goa-2026",
  destination: "Goa, India",
  duration: "4 Days / 3 Nights",
  daysCount: 4,
  travelers: 2,
  travelerType: "Couple / Friends",
  budget: {
    total: 35000,
    spent: 24200,
    currency: "INR",
    breakdown: {
      stays: 14000,
      activities: 6500,
      dining: 7500,
      transit: 4000,
      contingency: 3000
    }
  },
  interests: ["Adventure", "Food", "Beaches", "Heritage"],
  travelStyle: "Balanced",
  startDate: "2026-10-14",
  endDate: "2026-10-17",
  status: "Active",
  weather: {
    temp: "29°C",
    condition: "Sunny with Coastal Breeze",
    icon: "Sun"
  }
};

export const mockRecommendations = [
  {
    id: "rec-1",
    title: "Fontainhas Heritage Food & Feni Walk",
    category: "Food & Culture",
    location: "Panjim, North Goa",
    price: 1800,
    duration: "3 Hours",
    rating: 4.9,
    reviewsCount: 142,
    matchScore: 98,
    matchReason: "Matches your high interest in authentic culinary experiences and heritage architecture.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tags: ["Food Walk", "Tasting", "Walking Tour"],
    bestTime: "Late Afternoon (16:30)"
  },
  {
    id: "rec-2",
    title: "Scuba Diving & Island Exploration",
    category: "Adventure",
    location: "Grand Island, South Goa",
    price: 3200,
    duration: "5 Hours",
    rating: 4.8,
    reviewsCount: 310,
    matchScore: 94,
    matchReason: "Aligned with your 'Adventure' preference while fitting well within the activity budget.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tags: ["Water Sports", "Certified Instructors", "Boat Ride"],
    bestTime: "Morning (07:30)"
  },
  {
    id: "rec-3",
    title: "Cabo de Rama Sunset Cliff Picnic",
    category: "Beaches & Leisure",
    location: "Cabo de Rama, South Goa",
    price: 1200,
    duration: "2.5 Hours",
    rating: 4.9,
    reviewsCount: 88,
    matchScore: 91,
    matchReason: "Serene scenic spot fitting a balanced pace away from crowded beaches.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Scenic Views", "Sunset", "Romantic"],
    bestTime: "Sunset (17:15)"
  },
  {
    id: "rec-4",
    title: "Spice Plantation Organic Lunch & Tour",
    category: "Nature & Culinary",
    location: "Ponda, Central Goa",
    price: 900,
    duration: "2 Hours",
    rating: 4.7,
    reviewsCount: 205,
    matchScore: 89,
    matchReason: "Rich authentic Goan lunch prepared with freshly harvested spices.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    tags: ["Organic", "Buffet", "Nature"],
    bestTime: "Lunch (12:30)"
  },
  {
    id: "rec-5",
    title: "Sunset Catamaran River Cruise",
    category: "Beaches & Leisure",
    location: "Mandovi River Jetty",
    price: 1500,
    duration: "2 Hours",
    rating: 4.8,
    reviewsCount: 198,
    matchScore: 93,
    matchReason: "Tranquil evening cruise calibrated for couple/friends balanced travel pace.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    tags: ["River Cruise", "Sunset", "Drinks"],
    bestTime: "Late Afternoon (17:00)"
  },
  {
    id: "rec-6",
    title: "Historic Fort Aguada & Lighthouse Trail",
    category: "Culture & Living",
    location: "Sinquerim, North Goa",
    price: 600,
    duration: "2.5 Hours",
    rating: 4.6,
    reviewsCount: 175,
    matchScore: 88,
    matchReason: "17th-century Portuguese fortress overlooking the Arabian Sea.",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
    tags: ["Fortress", "Coastal Views", "Heritage"],
    bestTime: "Morning (09:00)"
  }
];

export const mockItinerary = [
  {
    day: 1,
    date: "14 Oct 2026",
    title: "Arrival, Latin Quarter & Sunset by the River",
    status: "Adapted",
    hasDisruption: true,
    disruptionNote: "Flight 6E-204 delayed by 2 hrs. Sunset Cruise automatically rescheduled to Day 2 morning.",
    activities: [
      {
        id: "act-101",
        time: "13:30",
        title: "Landing at Dabolim Airport & Cab Pickup",
        type: "Transit",
        location: "Dabolim Airport",
        status: "Completed",
        notes: "Pre-assigned driver waiting at Gate 2"
      },
      {
        id: "act-102",
        time: "15:00",
        title: "Check-in at Heritage Boutique Villa",
        type: "Stay",
        location: "Panjim Riverside",
        status: "Completed",
        notes: "Welcome drink & check-in done"
      },
      {
        id: "act-103",
        time: "16:45",
        title: "Fontainhas Latin Quarter Walking & Cafe Stop",
        type: "Culture",
        location: "Panjim",
        status: "In Progress",
        notes: "Visit Confeitaria 31 de Janeiro for pastel de nata"
      },
      {
        id: "act-104",
        time: "19:30",
        title: "Heritage Goan Dinner at Viva Panjim",
        type: "Dining",
        location: "Panjim",
        status: "Scheduled",
        notes: "AI updated booking due to flight shift"
      }
    ]
  },
  {
    day: 2,
    date: "15 Oct 2026",
    title: "Morning Mandovi Cruise & Coastal Water Sports",
    status: "Optimized",
    hasDisruption: false,
    activities: [
      {
        id: "act-201",
        time: "08:30",
        title: "Morning Catamaran River Cruise",
        type: "Activity",
        location: "Mandovi River Jetty",
        status: "Scheduled",
        notes: "Recovered slot seamlessly swapped by Navora AI"
      },
      {
        id: "act-202",
        time: "11:30",
        title: "Anjuna & Vagator Cliffside Exploration",
        type: "Sightseeing",
        location: "North Goa",
        status: "Scheduled",
        notes: "Curated scenic photo spots"
      },
      {
        id: "act-203",
        time: "17:00",
        title: "Sun-downer at Thalassa & Sea View Dinner",
        type: "Dining",
        location: "Siolim / Vagator",
        status: "Scheduled",
        notes: "Reserved table overlooking the backwaters"
      }
    ]
  },
  {
    day: 3,
    date: "16 Oct 2026",
    title: "South Goa Serenity & Cabo de Rama",
    status: "On Schedule",
    hasDisruption: false,
    activities: [
      {
        id: "act-301",
        time: "09:00",
        title: "Scenic Coastal Drive to South Goa",
        type: "Transit",
        location: "Panjim to Agonda",
        status: "Scheduled",
        notes: "Self-drive Thar rental delivered"
      },
      {
        id: "act-302",
        time: "16:00",
        title: "Cabo de Rama Fort & Cliffside Sunset",
        type: "Experience",
        location: "Cabo de Rama",
        status: "Scheduled",
        notes: "High rating recommendation"
      }
    ]
  },
  {
    day: 4,
    date: "17 Oct 2026",
    title: "Artisan Souvenirs & Departure",
    status: "On Schedule",
    hasDisruption: false,
    activities: [
      {
        id: "act-401",
        time: "10:00",
        title: "Local Spice & Cashew Market Visit",
        type: "Shopping",
        location: "Mapusa / Panjim",
        status: "Scheduled",
        notes: "Authentic feni & roasted spices"
      },
      {
        id: "act-402",
        time: "14:30",
        title: "Airport Drop & Flight Home",
        type: "Transit",
        location: "Goa Airport",
        status: "Scheduled",
        notes: "Navora real-time terminal monitor active"
      }
    ]
  }
];

export const mockDisruptionFlow = {
  trigger: "Flight 6E-204 Delayed (+135 min)",
  severity: "Moderate Impact",
  timeDetected: "12:15 PM IST",
  affectedItems: [
    { title: "Airport Pickup Transfer", originalTime: "13:00", adjustedTime: "15:15", status: "Auto-Rescheduled" },
    { title: "Mandovi Sunset Cruise", originalTime: "17:30", adjustedTime: "Day 2, 08:30", status: "Slot Recovered" },
    { title: "Panjim Dinner Reservation", originalTime: "19:00", adjustedTime: "20:30", status: "Confirmed" }
  ],
  aiActionSummary: "Detected tight connection window. Automatically notified cab operator, negotiated slot roll-over for cruise at zero penalty, and pushed dinner table by 90 minutes.",
  recoveryConfidence: 99.2
};

export const mockOperatorStats = {
  activeTours: 18,
  totalTravelers: 74,
  disruptionAlerts: 3,
  resolvedToday: 12,
  onTimeRate: "94.8%",
  csatScore: "4.92 / 5.0"
};

export const mockOperatorTours = [
  {
    id: "tour-801",
    code: "TS-GOA-108",
    title: "Goa Coastal & Heritage Expedition (4D/3N)",
    leadTraveler: "Anish Sharma",
    travelersCount: 2,
    destination: "Goa, India",
    currentLocation: "Panjim, Latin Quarter",
    stage: "Day 1 of 4",
    status: "Action Required",
    disruptionType: "Flight Delay",
    severity: "warning",
    vendorCount: 4,
    progress: 25,
    assignedOperator: "Rhea Deshmukh"
  },
  {
    id: "tour-802",
    code: "TS-RAJ-214",
    title: "Royal Rajasthan Heritage Trail (6D/5N)",
    leadTraveler: "Vikram Singhania",
    travelersCount: 4,
    destination: "Jaipur - Udaipur",
    currentLocation: "Amer Fort, Jaipur",
    stage: "Day 3 of 6",
    status: "All Smooth",
    disruptionType: "None",
    severity: "success",
    vendorCount: 8,
    progress: 50,
    assignedOperator: "Karan Mehta"
  },
  {
    id: "tour-803",
    code: "TS-KER-309",
    title: "Kerala Backwaters & Spice Retreat (5D/4N)",
    leadTraveler: "Priya & David Nair",
    travelersCount: 2,
    destination: "Alleppey & Munnar",
    currentLocation: "Vembanad Lake Houseboat",
    stage: "Day 2 of 5",
    status: "Weather Watch",
    disruptionType: "Localized Rain Warning",
    severity: "info",
    vendorCount: 5,
    progress: 40,
    assignedOperator: "Sujith Kumar"
  },
  {
    id: "tour-804",
    code: "TS-HIM-412",
    title: "Spiti Valley High Altitude Safari (7D/6N)",
    leadTraveler: "Aarav Kapoor Group",
    travelersCount: 6,
    destination: "Kaza, Spiti",
    currentLocation: "Tabo Monastery",
    stage: "Day 4 of 7",
    status: "All Smooth",
    disruptionType: "None",
    severity: "success",
    vendorCount: 6,
    progress: 58,
    assignedOperator: "Tenzin Norbu"
  }
];
