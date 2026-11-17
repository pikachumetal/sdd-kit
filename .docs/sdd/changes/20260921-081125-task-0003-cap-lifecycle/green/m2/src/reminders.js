import { sendMail } from './mailer.js';

export const REMINDER_HOURS_BEFORE = 12;

export function sendDueReminders(db, now) {
  const limit = new Date(now.getTime() + REMINDER_HOURS_BEFORE * 3600 * 1000).toISOString();
  const due = db.prepare("SELECT * FROM bookings WHERE status = 'confirmed' AND reminded = 0 AND start <= ?").all(limit);
  for (const booking of due) {
    sendMail(booking.teacher_email, 'Recordatorio de reserva', `Aula ${booking.room_id} a las ${booking.start}`);
    db.prepare('UPDATE bookings SET reminded = 1 WHERE id = ?').run(booking.id);
  }
}
