import { isOverlapping } from './slots.js';
import { slotMinutes } from './duration.js';

export function formatWeekSummary(slots) {
  if (slots.length === 0) return 'Sin huecos esta semana';
  const byDay = new Map();
  for (const slot of slots) {
    const daySlots = byDay.get(slot.day) ?? [];
    const hasOverlap = daySlots.some((other) => isOverlapping(other, slot));
    if (hasOverlap) {
      throw new Error(`Huecos solapados el ${slot.day}`);
    }
    daySlots.push(slot);
    byDay.set(slot.day, daySlots);
  }
  const days = [...byDay.keys()].sort();
  const lines = days.map((day) => {
    const daySlots = byDay.get(day);
    const minutes = daySlots.reduce((total, slot) => total + slotMinutes(slot), 0);
    const noun = daySlots.length === 1 ? 'hueco' : 'huecos';
    return `${day}: ${daySlots.length} ${noun}, ${minutes} min`;
  });
  return lines.join('\n');
}
