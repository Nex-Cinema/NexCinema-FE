import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../../api/movieApi';
import MovieCard from '../../components/Client/MovieCard';

const genres = ['', 'Hành động', 'Phiêu lưu', 'Kinh dị', 'Bí ẩn', 'Gia đình', 'Hài', 'Viễn tưởng', 'Hoạt hình'];

const MoviesPage = ({ initialType }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const now = new Date().toISOString();
        const response = await getMovies({
          keyword: keyword || undefined,
          theLoai: genre || undefined,
          page: String(currentPage),
          limit: '8',
          ...(initialType === 'now' ? { denNgayKhoiChieu: now } : { tuNgayKhoiChieu: now }),
        });
        if (!active) return;
        setMovies(response?.data || []);
        setTotalPages(response?.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Lỗi khi tải danh sách phim:', error);
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [initialType, keyword, genre, currentPage]);

  const switchType = (type) => navigate(type === 'now' ? '/movies/now-showing' : '/movies/coming-soon');
  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8 flex items-center gap-6 border-b border-neutral-200">
        {[['now', 'Phim đang chiếu'], ['soon', 'Phim sắp chiếu']].map(([type, label]) => (
          <button key={type} type="button" onClick={() => switchType(type)} className={`relative pb-3 text-lg transition-colors ${initialType === type ? 'font-bold text-neutral-950' : 'font-medium text-neutral-500 hover:text-neutral-900'}`}>
            {label}
            {initialType === type && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-(--client-primary)" />}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_240px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
          <input value={keyword} onChange={(event) => { setKeyword(event.target.value); setCurrentPage(1); }} placeholder="Tìm theo tên phim, đạo diễn, diễn viên..." className="h-11 w-full rounded-lg bg-[#f5f3f3] pl-10 pr-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-(--client-primary)" />
        </label>
        <select value={genre} onChange={(event) => { setGenre(event.target.value); setCurrentPage(1); }} className="h-11 w-full cursor-pointer rounded-lg bg-[#f5f3f3] px-3 text-sm text-neutral-800 outline-none ring-1 ring-transparent focus:bg-white focus:ring-(--client-primary)">
          {genres.map((item) => <option key={item || 'all'} value={item}>{item || 'Tất cả thể loại'}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="client-page-state min-h-80"><span className="client-loader" /><p>Đang tải phim...</p></div>
      ) : movies.length === 0 ? (
        <div className="client-empty-state min-h-64">Không tìm thấy phim phù hợp với bộ lọc.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {movies.map((movie) => <MovieCard key={movie.MaPhim} movie={movie} actionLabel={initialType === 'now' ? 'Đặt vé' : 'Chi tiết'} />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2 border-t border-neutral-200 pt-8" aria-label="Phân trang">
          <button type="button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="client-icon-button disabled:opacity-30"><ChevronLeft size={18} /></button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} type="button" onClick={() => paginate(page)} className={`grid size-10 place-items-center rounded-lg text-sm font-bold ${page === currentPage ? 'bg-(--client-primary) text-white' : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50'}`}>{page}</button>
          ))}
          <button type="button" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="client-icon-button disabled:opacity-30"><ChevronRight size={18} /></button>
        </nav>
      )}
    </div>
  );
};

export default MoviesPage;
