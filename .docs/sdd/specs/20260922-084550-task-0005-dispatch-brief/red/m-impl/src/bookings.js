const bookings = [
  { room: 'Norte', day: 'lun', slot: '10:00-12:00' },
  { room: 'Sur', day: 'lun', slot: '09:00-10:00' },
  { room: 'Norte', day: 'mar', slot: '16:00-17:30' },
];

export function bookingsOn(day) {
  return bookings.filter((b) => b.day === day);
}
