import { Star, X } from 'lucide-react';

/**
 * ReviewModal — overlay form for submitting a movie review.
 * All state and submit logic live in the MovieDetails container.
 *
 * Props:
 *  isOpen           – boolean
 *  movieTitle       – string
 *  rating           – number 1-5
 *  hoverRating      – number 0-5
 *  comment          – string
 *  isSubmitting     – boolean
 *  onClose          – () => void
 *  onSetRating      – (n) => void
 *  onHoverRating    – (n) => void
 *  onSetComment     – (str) => void
 *  onSubmit         – (e) => void
 */
const ReviewModal = ({
  isOpen,
  movieTitle,
  rating,
  hoverRating,
  comment,
  isSubmitting,
  onClose,
  onSetRating,
  onHoverRating,
  onSetComment,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const ratingLabels = {
    1: 'Rất tệ 😡',
    2: 'Tệ 😞',
    3: 'Bình thường 😐',
    4: 'Hay 🙂',
    5: 'Tuyệt vời! 😍',
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col gap-6 overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white p-6 text-left text-neutral-950 shadow-2xl animate-in zoom-in-95 duration-200 md:p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-neutral-100 p-2 text-neutral-500 transition-colors hover:bg-red-600 hover:text-white cursor-pointer group"
        >
          <X size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Title */}
        <div>
          <span className="text-(--client-primary) font-bold text-xs uppercase tracking-wider">Viết đánh giá phim</span>
          <h3 className="mt-1 line-clamp-1 text-xl font-black tracking-tight text-neutral-950 md:text-2xl">
            {movieTitle}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Star rating */}
          <div className="flex flex-col gap-2 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 py-4">
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Chọn số sao đánh giá</p>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isHighlighted = hoverRating >= starNum || (!hoverRating && rating >= starNum);
                return (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => onSetRating(starNum)}
                    onMouseEnter={() => onHoverRating(starNum)}
                    onMouseLeave={() => onHoverRating(0)}
                    className="text-yellow-400 hover:scale-115 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      size={36}
                      fill={isHighlighted ? '#facc15' : 'none'}
                      className={isHighlighted ? 'text-yellow-400' : 'text-gray-600 transition-colors duration-250'}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-yellow-400 text-sm font-bold mt-2 tracking-wide uppercase">
              {ratingLabels[rating] || ''}
            </span>
          </div>

          {/* Comment textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bình luận phim</label>
            <textarea
              value={comment}
              onChange={(e) => onSetComment(e.target.value)}
              maxLength={255}
              placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim này... (Không bắt buộc, tối đa 255 ký tự)"
              className="min-h-[120px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-950 transition-all placeholder:text-neutral-400 focus:border-(--client-primary) focus:outline-hidden focus:ring-1 focus:ring-(--client-primary)"
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Tránh nội dung Spoil hoặc vi phạm tiêu chuẩn cộng đồng.</span>
              <span className={comment.length >= 240 ? 'text-[#ff436e] font-bold' : ''}>
                {comment.length}/255
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-neutral-600 transition-all hover:bg-neutral-100 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="client-primary-button px-8 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
