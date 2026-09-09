import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Play, Clock, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface FeaturedMovie {
  id: string;
  title: string;
  badges: string[];
  rating: string;
  reviews: string;
  duration: string;
  genre: string;
  releaseDate: string;
  synopsis: string;
  bgUrl: string;
}

const FEATURED_MOVIES: FeaturedMovie[] = [
  {
    id: 'dune2',
    title: 'Dune: Hành Tinh Cát - Phần 2',
    badges: ['IMAX Laser • Dolby Atmos', 'C16'],
    rating: '9.4',
    reviews: '1.4k đánh giá',
    duration: '166 phút',
    genre: 'Khoa học viễn tưởng, Phiêu lưu',
    releaseDate: '01/03/2024',
    synopsis: 'Paul Atreides hợp lực cùng Chani và tộc người Fremen khi anh tìm kiếm sự trả thù chống lại những kẻ đã hủy hoại gia đình mình, đồng thời đối mặt với số phận nghiệt ngã của vũ vũ trụ.',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_Q_fVvtjXnMffPose-winhFedj2Thnqbu_3aFRB_52LVqlcRfNsDIiWFNL5U6KsYXiNTwwnMAiRjswSFgsnOJJYJoIFXm7Xf0qPSmfkGRe1ylYjS9Uenmy-KalrrFYSrW6c1i-Av5hRrY6yr798Gil6fdCsAFWyMdx02-VWeK5wEgLw3Dvw8nYeQVtOZchraQUFAbvI0lPzctXaiQrGXA5osmWKyohBhw4_gQKSf-TeYDotIljUh8Q'
  },
  {
    id: 'godzilla',
    title: 'Godzilla x Kong: Đế Chế Mới',
    badges: ['3D Dolby Atmos', 'C13'],
    rating: '8.8',
    reviews: '980 đánh giá',
    duration: '115 phút',
    genre: 'Hành động, Quái vật',
    releaseDate: '29/03/2024',
    synopsis: 'Cuộc chạm trán nảy lửa giữa Godzilla và Kong khi một mối đe dọa khổng lồ mới xuất hiện từ lòng Trái Đất, đe dọa sự tồn vong của loài người.',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJorOGi6KDI5vPAzSKvI2Yg-Akq-cHHn8gJxHIGv-nbfHaGm3LceKdC5MgCwOc3BJ3sCUiG98jVgZo9uykKxsjWVLeSJSXzbmtiySeLfHUznIKaO7SrzMidOX_oH-zslozH__r71_HshWFSbDz4yBmn4TwFTGEOKu7pgmk5t5B0B0i9epnLJOIZLJJkYTSjfDzB_SPBqAWSRZMFyUyS3yfaCprNK6NnNkx0tmNFOBbJy2nUpmmCp3Kpg'
  },
  {
    id: 'latmat7',
    title: 'Lật Mặt 7: Một Điều Ước',
    badges: ['2D Lồng tiếng', 'K'],
    rating: '9.1',
    reviews: '2.1k đánh giá',
    duration: '138 phút',
    genre: 'Gia đình, Tình cảm',
    releaseDate: '26/04/2024',
    synopsis: 'Câu chuyện cảm động về tình mẫu tử của người mẹ già cùng 5 người con đã trưởng thành, mang đến góc nhìn chân thực và sâu sắc về gia đình Việt.',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQApIsluMZkKbasRzODxDYeMICC7Hn32qSpVKicnUVan2QN8PYUi4widx9PygF4tNg5DKjHPabXGQWY8C1RMD02AcJda1m2OkLKHxCILUpwPQhkN6zsQjkZ0BLFKlo_jaSFvxiXouCMS2l1TXQESY0sBsR3DDi2X-vfORjYed0gusqndXQmA3c0y8ARV01bFLdTbYlUrptKsEYRrY7cfd78QFxzysFbVrDHB_Hfunsa-byhGCIu3BTtw'
  },
  {
    id: 'kungfupanda',
    title: 'Kung Fu Panda 4',
    badges: ['2D Lồng tiếng', 'P'],
    rating: '8.5',
    reviews: '750 đánh giá',
    duration: '94 phút',
    genre: 'Hoạt hình, Hài hước',
    releaseDate: '08/03/2024',
    synopsis: 'Thần Long Đại Hiệp Po tái xuất giang hồ, tìm kiếm người nối nghiệp vị trí Thần Long Đại Hiệp mới và đối đầu với mụ Tắc Kè Bông nguy hiểm.',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EOuVahVJi3kOUG70NMtD3MIwfQmtweFx0gsQOvwT0PBBNj9nIVTv4egOfGBVZyQP4FmdudSWXfcP5jgURMrYNAzQmIpP9CZHW3RKHM24IPBfUx738RhY2DOgSkVHLCxmxFMAZ1XHID82l9pXYuFPrQILY38Ysi1b4sUrkUPGGmG5jOTGhey31l1IwOQM5-FIsFY0ZaClKDtrCG7VL93E3se1bY4ym0JSSw4p3DSpwJurP_GG32ORDQ'
  }
];

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const currentMovie = FEATURED_MOVIES[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? FEATURED_MOVIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === FEATURED_MOVIES.length - 1 ? 0 : prev + 1));
  };

  const handleGoToDetails = () => {
    navigate(`/movie/${currentMovie.id}`);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#1b1c1c] text-white text-left">
      <div className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-end">
        {/* HERO BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 hover:scale-105 cursor-pointer"
          style={{ backgroundImage: `url('${currentMovie.bgUrl}')` }}
          onClick={handleGoToDetails}
        />

        {/* GRADIENT SCRIMS */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/70 to-[#1b1c1c]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c1c]/95 via-[#1b1c1c]/60 to-transparent pointer-events-none" />

        {/* CONTENT CONTAINER */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pb-24">
          <div className="max-w-2xl space-y-4">
            
            {/* BADGES STRIP */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d71920] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Đang chiếu rạp
              </span>
              {currentMovie.badges.map((b, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
                  {b}
                </span>
              ))}
            </div>

            {/* MAIN TITLE */}
            <h1 
              onClick={handleGoToDetails}
              className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-md cursor-pointer hover:text-red-400 transition-colors"
            >
              {currentMovie.title}
            </h1>

            {/* META SPECIFICATIONS */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-none" /> ★ {currentMovie.rating}
                <span className="text-xs text-gray-400 font-normal">/10 ({currentMovie.reviews})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {currentMovie.duration}
              </span>
              <span>•</span>
              <span>{currentMovie.genre}</span>
              <span>•</span>
              <span>Khởi chiếu: {currentMovie.releaseDate}</span>
            </div>

            {/* SYNOPSIS */}
            <p className="text-sm sm:text-base text-gray-300/90 line-clamp-2 max-w-xl leading-relaxed">
              {currentMovie.synopsis}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={handleGoToDetails}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#d71920] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Đặt vé ngay</span>
              </button>

              <button 
                type="button"
                onClick={handleGoToDetails}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Chi tiết phim</span>
              </button>
            </div>

          </div>

          {/* SPOTLIGHT MOVIE SWITCHER */}
          <div className="mt-8 pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Phim nổi bật:</span>
              {FEATURED_MOVIES.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeIdx === idx 
                      ? 'bg-white text-gray-900 font-bold shadow-xs' 
                      : 'bg-white/15 hover:bg-white/30 text-white'
                  }`}
                >
                  {idx + 1}. {m.title.split(':')[0]}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={handlePrev}
                aria-label="Phim trước"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNext}
                aria-label="Phim kế tiếp"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
