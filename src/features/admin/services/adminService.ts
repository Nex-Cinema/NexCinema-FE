import customerService from './customerService';
import movieService from './movieService';
import personnelService from './personnelService';
import pricingService from './pricingService';
import roomService from './roomService';
import seatService from './seatService';
import shiftService from './shiftService';
import showtimeService from './showtimeService';
import statsService from './statsService';
import transactionService from './transactionService';

const adminService = {
  customer: customerService,
  movie: movieService,
  personnel: personnelService,
  pricing: pricingService,
  room: roomService,
  seat: seatService,
  shift: shiftService,
  showtime: showtimeService,
  stats: statsService,
  transaction: transactionService,
};

export default adminService;
