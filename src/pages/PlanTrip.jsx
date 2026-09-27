import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, Check, AlertCircle 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { PlanningProgressBar } from '@/components/traveler/PlanningProgressBar'
import { StepDestination } from '@/components/traveler/steps/StepDestination'
import { StepDates } from '@/components/traveler/steps/StepDates'
import { StepTravelers } from '@/components/traveler/steps/StepTravelers'
import { StepInterests } from '@/components/traveler/steps/StepInterests'
import { StepTravelStyle } from '@/components/traveler/steps/StepTravelStyle'
import { StepBudget } from '@/components/traveler/steps/StepBudget'
import { StepReview } from '@/components/traveler/steps/StepReview'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import PageTransition from '@/components/motion/PageTransition'

export const PlanTrip = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    setDestination,
    setDates,
    setTravelers,
    setInterests,
    setTravelStyle,
    setBudget,
    resetPreferences,
    bookTrip
  } = useTripPlan()

  const [currentStep, setCurrentStep] = useState(1)
  const [maxVisitedStep, setMaxVisitedStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Validation logic per step
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(tripPreferences.destination?.name)
      case 2:
        return Boolean(tripPreferences.startDate && tripPreferences.endDate)
      case 3:
        return (tripPreferences.travelers?.adults || 0) >= 1
      case 4:
        return (tripPreferences.interests?.length || 0) >= 2 && (tripPreferences.interests?.length || 0) <= 6
      case 5:
        return (
          Boolean(tripPreferences.travelStyle?.pace) &&
          Boolean(tripPreferences.travelStyle?.accommodation) &&
          (tripPreferences.travelStyle?.transportation?.length || 0) >= 1
        )
      case 6:
        return (tripPreferences.budget?.total || 0) >= 10000
      case 7:
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!isStepValid()) return
    const next = currentStep + 1
    setCurrentStep(next)
    setMaxVisitedStep(prev => Math.max(prev, next))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleJumpToStep = (stepNumber) => {
    setCurrentStep(stepNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    resetPreferences()
    setCurrentStep(1)
    setMaxVisitedStep(1)
    setShowResetConfirm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerateJourney = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      if (tripPreferences?.destination) {
        setDestination(tripPreferences.destination)
      }
      navigate('/recommendations')
    }, 800)
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Row with Reset Action */}
        <div className="flex items-center justify-between">
          <PlanningProgressBar
            currentStep={currentStep}
            maxVisitedStep={maxVisitedStep}
            onStepClick={handleJumpToStep}
          />
        </div>

        {/* Step Canvas with Smooth Animation */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              {currentStep === 1 && (
                <StepDestination
                  destination={tripPreferences.destination}
                  onSelectDestination={setDestination}
                />
              )}

              {currentStep === 2 && (
                <StepDates
                  startDate={tripPreferences.startDate}
                  endDate={tripPreferences.endDate}
                  duration={tripPreferences.duration}
                  onDatesChange={setDates}
                />
              )}

              {currentStep === 3 && (
                <StepTravelers
                  travelers={tripPreferences.travelers}
                  onTravelersChange={setTravelers}
                />
              )}

              {currentStep === 4 && (
                <StepInterests
                  selectedInterests={tripPreferences.interests}
                  onInterestsChange={setInterests}
                />
              )}

              {currentStep === 5 && (
                <StepTravelStyle
                  travelStyle={tripPreferences.travelStyle}
                  onTravelStyleChange={setTravelStyle}
                />
              )}

              {currentStep === 6 && (
                <StepBudget
                  budget={tripPreferences.budget}
                  onBudgetChange={setBudget}
                />
              )}

              {currentStep === 7 && (
                <StepReview
                  preferences={tripPreferences}
                  onEditStep={handleJumpToStep}
                  onGenerateJourney={handleGenerateJourney}
                  isGenerating={isGenerating}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Persistent Navigation Controls (Steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="pt-6 border-t border-sand-200/90 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              )}

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 rounded-lg hover:bg-sand-100 transition-colors"
                title="Reset to default Goa demo blueprint"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs px-6"
              >
                {currentStep === 6 ? "Review Journey Blueprint" : "Continue"}
              </Button>
            </div>

          </div>
        )}

      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent onClose={() => setShowResetConfirm(false)}>
          <DialogHeader>
            <DialogTitle>Reset Trip Preferences?</DialogTitle>
            <DialogDescription>
              This will restore the default Goa (4 Days / 3 Nights, 2 Travelers, ₹35,000 budget) demo blueprint.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleReset} className="bg-terracotta-600 text-white">
              Reset to Defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PageTransition>
  )
}

export default PlanTrip
