import { mkdirSync, writeFileSync } from 'node:fs';

export function persist(bookings) {
  setTimeout(() => {
    mkdirSync('data', { recursive: true });
    writeFileSync('data/bookings.json', JSON.stringify(bookings, null, 2));
    console.log('guardado');
  }, 2000);
}
