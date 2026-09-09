export interface Movie {
  id: string | number;
  title: string;
  genre: string;
  duration: number; // in minutes
  rating: number; // e.g. 9.4
  reviewsCount?: string;
  ageRating: 'P' | 'K' | 'C13' | 'C16' | 'C18';
  formats: string[]; // ['2D', '3D', 'IMAX']
  poster: string;
  backdrop?: string;
  tag?: string; // 'HOT', 'BÁN CHẠY'
  releaseDate?: string;
  synopsis?: string;
}

export interface ShowtimeSlot {
  time: string;
  hall: string;
  format: string;
  seatsLeft: number;
  isHot?: boolean;
  isSoldOut?: boolean;
}

export interface MovieShowtimeGroup {
  movie: Movie;
  hallFormats: {
    formatName: string;
    slots: ShowtimeSlot[];
  }[];
}

export interface NewsItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  excerpt: string;
}
