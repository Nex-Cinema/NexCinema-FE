import React, { useState } from 'react';
import MovieCard from '@/components/common/MovieCard';
import { Movie } from '@/types/movie.type';

const NOW_SHOWING_MOVIES: Movie[] = [
  {
    id: 'dune2',
    title: 'Dune: Hành Tinh Cát 2',
    genre: 'Hành động, Viễn tưởng',
    duration: 166,
    rating: 9.4,
    ageRating: 'C16',
    formats: ['2D', 'IMAX'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw',
    tag: 'HOT'
  },
  {
    id: 'godzilla',
    title: 'Godzilla x Kong: Đế Chế Mới',
    genre: 'Hành động, Quái vật',
    duration: 115,
    rating: 8.8,
    ageRating: 'C13',
    formats: ['2D', '3D'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJorOGi6KDI5vPAzSKvI2Yg-Akq-cHHn8gJxHIGv-nbfHaGm3LceKdC5MgCwOc3BJ3sCUiG98jVgZo9uykKxsjWVLeSJSXzbmtiySeLfHUznIKaO7SrzMidOX_oH-zslozH__r71_HshWFSbDz4yBmn4TwFTGEOKu7pgmk5t5B0B0i9epnLJOIZLJJkYTSjfDzB_SPBqAWSRZMFyUyS3yfaCprNK6NnNkx0tmNFOBbJy2nUpmmCp3Kpg'
  },
  {
    id: 'latmat7',
    title: 'Lật Mặt 7: Một Điều Ước',
    genre: 'Gia đình, Tình cảm',
    duration: 138,
    rating: 9.1,
    ageRating: 'K',
    formats: ['2D Lồng tiếng'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQApIsluMZkKbasRzODxDYeMICC7Hn32qSpVKicnUVan2QN8PYUi4widx9PygF4tNg5DKjHPabXGQWY8C1RMD02AcJda1m2OkLKHxCILUpwPQhkN6zsQjkZ0BLFKlo_jaSFvxiXouCMS2l1TXQESY0sBsR3DDi2X-vfORjYed0gusqndXQmA3c0y8ARV01bFLdTbYlUrptKsEYRrY7cfd78QFxzysFbVrDHB_Hfunsa-byhGCIu3BTtw',
    tag: 'BÁN CHẠY'
  },
  {
    id: 'kungfupanda',
    title: 'Kung Fu Panda 4',
    genre: 'Hoạt hình, Hài hước',
    duration: 94,
    rating: 8.5,
    ageRating: 'P',
    formats: ['2D Lồng tiếng'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EOuVahVJi3kOUG70NMtD3MIwfQmtweFx0gsQOvwT0PBBNj9nIVTv4egOfGBVZyQP4FmdudSWXfcP5jgURMrYNAzQmIpP9CZHW3RKHM24IPBfUx738RhY2DOgSkVHLCxmxFMAZ1XHID82l9pXYuFPrQILY38Ysi1b4sUrkUPGGmG5jOTGhey31l1IwOQM5-FIsFY0ZaClKDtrCG7VL93E3se1bY4ym0JSSw4p3DSpwJurP_GG32ORDQ'
  },
  {
    id: 'planetapes',
    title: 'Hành Tinh Khỉ: Vương Quốc Mới',
    genre: 'Hành động, Viễn tưởng',
    duration: 145,
    rating: 8.7,
    ageRating: 'C13',
    formats: ['2D', 'IMAX'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgnuia3CgJnthhAKt5aV1vdXa9zCM8VZfXBwVPS0SxuWIXoF7J-5Cg3thF9U1Oq0gy0gbxNH68UHJB5SI_-HJ6ED9NwO2ogluTGgYcPYxqf_cgf4hdWWFMoCRnbXYGKBajqXipNWb_wj6KfX4RqhJ1t5LUHcOvnWi4SXkwKXeSeUnHy99ms5eMuzTpQS3pmb7Ckioi-K8uRRJBMGyDU1SaWTwm-Mw__AXTbuwJaJkcUEalzMPXf7YgGw'
  },
  {
    id: 'exhuma',
    title: 'Exhuma: Quật Mộ Trùng Ma',
    genre: 'Kinh dị, Bí ẩn',
    duration: 134,
    rating: 9.0,
    ageRating: 'C18',
    formats: ['2D Phụ đề'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLB2f466XptyubK7cmvac8rjUBGqhcOmdGU3fTN9gpZr2y5vXPtyD84dSH_eNpHzJ2akA-EjWXY7Wq3qMkDGksZXZY0RAwrOKmeBlGK5us3FcJvxTW2pnxrsVMpG8IXMEYnsuUfs3LpRlU5uhB4I0oqMz4yq8jU_zwQdqQu55q0yFRDIvZzMfmTdwbMY_9244Yoh8lfxYdOdSrotSeXaAo02WpFC2aBhA_6_LVs8n4uYzMblXD9GYbQ'
  },
  {
    id: 'civilwar',
    title: 'Civil War: Ngày Tàn Đế Quốc',
    genre: 'Hành động, Hồi hộp',
    duration: 109,
    rating: 8.6,
    ageRating: 'C18',
    formats: ['2D Phụ đề'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBALntubxVmzs9Mo9B2a1It6eJe03lpEQC_euzTQ2zLknpNFeieNXGvnj7scPvtoKlrL80Zc_w3khaPGyFGa-fFgN-DybCt4DW4ZzaSALArovGSJMD8jwxvNV2R1uh0R5AzdI-_U9Sfw_9hJzavXyalIImkumhBF3fHQIyHU0z7nfhE3-fMYYV06pPX1kA1CauTg2mmOWcD2SjTK72HFMPDDLFvtFfTI3A8LpvaExdln_lt89ZMqwHVHg'
  },
  {
    id: 'conan',
    title: 'Thám Tử Conan: Ngôi Sao 5 Cánh',
    genre: 'Hoạt hình, Trinh thám',
    duration: 110,
    rating: 8.9,
    ageRating: 'P',
    formats: ['2D Lồng tiếng'],
    poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDplsvsOuLAlp5FdL0wSkEU1GqX2MpRIoi0HlXP-DFuPsRRE5Z_SFCzZBoo14DNU7Y_sLnsClFdPaGuZ0GYRdPhNe8MP5bNVW4dZjazT_PcjU3imZafZAGwXfENQbG_jz-PWDxI3_yO-3SZo1EjAp1_tVX9hqvVxVfeL0PuFK4Z8cEDDtn5Fvo6i1t9tTJA07THM3R9_mswXjRupikK4HrG5Ih1G0B1Uk3v17QgUxov6mTWzzYRQrD7wg'
  }
];

const NowShowingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'now' | 'soon'>('now');

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* TABS HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6 border-b border-gray-200 w-full pb-2">
          <button 
            onClick={() => setActiveTab('now')}
            className={`relative pb-2 text-xl font-bold font-display flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'now' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Phim Đang Chiếu 
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'now' ? 'bg-[#d71920]/10 text-[#d71920]' : 'bg-gray-100 text-gray-500'
            }`}>
              12
            </span>
            {activeTab === 'now' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d71920] rounded-full" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab('soon')}
            className={`relative pb-2 text-xl font-bold font-display flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'soon' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Phim Sắp Chiếu 
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'soon' ? 'bg-[#d71920]/10 text-[#d71920]' : 'bg-gray-100 text-gray-500'
            }`}>
              8
            </span>
            {activeTab === 'soon' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d71920] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 4-COLUMN MOVIE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {NOW_SHOWING_MOVIES.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default NowShowingSection;
