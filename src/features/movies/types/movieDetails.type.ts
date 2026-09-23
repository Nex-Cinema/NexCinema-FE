export interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface ShowtimeSlot {
  id: string;
  time: string;
  seatsLeft: number;
  isHot?: boolean;
  isSoldOut?: boolean;
}

export interface RoomShowtimeGroup {
  roomId: string;
  roomName: string;
  formatTag: string;
  formatColorClass: string;
  techInfo: string;
  slots: ShowtimeSlot[];
}

export interface SidebarMovie {
  id: string;
  title: string;
  imageUrl: string;
}

export interface SelectedShowtime {
  slotId: string;
  time: string;
  roomName: string;
  formatTag: string;
}

export interface DateTabItem {
  dateStr: string;
  dayName: string;
  label: string;
}

export interface MovieDetailsData {
  id: string;
  title: string;
  englishTitle: string;
  tagline: string;
  ratingBadge: string;
  ageRatingText: string;
  duration: string;
  releaseDate: string;
  language: string;
  formatText: string;
  ratingScore: string;
  reviewCount: string;
  genres: string;
  synopsis: string;
  backdropUrl: string;
  posterUrl: string;
  trailerUrl: string;
  director: {
    name: string;
    avatarUrl: string;
  };
  cast: CastMember[];
}
