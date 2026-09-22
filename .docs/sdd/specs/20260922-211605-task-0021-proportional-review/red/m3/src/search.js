export function searchBookings(bookings, query) {
  const text = query.trim().toLowerCase();
  if (text === '') return [];
  return bookings.filter((booking) => booking.customer.toLowerCase().includes(text));
}
