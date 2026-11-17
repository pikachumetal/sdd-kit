export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Booking {
  id: number;
  room: string;
  start: string;
  status: BookingStatus;
}
