import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Brand = ({ compact = false }) => (
  <Link to="/" className="inline-flex shrink-0 items-center gap-2" aria-label="NexCinema - Trang chủ">
    <span className={`${compact ? 'size-8 rounded-lg' : 'size-10 rounded-xl'} grid place-items-center bg-(--client-primary) text-white`}>
      <Film size={compact ? 17 : 21} strokeWidth={2.2} />
    </span>
    <span className={`${compact ? 'text-lg' : 'text-xl'} font-extrabold tracking-[-0.04em] text-(--client-text)`}>
      NEX<span className="text-(--client-primary)">CINEMA</span>
    </span>
  </Link>
);

export default Brand;
