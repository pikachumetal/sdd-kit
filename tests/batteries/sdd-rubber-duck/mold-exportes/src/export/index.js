import { loadBookings } from '../bookings/repository.js';
import { bookingsBySlot } from './filter.js';
import { toIcs } from './ics.js';
import { writeExport } from './writer.js';

export function exportMonth(month) {
  return writeExport(month, toIcs(bookingsBySlot(loadBookings(), month)));
}
