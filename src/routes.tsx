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
import { ROUTES } from '@/constants/routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path={ROUTES.MOVIES.DETAIL()}
        element={
          <MainLayout>
            <MovieDetails />
          </MainLayout>
        }
      />
      <Route
        path={ROUTES.MOVIES.NOW_SHOWING}
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path={ROUTES.MOVIES.COMING_SOON}
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      {/* ── CUSTOMER PROFILE ROUTE (PROTECTED) ─────────────────────── */}
      <Route
        path={ROUTES.CUSTOMER.PROFILE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ClientProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ── AUTHENTICATION ROUTES ──────────────────────────────────── */}
      <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
      <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />

      {/* ── BOOKING CHECKOUT FLOW ROUTES (PROTECTED) ──────────────── */}
      <Route
        path={ROUTES.BOOKING.CHECKOUT}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.BOOKING.PAYMENT}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.BOOKING.SEAT_SELECTION()}
        element={
          <ProtectedRoute>
            <MainLayout>
              <SeatSelection />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.BOOKING.CONFIRMATION}
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingConfirmation />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
