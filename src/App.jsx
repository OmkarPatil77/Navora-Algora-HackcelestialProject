import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OperatorLayout } from '@/components/layout/OperatorLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import { TripPlanningProvider } from '@/context/TripPlanningContext'

// Traveler & Public Pages
import { Landing } from '@/pages/Landing'
import { PlanTrip } from '@/pages/PlanTrip'
import { Recommendations } from '@/pages/Recommendations'
import { Itinerary } from '@/pages/Itinerary'
import { Checkout } from '@/pages/Checkout'
import { Trip } from '@/pages/Trip'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'

// Operator Pages
import { Operator } from '@/pages/Operator'
import { OperatorTours } from '@/pages/OperatorTours'
import { OperatorTourDetail } from '@/pages/OperatorTourDetail'
import { OperatorBookings } from '@/pages/OperatorBookings'
import { OperatorVendors } from '@/pages/OperatorVendors'
import { OperatorDisruptions } from '@/pages/OperatorDisruptions'
import { OperatorPayments } from '@/pages/OperatorPayments'
import { OperatorReports } from '@/pages/OperatorReports'

function App() {
  return (
    <AuthProvider>
      <TripPlanningProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Public Landing & Traveler Experience */}
            <Route element={<AppLayout />}>
              {/* Public Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* Protected Traveler-Only Routes */}
              <Route
                path="/plan"
                element={
                  <ProtectedRoute allowedRoles={['TRAVELER']}>
                    <PlanTrip />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute allowedRoles={['TRAVELER']}>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/itinerary"
                element={
                  <ProtectedRoute allowedRoles={['TRAVELER']}>
                    <Itinerary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['TRAVELER']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trip"
                element={
                  <ProtectedRoute allowedRoles={['TRAVELER']}>
                    <Trip />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Operator Command Center Portal */}
            <Route
              path="/operator"
              element={
                <ProtectedRoute allowedRoles={['OPERATOR']}>
                  <OperatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Operator />} />
              <Route path="tours" element={<OperatorTours />} />
              <Route path="tours/:id" element={<OperatorTourDetail />} />
              <Route path="bookings" element={<OperatorBookings />} />
              <Route path="vendors" element={<OperatorVendors />} />
              <Route path="disruptions" element={<OperatorDisruptions />} />
              <Route path="payments" element={<OperatorPayments />} />
              <Route path="reports" element={<OperatorReports />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TripPlanningProvider>
    </AuthProvider>
  )
}

export default App
