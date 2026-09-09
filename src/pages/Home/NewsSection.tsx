import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { NewsArticle } from '@/types/movie.type';

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Cơn sốt Dune 2: Đỉnh cao kỹ thuật quay phim và âm nhạc điện ảnh tương lai',
    excerpt:
      'Denis Villeneuve đã nâng tầm dòng phim khoa học viễn tưởng với những thước phim hoành tráng, hiệu ứng âm thanh sống động đến nghẹt thở...',
    imageUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    date: '26/10/2024',
    readTime: '5 phút đọc',
    category: 'Phân tích phim',
  },
  {
    id: 'news-2',
    title: 'Tổng hợp các suất chiếu đặc biệt có quà tặng hấp dẫn tại NexCinema trong tháng này',
    excerpt:
      'Hàng trăm quà tặng độc quyền như poster tráng kim, IMAX ticket stub, bookmark kim loại dành cho những khách hàng đặt vé xem sớm...',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    date: '24/10/2024',
    readTime: '3 phút đọc',
    category: 'Sự kiện rạp',
  },
  {
    id: 'news-3',
    title: 'Quy định phân loại độ tuổi khán giả khi mua vé xem phim mới nhất',
    excerpt:
      'Cập nhật chi tiết các phân loại nhãn P, K, C13, C16, C18 để khán giả chủ động lựa chọn suất chiếu phù hợp với gia đình và trẻ nhỏ...',
    imageUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    date: '20/10/2024',
    readTime: '4 phút đọc',
    category: 'Quy định rạp',
  },
];

export const NewsSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 pt-12 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#d71920] uppercase tracking-wider">
            Tin tức & Sự kiện
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Góc Điện Ảnh NexCinema
          </h2>
        </div>
        <a
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-[#d71920] hover:text-[#ae0011] transition-colors group"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_NEWS.map((article) => (
          <article
            key={article.id}
            className="group bg-[#ffffff] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#e4e2e2] transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#efeded]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-md bg-[#1b1c1c]/80 backdrop-blur-md text-white font-semibold text-[11px]">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-[#5f5e5e]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5f5e5e]" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5f5e5e]" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1b1c1c] group-hover:text-[#d71920] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#5f5e5e] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-[#d71920] group-hover:underline">
                Đọc tiếp →
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
