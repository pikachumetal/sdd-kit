export const EXPIRY_MINUTES = 30;

export function expirePendingBookings(db, now) {
  const cutoff = new Date(now.getTime() - EXPIRY_MINUTES * 60 * 1000).toISOString();
  db.prepare("UPDATE bookings SET status = 'expired' WHERE status = 'pending' AND created_at <= ?").run(cutoff);
}
