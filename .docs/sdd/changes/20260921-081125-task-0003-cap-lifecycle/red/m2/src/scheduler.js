import { sendDueReminders } from './reminders.js';
import { expirePendingBookings } from './expiry.js';

export function startScheduler(db) {
  return setInterval(() => {
    const now = new Date();
    sendDueReminders(db, now);
    expirePendingBookings(db, now);
  }, 60 * 1000);
}
