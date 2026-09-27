import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { PlanningSection } from '@/components/landing/PlanningSection'
import { AdaptationFlow } from '@/components/landing/AdaptationFlow'
import { OperatorSplitSection } from '@/components/landing/OperatorSplitSection'
import { FinalCtaSection } from '@/components/landing/FinalCtaSection'
import PageTransition from '@/components/motion/PageTransition'

export const Landing = () => {
  return (
    <PageTransition>
      <div className="space-y-0">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Personalized Planning */}
        <PlanningSection />

        {/* 3. Dynamic Adaptation Flow */}
        <AdaptationFlow />

        {/* 4. Traveler + Operator Experience */}
        <OperatorSplitSection />

        {/* 5. Final CTA */}
        <FinalCtaSection />
      </div>
    </PageTransition>
  )
}

export default Landing
