import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LostFoundPage from './pages/LostFoundPage';
import SportsPage from './pages/SportsPage';
import SportsBookingBoardPage from './pages/SportsBookingBoardPage';
import MarketPage from './pages/MarketPage';
import EmergencyPage from './pages/EmergencyPage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Hub Routes (all render AppShell internally) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-found"
            element={
              <ProtectedRoute>
                <LostFoundPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports"
            element={
              <ProtectedRoute>
                <SportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports-bookings"
            element={
              <ProtectedRoute>
                <SportsBookingBoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <MarketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EmergencyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;