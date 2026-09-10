import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookingSelectStep from './components/BookingSelectStep';
import PaymentStep from './components/PaymentStep';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const isPaymentStep = location.pathname.includes('/payment');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (isPaymentStep) {
    return <PaymentStep />;
  }

  return <BookingSelectStep />;
};

export default Checkout;
