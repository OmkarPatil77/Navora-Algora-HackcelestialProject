import React from 'react'
import {
  Mountain,
  Waves,
  UtensilsCrossed,
  Landmark,
  Trees,
  Sparkles,
  HeartHandshake,
  ShoppingBag,
  Hourglass,
  Palette,
  Camera,
  Gem,
  Compass
} from 'lucide-react'

const iconMap = {
  Mountain,
  Waves,
  UtensilsCrossed,
  Landmark,
  Trees,
  Sparkles,
  HeartHandshake,
  ShoppingBag,
  Hourglass,
  Palette,
  Camera,
  Gem
}

export const InterestIcon = ({ name, className = "w-4 h-4" }) => {
  const IconComponent = iconMap[name] || Compass
  return <IconComponent className={className} />
}
