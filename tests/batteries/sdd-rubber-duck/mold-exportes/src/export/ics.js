const COWORKING_OFFSET = '+02:00';

function toUtcStamp(day, time) {
  const utc = new Date(`${day}T${time}:00${COWORKING_OFFSET}`).toISOString();
  return utc.replace(/[-:]/g, '').slice(0, 15);
}

function toEvent(booking) {
  const [start, end] = booking.slot.split('-');
  return [
    'BEGIN:VEVENT',
    `SUMMARY:Sala ${booking.room}`,
    `DTSTART:${toUtcStamp(booking.day, start)}`,
    `DTEND:${toUtcStamp(booking.day, end)}`,
    'END:VEVENT',
  ].join('\r\n');
}

export function toIcs(bookings) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', ...bookings.map(toEvent), 'END:VCALENDAR'].join('\r\n');
}
