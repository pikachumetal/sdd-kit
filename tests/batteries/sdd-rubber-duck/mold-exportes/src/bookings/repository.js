import { readFileSync } from 'node:fs';

const DATA = new URL('../../data/bookings.json', import.meta.url);

export function loadBookings() {
  return JSON.parse(readFileSync(DATA, 'utf8'));
}
