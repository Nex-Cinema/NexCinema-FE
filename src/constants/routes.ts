export const ROUTES = {
  HOME: '/',
  MOVIES: {
    DETAIL: (id: string = ':id') => `/movie/${id}`,
    NOW_SHOWING: '/movies/now-showing',
    COMING_SOON: '/movies/coming-soon',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  CUSTOMER: {
    PROFILE: '/profile',
  },
  BOOKING: {
    CHECKOUT: '/checkout',
    PAYMENT: '/checkout/payment',
    SEAT_SELECTION: (showtimeId: string = ':showtimeId') => `/booking/${showtimeId}`,
    CONFIRMATION: '/booking/confirmation',
  },
  NOT_FOUND: '*',
} as const;

export default ROUTES;
