import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import MovieDetails from '@/pages/Movies/MovieDetails';
import Checkout from '@/pages/Booking/Checkout';
import SeatSelection from '@/pages/Booking/SeatSelection';
import BookingConfirmation from '@/pages/Booking/BookingConfirmation';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import ProtectedRoute from '@/components/common/ProtectedRoute';

import ClientProfile from '@/pages/Customer/ClientProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <MainLayout>
            <MovieDetails />
          </MainLayout>
        }
      />
      <Route
        path="/movies/now-showing"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/movies/coming-soon"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      {/* ── CUSTOMER PROFILE ROUTE (PROTECTED) ─────────────────────── */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ClientProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ── AUTHENTICATION ROUTES ──────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ── BOOKING CHECKOUT FLOW ROUTES (PROTECTED) ──────────────── */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/payment"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:showtimeId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SeatSelection />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/confirmation"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingConfirmation />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
