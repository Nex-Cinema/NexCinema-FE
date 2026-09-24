const seatKinds = {
  standard: { icon: 'text-slate-200', stroke: 'stroke-slate-400', text: 'text-slate-700' },
  vip: { icon: 'text-amber-200', stroke: 'stroke-amber-500', text: 'text-amber-900' },
  couple: { icon: 'text-pink-200', stroke: 'stroke-pink-500', text: 'text-pink-900' },
};

const seatStates = {
  selected: { icon: 'text-[#d71920]', stroke: 'stroke-[#d71920]', text: 'text-white' },
  sold: { icon: 'text-slate-300 opacity-60', stroke: 'stroke-slate-400 opacity-60', text: 'text-slate-500 opacity-60' },
  held: { icon: 'text-orange-200 opacity-70', stroke: 'stroke-orange-400 opacity-70', text: 'text-orange-700 opacity-70' },
  locked: { icon: 'text-slate-200 opacity-60', stroke: 'stroke-slate-400 opacity-60', text: 'text-slate-500 opacity-60' },
};

const getSeatKind = (name = '') => {
  const normalized = name.toUpperCase();
  if (normalized.includes('ĐÔI') || normalized.includes('COUPLE') || normalized.includes('SWEETBOX')) return 'couple';
  if (normalized.includes('VIP')) return 'vip';
  return 'standard';
};

export const SeatIcon = ({ className = '', strokeClassName = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".75" />
    <path d="M5 13c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} />
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".9" />
    <rect x="18.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".9" />
  </svg>
);

export const CoupleSeatIcon = ({ className = '', strokeClassName = '' }) => (
  <svg className={className} viewBox="0 0 48 24" fill="none" aria-hidden="true">
    <path d="M6 4c0-1.1.9-2 2-2h13c1.1 0 2 .9 2 2v9H6V4zm19 0c0-1.1.9-2 2-2h13c1.1 0 2 .9 2 2v9H25V4z" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".75" />
    <path d="M5 13c0-1.1.9-2 2-2h15c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3zm19 0c0-1.1.9-2 2-2h15c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H26c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} />
    <path d="M5 17h38v2H5z" fill="currentColor" className={strokeClassName} />
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".9" />
    <rect x="42.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth=".5" className={strokeClassName} opacity=".9" />
  </svg>
);

export const CinemaSeat = ({ label, typeName, state = 'available', selected = false, onClick, disabled = false, compact = false, className = '', title }) => {
  const kind = getSeatKind(typeName);
  const tone = selected ? seatStates.selected : seatStates[state] || seatKinds[kind];
  const Icon = kind === 'couple' ? CoupleSeatIcon : SeatIcon;
  const dimensions = compact
    ? kind === 'couple' ? 'h-9 w-20' : 'size-9'
    : kind === 'couple' ? 'h-11 w-24' : 'size-11';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Ghế ${label}, ${typeName || 'Thường'}`}
      aria-pressed={selected}
      title={title}
      className={`group relative flex shrink-0 select-none items-center justify-center bg-transparent ${dimensions} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] hover:-translate-y-1'} ${className}`}
    >
      <Icon className={`absolute inset-0 size-full ${tone.icon}`} strokeClassName={tone.stroke} />
      <span className={`relative z-10 font-mono text-[9px] font-black tracking-tighter ${tone.text}`}>{label}</span>
    </button>
  );
};

const legendItems = [
  { label: 'Còn trống', typeName: 'Thường' },
  { label: 'Đang chọn', typeName: 'Thường', selected: true },
  { label: 'Đã đặt', typeName: 'Thường', state: 'sold' },
  { label: 'Đang giữ', typeName: 'Thường', state: 'held' },
  { label: 'Ghế VIP', typeName: 'VIP' },
  { label: 'Ghế đôi', typeName: 'Sweetbox' },
];

export const SeatLegend = ({ items = legendItems, className = '' }) => (
  <div className={`grid w-full grid-cols-3 items-center gap-x-2 gap-y-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-5 ${className}`}>
    {items.map(({ label, ...seatProps }) => (
      <div key={label} className="flex min-w-0 items-center justify-center gap-1.5 sm:justify-start">
        <CinemaSeat label="" {...seatProps} disabled className={`pointer-events-none !h-6 ${getSeatKind(seatProps.typeName) === 'couple' ? '!w-12' : '!w-7'}`} />
        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[.08em] text-slate-500">{label}</span>
      </div>
    ))}
  </div>
);
