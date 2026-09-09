import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface BookingProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export const BookingProgressBar: React.FC<BookingProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-[#e4e2e2] px-6 py-4 mb-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {/* STEP 1: CHỌN SUẤT */}
        {currentStep > 1 ? (
          <Link
            to="/checkout"
            className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#d71920] transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#efeded] flex items-center justify-center text-[#5d3f3c] font-bold text-xs group-hover:bg-[#e4e2e2]">
              <Check className="w-4 h-4 text-[#5d3f3c]" />
            </div>
            <span className="text-xs font-semibold text-[#5f5e5e] group-hover:text-[#d71920]">
              1. Chọn suất
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              1
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#d71920]">1. Chọn suất</span>
          </div>
        )}

        {/* CONNECTING LINE 1-2 */}
        <div
          className={`h-[1px] flex-1 mx-3 sm:mx-6 transition-colors ${
            currentStep >= 2 ? 'bg-[#e4e2e2]' : 'bg-[#e4e2e2]'
          }`}
        />

        {/* STEP 2: CHỌN GHẾ */}
        {currentStep === 2 ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              2
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#d71920]">2. Chọn ghế</span>
          </div>
        ) : currentStep > 2 ? (
          <Link
            to="/booking/st-11:30"
            className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#d71920] transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#efeded] flex items-center justify-center text-[#5d3f3c] font-bold text-xs group-hover:bg-[#e4e2e2]">
              <Check className="w-4 h-4 text-[#5d3f3c]" />
            </div>
            <span className="text-xs font-semibold text-[#5f5e5e] group-hover:text-[#d71920]">
              2. Chọn ghế
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#efeded] text-[#5f5e5e] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#5f5e5e]/80">2. Chọn ghế</span>
          </div>
        )}

        {/* CONNECTING LINE 2-3 */}
        <div
          className={`h-[1px] flex-1 mx-3 sm:mx-6 transition-colors ${
            currentStep === 3 ? 'bg-[#e4e2e2]' : 'bg-[#e4e2e2]'
          }`}
        />

        {/* STEP 3: THANH TOÁN */}
        {currentStep === 3 ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              3
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#d71920]">3. Thanh toán</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#efeded] text-[#5f5e5e] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#5f5e5e]/80">3. Thanh toán</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingProgressBar;
