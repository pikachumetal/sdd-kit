const bookings = [];

function book(room, date, slot) {
  bookings.push({ room, date, slot });
}

function cancel(room, date, slot) {
  const index = bookings.findIndex((b) => b.room === room && b.date === date && b.slot === slot);
  if (index >= 0) bookings.splice(index, 1);
}

module.exports = { bookings, book, cancel };
