import { goaExperiences, getExperiencesByDestination, allExperiences } from '@/data/experiences'

/**
 * Destination-specific logistical, hospitality, and culinary profiles
 */
export const destinationProfiles = {
  goa: {
    city: "Goa",
    airportCode: "GOI",
    airportLocation: "Dabolim International Terminal (GOI)",
    airportCoord: { lat: 15.38, lng: 73.83 },
    flightInbound: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
    flightOutbound: "Outbound Flight: Goa (GOI) → Mumbai (BOM)",
    flightDuration: 75,
    flightCost: 4200,
    hotel: {
      name: "Heritage Boutique Villa & Resort",
      location: "Panjim Riverside / Candolim",
      coordinates: { lat: 15.501, lng: 73.815 }
    },
    welcomeLunch: {
      title: "Welcome Traditional Goan Fish Thali & Kokum Kadhi",
      location: "Panjim Heritage Bistro",
      cost: 650,
      coordinates: { lat: 15.498, lng: 73.827 }
    },
    sunsetDinner: {
      title: "Riverside Candlelight Dinner",
      location: "Viva Panjim / Waterfront Bistro",
      cost: 900,
      coordinates: { lat: 15.498, lng: 73.827 }
    },
    villaBreakfast: {
      title: "Tropical Villa Breakfast with Fresh Poi Bread",
      cost: 350
    },
    midLunch: {
      title: "Artisan Coastal Shack Lunch & Tender Coconut",
      location: "Beachside Shacks / Garden Bistro",
      cost: 600
    },
    midDinner: {
      title: "Chef's Curated Goan Balchão & Seafood Dinner",
      location: "Cliffside / Latin Quarter",
      cost: 850
    },
    farewellLunch: {
      title: "Coastal Farewell Seafood Lunch",
      location: "Panjim Waterfront Bistro",
      cost: 700
    },
    tripIdPrefix: "TS-GOA",
    dayTitles: [
      { title: "Arrival & Latin Quarter Sunset", theme: "Arrival" },
      { title: "Coastal Waters, Scuba & Coves", theme: "Adventure" },
      { title: "Culture, Spice & River Trails", theme: "Culture" },
      { title: "Scenic South Goa Coves & Serenity", theme: "Leisure" },
      { title: "Heritage Souvenirs & Departure", theme: "Departure" }
    ]
  },
  jaipur: {
    city: "Jaipur",
    airportCode: "JAI",
    airportLocation: "Jaipur International Airport (JAI Terminal 2)",
    airportCoord: { lat: 26.828, lng: 75.805 },
    flightInbound: "Inbound Flight: Delhi (DEL) → Jaipur (JAI)",
    flightOutbound: "Outbound Flight: Jaipur (JAI) → Delhi (DEL)",
    flightDuration: 60,
    flightCost: 3800,
    hotel: {
      name: "Royal Heritage Haveli & Palace Suites",
      location: "Civil Lines / Bani Park, Jaipur",
      coordinates: { lat: 26.924, lng: 75.787 }
    },
    welcomeLunch: {
      title: "Royal Rajasthani Thali & Dal Baati Churma",
      location: "LMB (Laxmi Mishthan Bhandar), Johari Bazaar",
      cost: 750,
      coordinates: { lat: 26.920, lng: 75.824 }
    },
    sunsetDinner: {
      title: "Nahargarh Fort View Rooftop Candlelight Dinner",
      location: "Peacock Rooftop / Padao Amber",
      cost: 950,
      coordinates: { lat: 26.936, lng: 75.816 }
    },
    villaBreakfast: {
      title: "Haveli Courtyard Breakfast with Pyaaz Kachori & Masala Chai",
      cost: 380
    },
    midLunch: {
      title: "Artisan Spice Lunch & Gatte Ki Sabzi",
      location: "1135 AD Amber Courtyard",
      cost: 700
    },
    midDinner: {
      title: "Regal Rajputana Dinner with Live Sarangi Music",
      location: "Chokhi Dhani Heritage Courtyard",
      cost: 1100
    },
    farewellLunch: {
      title: "Pink City Farewell Thali Lunch",
      location: "Handi Restaurant, MI Road",
      cost: 750
    },
    tripIdPrefix: "TS-JAI",
    dayTitles: [
      { title: "Pink City Arrival & Old Bazaar Sunset", theme: "Arrival" },
      { title: "Grand Hillforts & Amer Palace Grandeur", theme: "Heritage" },
      { title: "Royal Architecture & Artisan Textile Trails", theme: "Culture" },
      { title: "Stepwells, Observatories & Craft Villages", theme: "Exploration" },
      { title: "Bazaar Souvenirs & Royal Departure", theme: "Departure" }
    ]
  },
  kerala: {
    city: "Kerala",
    airportCode: "COK",
    airportLocation: "Cochin International Airport (COK)",
    airportCoord: { lat: 10.155, lng: 76.391 },
    flightInbound: "Inbound Flight: Bangalore (BLR) → Kochi (COK)",
    flightOutbound: "Outbound Flight: Kochi (COK) → Bangalore (BLR)",
    flightDuration: 70,
    flightCost: 4400,
    hotel: {
      name: "Emerald Lake Ayurvedic & Backwater Villa",
      location: "Kumarakom / Alleppey Backwaters",
      coordinates: { lat: 9.617, lng: 76.430 }
    },
    welcomeLunch: {
      title: "Traditional Kerala Sadya on Fresh Banana Leaf",
      location: "Grand Pavilion / Backwater Bistro",
      cost: 600,
      coordinates: { lat: 9.615, lng: 76.432 }
    },
    sunsetDinner: {
      title: "Karimeen Pollichathu & Appam Dinner by the Water",
      location: "Kumarakom Waterfront Lounge",
      cost: 950,
      coordinates: { lat: 9.618, lng: 76.428 }
    },
    villaBreakfast: {
      title: "Steaming Appam, Veg Stew & Fresh Coconut Water",
      cost: 320
    },
    midLunch: {
      title: "Backwater Toddy-Shop Spiced Catch Lunch",
      location: "Alleppey Canal Bistro",
      cost: 650
    },
    midDinner: {
      title: "Houseboat Candlelight Dinner Under Starlit Palm Canals",
      location: "Vembanad Lake Waters",
      cost: 1000
    },
    farewellLunch: {
      title: "Malabar Spice Coastal Farewell Lunch",
      location: "Fort Kochi Heritage Cafe",
      cost: 700
    },
    tripIdPrefix: "TS-KER",
    dayTitles: [
      { title: "Cochin Arrival & Scenic Backwater Check-in", theme: "Arrival" },
      { title: "Tranquil Houseboat Cruise & Lagoon Waters", theme: "Nature" },
      { title: "Munnar Misty Tea Plantations & Spice Hills", theme: "Exploration" },
      { title: "Ayurvedic Wellness & Village Canoeing", theme: "Wellness" },
      { title: "Spice Treasures & Scenic Departure", theme: "Departure" }
    ]
  },
  dubai: {
    city: "Dubai",
    airportCode: "DXB",
    airportLocation: "Dubai International Airport (DXB Terminal 3)",
    airportCoord: { lat: 25.253, lng: 55.365 },
    flightInbound: "Inbound Flight: Mumbai (BOM) → Dubai (DXB)",
    flightOutbound: "Outbound Flight: Dubai (DXB) → Mumbai (BOM)",
    flightDuration: 200,
    flightCost: 12500,
    hotel: {
      name: "The Address Downtown & Luxury Marina Suites",
      location: "Downtown Dubai / Marina Boulevard",
      coordinates: { lat: 25.195, lng: 55.278 }
    },
    welcomeLunch: {
      title: "Emirati Mezze & Mediterranean Grilled Catch Lunch",
      location: "Al Fanar Waterfront Bistro",
      cost: 1400,
      coordinates: { lat: 25.223, lng: 55.270 }
    },
    sunsetDinner: {
      title: "Dubai Marina Promenade Skyline Dinner",
      location: "Pier 7 / Marina Promenade",
      cost: 2200,
      coordinates: { lat: 25.078, lng: 55.139 }
    },
    villaBreakfast: {
      title: "Skyline Terrace Continental & Arabic Breakfast Buffet",
      cost: 650
    },
    midLunch: {
      title: "Downtown Gourmet Lunch with Burj Khalifa Views",
      location: "Souk Al Bahar Waterfront",
      cost: 1600
    },
    midDinner: {
      title: "Bedouin Desert Camp Starlit BBQ Banquet",
      location: "Lahbab Red Dunes Bedouin Camp",
      cost: 1800
    },
    farewellLunch: {
      title: "Gourmet Farewell Mezze & Shawarma Feast",
      location: "Dubai Mall Waterfront Promenade",
      cost: 1500
    },
    tripIdPrefix: "TS-DXB",
    dayTitles: [
      { title: "Arrival & Soaring Downtown Skylines", theme: "Arrival" },
      { title: "Red Dune Desert Safari & Arabian Nights", theme: "Adventure" },
      { title: "Futuristic Marvels & Marina Yacht Sailing", theme: "Luxury" },
      { title: "Heritage Al Fahidi & Souk Exploration", theme: "Culture" },
      { title: "Gold Souk Shopping & Luxury Departure", theme: "Departure" }
    ]
  },
  singapore: {
    city: "Singapore",
    airportCode: "SIN",
    airportLocation: "Singapore Changi Airport (SIN Jewel Terminal 3)",
    airportCoord: { lat: 1.364, lng: 103.991 },
    flightInbound: "Inbound Flight: Delhi (DEL) → Singapore (SIN)",
    flightOutbound: "Outbound Flight: Singapore (SIN) → Delhi (DEL)",
    flightDuration: 330,
    flightCost: 16500,
    hotel: {
      name: "Marina Bay Heritage & Garden Hotel",
      location: "Marina Bay / Clarke Quay Enclave",
      coordinates: { lat: 1.284, lng: 103.859 }
    },
    welcomeLunch: {
      title: "Legendary Hainanese Chicken Rice & Dim Sum Lunch",
      location: "Lau Pa Sat Historic Hawker Festival",
      cost: 850,
      coordinates: { lat: 1.280, lng: 103.850 }
    },
    sunsetDinner: {
      title: "Jumbo Seafood World-Famous Chilli Crab Dinner",
      location: "Clarke Quay Riverside Promenade",
      cost: 2100,
      coordinates: { lat: 1.289, lng: 103.844 }
    },
    villaBreakfast: {
      title: "Artisan Kaya Toast, Soft-Boiled Eggs & Teh Tarik",
      cost: 450
    },
    midLunch: {
      title: "Michelin Hawker Chan Soy Sauce Chicken & Noodles",
      location: "Chinatown Complex Hawker Centre",
      cost: 750
    },
    midDinner: {
      title: "Spectacular Garden Rhapsody Light Show Dinner",
      location: "SuperTree Grove Dining Pavilion",
      cost: 1800
    },
    farewellLunch: {
      title: "Artisan Peranakan Laksa & Satay Skewers Lunch",
      location: "Old Airport Road Food Centre",
      cost: 800
    },
    tripIdPrefix: "TS-SIN",
    dayTitles: [
      { title: "Changi Jewel Arrival & Marina Bay Twilight", theme: "Arrival" },
      { title: "Gardens by the Bay & Cloud Forest Wonders", theme: "Nature" },
      { title: "Sentosa Island Sky Cable Car & Beach Club", theme: "Adventure" },
      { title: "Chinatown, Little India & Hawker Food Trail", theme: "Culture" },
      { title: "Orchard Road Souvenirs & Changi Departure", theme: "Departure" }
    ]
  }
}

/**
 * Resolves destination profile from any destination string or object
 */
export function getDestinationProfile(query = "Goa") {
  const q = String(query || "").toLowerCase()
  if (q.includes("jaipur") || q.includes("rajasthan")) return destinationProfiles.jaipur
  if (q.includes("kerala") || q.includes("munnar") || q.includes("alleppey") || q.includes("cochin")) return destinationProfiles.kerala
  if (q.includes("dubai") || q.includes("uae") || q.includes("emirates")) return destinationProfiles.dubai
  if (q.includes("singapore")) return destinationProfiles.singapore
  if (q.includes("goa")) return destinationProfiles.goa

  // Dynamic fallback for any custom destination
  const cleanCity = (query ? String(query).split(',')[0].trim() : "Destination") || "Destination"
  return {
    city: cleanCity,
    airportCode: cleanCity.slice(0, 3).toUpperCase(),
    airportLocation: `${cleanCity} International Airport`,
    airportCoord: { lat: 15.38, lng: 73.83 },
    flightInbound: `Inbound Flight: Hub → ${cleanCity}`,
    flightOutbound: `Outbound Flight: ${cleanCity} → Hub`,
    flightDuration: 120,
    flightCost: 4500,
    hotel: {
      name: `${cleanCity} Boutique Heritage Villa`,
      location: `Central ${cleanCity}`,
      coordinates: { lat: 15.501, lng: 73.815 }
    },
    welcomeLunch: {
      title: `Welcome Local ${cleanCity} Culinary Lunch`,
      location: `${cleanCity} Heritage Bistro`,
      cost: 700,
      coordinates: { lat: 15.498, lng: 73.827 }
    },
    sunsetDinner: {
      title: `Scenic Sunset Dinner in ${cleanCity}`,
      location: `${cleanCity} Waterfront Bistro`,
      cost: 950,
      coordinates: { lat: 15.498, lng: 73.827 }
    },
    villaBreakfast: {
      title: `Villa Breakfast with Local Specialties`,
      cost: 350
    },
    midLunch: {
      title: `Artisan Regional Lunch`,
      location: `${cleanCity} Old Town Bistro`,
      cost: 650
    },
    midDinner: {
      title: `Chef's Curated Dinner`,
      location: `${cleanCity} Panoramic Terrace`,
      cost: 900
    },
    farewellLunch: {
      title: `Farewell ${cleanCity} Lunch`,
      location: `${cleanCity} Central Dining`,
      cost: 750
    },
    tripIdPrefix: `TS-${cleanCity.slice(0, 3).toUpperCase()}`,
    dayTitles: [
      { title: `${cleanCity} Arrival & Scenic Exploration`, theme: "Arrival" },
      { title: `Iconic Highlights & Adventures`, theme: "Adventure" },
      { title: `Culture & Living Heritage Trail`, theme: "Culture" },
      { title: `Scenic Horizons & Leisure`, theme: "Leisure" },
      { title: `Souvenirs & Departure`, theme: "Departure" }
    ]
  }
}

/**
 * Calculates geographic distance (in kilometers) between two coordinates
 */
export function calculateDistanceKm(coord1, coord2) {
  if (!coord1?.lat || !coord1?.lng || !coord2?.lat || !coord2?.lng) return 12.0
  const R = 6371 // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180)
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

/**
 * Estimates transfer duration (minutes) and private transit cost
 */
export function estimateTransfer(fromCoord, toCoord, fromName, toName) {
  const distKm = calculateDistanceKm(fromCoord, toCoord)
  // Average city/coastal speed ~30 km/h + 10 min buffer
  const durationMinutes = Math.max(20, Math.round((distKm / 30) * 60 + 10))
  // Approx ₹30/km base cab fare with min ₹400
  const cost = Math.max(450, Math.round(distKm * 28 + 250))

  return {
    distKm,
    durationMinutes,
    cost,
    title: `Transfer: ${fromName || 'Origin'} → ${toName || 'Destination'}`,
    description: `Private AC sedan transfer via local highway (${distKm} km • ~${durationMinutes} min)`
  }
}

/**
 * Generates a normalized day-by-day connected itinerary graph from preferences & staged experiences
 */
export function generateItinerary(tripPreferences, selectedExperiences = []) {
  const daysCount = tripPreferences?.duration?.days || 4
  const adultCount = Math.max(1, tripPreferences?.travelers?.adults || 2)
  const baseBudget = tripPreferences?.budget?.total || 35000
  const rawDest = tripPreferences?.destination?.city || tripPreferences?.destination?.name || "Goa"
  const profile = getDestinationProfile(rawDest)
  const destExperiences = getExperiencesByDestination(profile.city)

  // Resolve experience objects from destination catalogue
  const stagedExperiences = selectedExperiences.map(sel => {
    const found = destExperiences.find(e => e.id === sel.experienceId || e.id === sel.id) ||
                  allExperiences.find(e => e.id === sel.experienceId || e.id === sel.id)
    return found
  }).filter(Boolean)

  // Fallback pool if traveler selected few items
  const fallbackPool = destExperiences.filter(exp => 
    !stagedExperiences.some(s => s.id === exp.id)
  )

  // Combined pool of experiences to place
  const pool = [...stagedExperiences, ...fallbackPool]
  if (pool.length === 0) {
    pool.push(...destExperiences)
  }

  // Hotel Node from destination profile
  const defaultHotel = {
    name: profile.hotel.name,
    location: profile.hotel.location,
    coordinates: profile.hotel.coordinates,
    costPerNight: Math.round((baseBudget * 0.35) / Math.max(1, daysCount - 1) / 2)
  }

  const airportCoord = profile.airportCoord

  const days = []
  let experiencePointer = 0

  for (let d = 1; d <= daysCount; d++) {
    const isFirstDay = d === 1
    const isLastDay = d === daysCount
    const items = []

    let dayTitle = profile.dayTitles[Math.min(d - 1, profile.dayTitles.length - 1)]?.title || "Discovery & Highlights"
    let dayTheme = profile.dayTitles[Math.min(d - 1, profile.dayTitles.length - 1)]?.theme || "Exploration"

    if (isFirstDay) {
      dayTitle = profile.dayTitles[0]?.title || "Arrival & Sunset Exploration"
      dayTheme = profile.dayTitles[0]?.theme || "Arrival"

      // 1. Flight Node
      const flightId = `item-d${d}-flight`
      const transferArrId = `item-d${d}-arr-transfer`
      const checkinId = `item-d${d}-checkin`
      const lunchId = `item-d${d}-lunch`
      const exp1Id = `item-d${d}-exp-sunset`
      const dinnerId = `item-d${d}-dinner`

      items.push({
        id: flightId,
        type: "flight",
        title: profile.flightInbound,
        startTime: "09:20",
        endTime: "10:35",
        location: profile.airportLocation,
        durationMinutes: profile.flightDuration,
        cost: profile.flightCost * adultCount,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [],
        downstream: [transferArrId, checkinId]
      })

      // 2. Airport Transfer
      const transferEstimate = estimateTransfer(airportCoord, defaultHotel.coordinates, "Airport", defaultHotel.name)
      items.push({
        id: transferArrId,
        type: "transport",
        title: `Airport Transfer to ${defaultHotel.name}`,
        startTime: "11:00",
        endTime: "11:55",
        location: `${profile.airportLocation} → ${defaultHotel.location}`,
        durationMinutes: transferEstimate.durationMinutes,
        cost: transferEstimate.cost,
        status: "confirmed",
        movable: true,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [flightId],
        downstream: [checkinId]
      })

      // 3. Hotel Check-in
      items.push({
        id: checkinId,
        type: "hotel",
        title: `Check-in at ${defaultHotel.name}`,
        startTime: "12:15",
        endTime: "13:00",
        location: defaultHotel.location,
        durationMinutes: 45,
        cost: 0,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [transferArrId],
        downstream: [lunchId, exp1Id]
      })

      // 4. Welcome Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: profile.welcomeLunch.title,
        startTime: "13:15",
        endTime: "14:30",
        location: profile.welcomeLunch.location,
        durationMinutes: 75,
        cost: profile.welcomeLunch.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: profile.welcomeLunch.coordinates || defaultHotel.coordinates,
        dependencies: [checkinId],
        downstream: [exp1Id]
      })

      // 5. Buffer
      items.push({
        id: `item-d${d}-buffer-1`,
        type: "buffer",
        title: "Flexibility & Rest Buffer",
        startTime: "14:30",
        endTime: "15:30",
        location: "Hotel Grounds",
        durationMinutes: 60,
        cost: 0,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "none",
        dependencies: [lunchId],
        downstream: [exp1Id]
      })

      // 6. Day 1 Sunset Experience (Pulls from pool)
      const day1Exp = pool[experiencePointer++] || destExperiences[1] || destExperiences[0]
      items.push({
        id: exp1Id,
        type: "experience",
        title: day1Exp.title,
        startTime: "16:00",
        endTime: "18:45",
        location: day1Exp.location,
        durationMinutes: Math.round(day1Exp.durationHours * 60),
        cost: day1Exp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: day1Exp.intensity || "medium",
        category: day1Exp.category,
        image: day1Exp.image,
        coordinates: day1Exp.coordinates,
        dependencies: [checkinId],
        downstream: [dinnerId]
      })

      // 7. Dinner
      items.push({
        id: dinnerId,
        type: "meal",
        title: profile.sunsetDinner.title,
        startTime: "19:45",
        endTime: "21:30",
        location: profile.sunsetDinner.location,
        durationMinutes: 105,
        cost: profile.sunsetDinner.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: profile.sunsetDinner.coordinates || defaultHotel.coordinates,
        dependencies: [exp1Id],
        downstream: []
      })

    } else if (isLastDay) {
      dayTitle = profile.dayTitles[profile.dayTitles.length - 1]?.title || "Souvenirs & Departure"
      dayTheme = "Departure"

      const bfastId = `item-d${d}-bfast`
      const expMorningId = `item-d${d}-exp-morning`
      const checkoutId = `item-d${d}-checkout`
      const lunchId = `item-d${d}-lunch`
      const transferDepId = `item-d${d}-dep-transfer`
      const flightOutId = `item-d${d}-flight-out`

      // 1. Breakfast
      items.push({
        id: bfastId,
        type: "meal",
        title: profile.villaBreakfast.title,
        startTime: "08:30",
        endTime: "09:45",
        location: defaultHotel.name,
        durationMinutes: 75,
        cost: profile.villaBreakfast.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [],
        downstream: [expMorningId]
      })

      // 2. Morning Souvenirs / Light Experience
      const lastDayExp = pool[experiencePointer++] || destExperiences[destExperiences.length - 1] || destExperiences[0]
      items.push({
        id: expMorningId,
        type: "experience",
        title: lastDayExp.title,
        startTime: "10:00",
        endTime: "12:00",
        location: lastDayExp.location,
        durationMinutes: 120,
        cost: lastDayExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        category: lastDayExp.category,
        image: lastDayExp.image,
        coordinates: lastDayExp.coordinates,
        dependencies: [bfastId],
        downstream: [checkoutId]
      })

      // 3. Checkout
      items.push({
        id: checkoutId,
        type: "hotel",
        title: `Check-out from ${defaultHotel.name}`,
        startTime: "12:15",
        endTime: "12:45",
        location: defaultHotel.location,
        durationMinutes: 30,
        cost: 0,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [expMorningId],
        downstream: [lunchId, transferDepId]
      })

      // 4. Farewell Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: profile.farewellLunch.title,
        startTime: "13:00",
        endTime: "14:15",
        location: profile.farewellLunch.location,
        durationMinutes: 75,
        cost: profile.farewellLunch.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [checkoutId],
        downstream: [transferDepId]
      })

      // 5. Transfer to Airport
      const transferOutEstimate = estimateTransfer(defaultHotel.coordinates, airportCoord, defaultHotel.name, profile.airportLocation)
      items.push({
        id: transferDepId,
        type: "transport",
        title: `Airport Drop Transfer to ${profile.airportLocation}`,
        startTime: "14:45",
        endTime: "15:40",
        location: `${defaultHotel.location} → ${profile.airportLocation}`,
        durationMinutes: transferOutEstimate.durationMinutes,
        cost: transferOutEstimate.cost,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [checkoutId, lunchId],
        downstream: [flightOutId]
      })

      // 6. Outbound Flight
      items.push({
        id: flightOutId,
        type: "flight",
        title: profile.flightOutbound,
        startTime: "17:15",
        endTime: "18:30",
        location: profile.airportLocation,
        durationMinutes: profile.flightDuration,
        cost: profile.flightCost * adultCount,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [transferDepId],
        downstream: []
      })

    } else {
      // Mid-trip Days (Adventure / Culture / Experiences)
      const themeIdx = (d - 1) % profile.dayTitles.length
      dayTitle = profile.dayTitles[themeIdx]?.title || (d === 2 ? "Highland & Coastal Adventures" : "Culture, Crafts & Heritage Trail")
      dayTheme = profile.dayTitles[themeIdx]?.theme || (d === 2 ? "Adventure" : "Culture")

      const bfastId = `item-d${d}-bfast`
      const expMorningId = `item-d${d}-exp-morning`
      const lunchId = `item-d${d}-lunch`
      const bufferMidId = `item-d${d}-buffer-mid`
      const expEveningId = `item-d${d}-exp-evening`
      const dinnerId = `item-d${d}-dinner`

      // 1. Breakfast
      items.push({
        id: bfastId,
        type: "meal",
        title: profile.villaBreakfast.title,
        startTime: "08:00",
        endTime: "09:00",
        location: defaultHotel.name,
        durationMinutes: 60,
        cost: profile.villaBreakfast.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [],
        downstream: [expMorningId]
      })

      // 2. Morning Experience
      const morningExp = pool[experiencePointer++] || destExperiences[(d - 1) % destExperiences.length] || destExperiences[0]
      items.push({
        id: expMorningId,
        type: "experience",
        title: morningExp.title,
        startTime: "09:30",
        endTime: "13:00",
        location: morningExp.location,
        durationMinutes: Math.min(210, Math.round(morningExp.durationHours * 60)),
        cost: morningExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: morningExp.intensity || "high",
        category: morningExp.category,
        image: morningExp.image,
        coordinates: morningExp.coordinates,
        dependencies: [bfastId],
        downstream: [lunchId]
      })

      // 3. Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: profile.midLunch.title,
        startTime: "13:15",
        endTime: "14:30",
        location: profile.midLunch.location,
        durationMinutes: 75,
        cost: profile.midLunch.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: morningExp.coordinates || defaultHotel.coordinates,
        dependencies: [expMorningId],
        downstream: [bufferMidId]
      })

      // 4. Free time / Buffer (30 - 60 min)
      items.push({
        id: bufferMidId,
        type: "buffer",
        title: "Downtime & Route Flexibility Buffer",
        startTime: "14:30",
        endTime: "15:45",
        location: "Relaxation Zone / Hotel Poolside",
        durationMinutes: 75,
        cost: 0,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "none",
        dependencies: [lunchId],
        downstream: [expEveningId]
      })

      // 5. Afternoon / Sunset Experience
      const eveningExp = pool[experiencePointer++] || destExperiences[d % destExperiences.length] || destExperiences[1]
      items.push({
        id: expEveningId,
        type: "experience",
        title: eveningExp.title,
        startTime: "16:15",
        endTime: "18:45",
        location: eveningExp.location,
        durationMinutes: Math.min(150, Math.round(eveningExp.durationHours * 60)),
        cost: eveningExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: eveningExp.intensity || "low",
        category: eveningExp.category,
        image: eveningExp.image,
        coordinates: eveningExp.coordinates,
        dependencies: [bufferMidId],
        downstream: [dinnerId]
      })

      // 6. Dinner
      items.push({
        id: dinnerId,
        type: "meal",
        title: profile.midDinner.title,
        startTime: "19:45",
        endTime: "21:45",
        location: profile.midDinner.location,
        durationMinutes: 120,
        cost: profile.midDinner.cost * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: eveningExp.coordinates || defaultHotel.coordinates,
        dependencies: [expEveningId],
        downstream: []
      })
    }

    days.push({
      day: d,
      date: calculateDayDate(tripPreferences?.startDate || "2026-10-12", d - 1),
      title: dayTitle,
      theme: dayTheme,
      status: "Optimized",
      items
    })
  }

  const summary = calculateItinerarySummary(days, baseBudget)
  const flexibility = calculateFlexibilityScore(days)

  return {
    tripId: `${profile.tripIdPrefix}-108`,
    destination: profile.city,
    daysCount,
    days,
    summary,
    flexibility
  }
}

/**
 * Computes calendar date for a given day offset
 */
function calculateDayDate(startStr, offsetDays) {
  try {
    const d = new Date(startStr)
    d.setDate(d.getDate() + offsetDays)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return d.toLocaleDateString('en-GB', options)
  } catch (e) {
    return `Day ${offsetDays + 1}`
  }
}

/**
 * Calculates budget summaries across all days and nodes
 */
export function calculateItinerarySummary(days = [], totalBudget = 35000) {
  let activityCost = 0
  let transportCost = 0
  let flightCost = 0
  let mealCost = 0
  let experienceCount = 0
  let transferCount = 0

  days.forEach(day => {
    day.items?.forEach(item => {
      const c = Number(item.cost) || 0
      if (item.type === "experience") {
        activityCost += c
        experienceCount++
      } else if (item.type === "transport") {
        transportCost += c
        transferCount++
      } else if (item.type === "flight") {
        flightCost += c
      } else if (item.type === "meal") {
        mealCost += c
      }
    })
  })

  // Estimated boutique accommodation for (days - 1) nights
  const nights = Math.max(1, days.length - 1)
  const accommodationCost = Math.round(totalBudget * 0.35)

  const totalCost = activityCost + transportCost + flightCost + mealCost + accommodationCost
  const remainingBudget = Math.max(0, totalBudget - totalCost)
  const isOverBudget = totalCost > totalBudget
  const budgetDelta = Math.abs(totalCost - totalBudget)

  return {
    totalCost,
    totalBudget,
    remainingBudget,
    isOverBudget,
    budgetDelta,
    breakdown: {
      activities: activityCost,
      accommodation: accommodationCost,
      transport: transportCost + flightCost,
      flights: flightCost,
      meals: mealCost,
      estimatedBuffer: remainingBudget
    },
    metrics: {
      experienceCount,
      transferCount,
      totalDays: days.length
    }
  }
}

/**
 * Calculates Journey Flexibility Score based on buffers and movable items
 */
export function calculateFlexibilityScore(days = []) {
  let totalItems = 0
  let movableItems = 0
  let bufferMinutes = 0

  days.forEach(day => {
    day.items?.forEach(item => {
      totalItems++
      if (item.movable) movableItems++
      if (item.type === "buffer") bufferMinutes += (item.durationMinutes || 0)
    })
  })

  const movableRatio = totalItems > 0 ? (movableItems / totalItems) : 0.7
  const bufferScore = Math.min(30, Math.round((bufferMinutes / 180) * 30))
  const flexibilityPercentage = Math.min(94, Math.max(55, Math.round(movableRatio * 65 + bufferScore)))

  const hours = Math.floor(bufferMinutes / 60)
  const mins = bufferMinutes % 60
  const bufferFormatted = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`

  return {
    percentage: flexibilityPercentage,
    rating: flexibilityPercentage >= 75 ? "High Flexibility" : "Moderate Flexibility",
    totalBufferMinutes: bufferMinutes,
    bufferFormatted,
    movableCount: movableItems,
    fixedCount: totalItems - movableItems
  }
}

/**
 * Builds the Itinerary Directed Dependency Graph for anomaly propagation
 */
export function buildItineraryGraph(itinerary) {
  const nodes = []
  const edges = []

  itinerary?.days?.forEach(day => {
    day.items?.forEach(item => {
      nodes.push({
        id: item.id,
        day: day.day,
        type: item.type,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
        critical: item.critical,
        movable: item.movable
      })

      // Construct directional edges from dependencies
      if (item.dependencies && item.dependencies.length > 0) {
        item.dependencies.forEach(depId => {
          edges.push({
            from: depId,
            to: item.id,
            dependencyType: item.type === "transport" ? "arrival_trigger" : "schedule_sequence"
          })
        })
      }
    })
  })

  return {
    nodes,
    edges,
    totalNodes: nodes.length,
    totalEdges: edges.length
  }
}

/**
 * Regenerates a single day with reshuffled/rebalanced experience candidates
 */
export function regenerateDay(currentItinerary, dayNumber, tripPreferences, selectedExperiences = []) {
  const freshItinerary = generateItinerary(tripPreferences, selectedExperiences)
  const targetFreshDay = freshItinerary.days.find(d => d.day === dayNumber) || freshItinerary.days[0]

  const updatedDays = currentItinerary.days.map(d => {
    if (d.day === dayNumber) {
      return {
        ...targetFreshDay,
        status: "Rebalanced"
      }
    }
    return d
  })

  const summary = calculateItinerarySummary(updatedDays, tripPreferences?.budget?.total || 35000)
  const flexibility = calculateFlexibilityScore(updatedDays)

  return {
    ...currentItinerary,
    days: updatedDays,
    summary,
    flexibility
  }
}
