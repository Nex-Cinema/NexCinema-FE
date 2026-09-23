/**
 * visualHelper.ts
 *
 * Provides fallback posters, backdrops, and trailer URLs for movies
 * when the API backend returns empty image fields.
 */

const FALLBACK_POSTER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw';

const FALLBACK_BACKDROP =
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80';

const FALLBACK_TRAILER = 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1';

export const getMovieVisuals = (movie: any) => {
  if (!movie) {
    return {
      poster: FALLBACK_POSTER,
      backdrop: FALLBACK_BACKDROP,
      trailer: FALLBACK_TRAILER,
    };
  }

  const title = (movie.TenPhim || movie.title || '').toLowerCase();

  if (title.includes('dune')) {
    return {
      poster:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw',
      backdrop:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
      trailer: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
    };
  }

  if (title.includes('godzilla')) {
    return {
      poster:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCJorOGi6KDI5vPAzSKvI2Yg-Akq-cHHn8gJxHIGv-nbfHaGm3LceKdC5MgCwOc3BJ3sCUiG98jVgZo9uykKxsjWVLeSJSXzbmtiySeLfHUznIKaO7SrzMidOX_oH-zslozH__r71_HshWFSbDz4yBmn4TwFTGEOKu7pgmk5t5B0B0i9epnLJOIZLJJkYTSjfDzB_SPBqAWSRZMFyUyS3yfaCprNK6NnNkx0tmNFOBbJy2nUpmmCp3Kpg',
      backdrop:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
      trailer: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
    };
  }

  if (title.includes('lật mặt')) {
    return {
      poster:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQApIsluMZkKbasRzODxDYeMICC7Hn32qSpVKicnUVan2QN8PYUi4widx9PygF4tNg5DKjHPabXGQWY8C1RMD02AcJda1m2OkLKHxCILUpwPQhkN6zsQjkZ0BLFKlo_jaSFvxiXouCMS2l1TXQESY0sBsR3DDi2X-vfORjYed0gusqndXQmA3c0y8ARV01bFLdTbYlUrptKsEYRrY7cfd78QFxzysFbVrDHB_Hfunsa-byhGCIu3BTtw',
      backdrop:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
      trailer: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
    };
  }

  return {
    poster: movie.HinhAnh || movie.poster || FALLBACK_POSTER,
    backdrop: movie.backdrop || FALLBACK_BACKDROP,
    trailer: movie.Trailer || movie.trailerUrl || FALLBACK_TRAILER,
  };
};
