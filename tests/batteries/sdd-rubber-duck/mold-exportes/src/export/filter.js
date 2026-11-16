export function bookingsBySlot(bookings, month) {
  return bookings
    .filter((booking) => booking.day.startsWith(month) && booking.status !== 'cancelled')
    .sort((a, b) => `${a.day} ${a.slot}`.localeCompare(`${b.day} ${b.slot}`));
}
