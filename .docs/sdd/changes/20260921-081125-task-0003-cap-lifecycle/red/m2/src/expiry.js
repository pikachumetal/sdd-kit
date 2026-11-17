import { sendMail } from './mailer.js';

export const EXPIRY_MINUTES = 30;

export function expirePendingBookings(db, now) {
  const cutoff = new Date(now.getTime() - EXPIRY_MINUTES * 60 * 1000).toISOString();
  const stale = db.prepare("SELECT * FROM bookings WHERE status = 'pending' AND created_at <= ?").all(cutoff);
  for (const booking of stale) {
    db.prepare("UPDATE bookings SET status = 'expired' WHERE id = ?").run(booking.id);
    sendMail(booking.teacher_email, 'Reserva caducada', `Tu reserva del aula ${booking.room_id} ha caducado`);
  }
}
