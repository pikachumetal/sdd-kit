import { Router } from 'express';

export function isBookableDay(start) {
  const day = new Date(start).getDay();
  return day !== 0 && day !== 6;
}

export function bookingsRouter(db) {
  const router = Router();
  router.post('/', (req, res) => {
    const { roomId, start, end, teacherId } = req.body;
    if (!isBookableDay(start)) {
      return res.status(422).json({ error: 'Solo se reserva de lunes a viernes' });
    }
    const insert = db.prepare('INSERT INTO bookings (room_id, start, end, teacher_id, status) VALUES (?, ?, ?, ?, ?)');
    const id = insert.run(roomId, start, end, teacherId, 'pending').lastInsertRowid;
    res.status(201).json({ id, status: 'pending' });
  });
  return router;
}
