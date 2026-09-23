import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { ROUTES } from '@/constants';

export interface BookingProgressBarProps {
  currentStep: 1 | 2 | 3 | 4;
}

/**
 * BookingProgressBar — 4-step progress stepper for NexCinema Booking Flow.
 *
 * Step 1: Chọn suất chiếu
 * Step 2: Chọn ghế
 * Step 3: Thanh toán
 * Step 4: Xác nhận
 */
export const BookingProgressBar: React.FC<BookingProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Chọn suất', path: ROUTES.BOOKING.CHECKOUT },
    { num: 2, label: 'Chọn ghế', path: ROUTES.BOOKING.SEAT_SELECTION('st-11:30') },
    { num: 3, label: 'Thanh toán', path: ROUTES.BOOKING.PAYMENT },
    { num: 4, label: 'Xác nhận', path: ROUTES.BOOKING.CONFIRMATION },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-[#e4e2e2] px-6 py-4 mb-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            {/* STEP INDICATOR */}
            {currentStep > step.num ? (
              <Link
                to={step.path}
                className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#d71920] transition-colors group cursor-pointer shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#efeded] flex items-center justify-center text-[#5d3f3c] font-bold text-xs group-hover:bg-[#e4e2e2]">
                  <Check className="w-4 h-4 text-[#5d3f3c]" />
                </div>
                <span className="text-xs font-semibold text-[#5f5e5e] group-hover:text-[#d71920] hidden sm:inline">
                  {step.num}. {step.label}
                </span>
              </Link>
            ) : currentStep === step.num ? (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {step.num}
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#d71920]">
                  {step.num}. {step.label}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#efeded] text-[#5f5e5e] flex items-center justify-center font-bold text-xs">
                  {step.num}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#5f5e5e]/80 hidden sm:inline">
                  {step.num}. {step.label}
                </span>
              </div>
            )}

            {/* CONNECTING LINE */}
            {idx < steps.length - 1 && (
              <div
                className={`h-[1px] flex-1 mx-2 sm:mx-4 transition-colors ${
                  currentStep > step.num ? 'bg-[#d71920]/30' : 'bg-[#e4e2e2]'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressBar;
