export interface TicketItem {
  code: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  time: string;
  room: string;
  seats: string;
  price: string;
  status: 'SUCCESS' | 'CANCELLED';
  format: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  message: string;
  read: boolean;
  type: 'TICKET' | 'PAYMENT' | 'REMINDER' | 'FAILED';
}

export interface UserProfileData {
  email: string;
  name: string;
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  role?: string;
}
