import { Check } from 'lucide-react';

const steps = ['Chọn suất', 'Chọn ghế', 'Thanh toán'];

const BookingStepper = ({ current = 1, compact = false }) => (
  <div className={`mx-auto flex w-full max-w-3xl items-center ${compact ? 'mb-3' : 'mb-8'}`} aria-label="Tiến trình đặt vé">
    {steps.map((label, index) => {
      const number = index + 1;
      const complete = number < current;
      const active = number === current;
      return (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className={`flex flex-col items-center ${compact ? 'gap-1' : 'gap-2'}`}>
            <span className={`grid place-items-center rounded-full border-2 text-sm font-bold ${compact ? 'size-8' : 'size-9'} ${complete || active ? 'border-(--client-primary) bg-(--client-primary) text-white' : 'border-neutral-300 bg-white text-neutral-400'}`}>
              {complete ? <Check size={16} /> : number}
            </span>
            <span className={`whitespace-nowrap text-xs font-semibold ${active ? 'text-(--client-primary)' : 'text-neutral-500'}`}>{label}</span>
          </div>
          {index < steps.length - 1 && <span className={`mx-3 h-0.5 flex-1 ${compact ? 'mb-4' : 'mb-5'} ${number < current ? 'bg-(--client-primary)' : 'bg-neutral-200'}`} />}
        </div>
      );
    })}
  </div>
);

export default BookingStepper;
