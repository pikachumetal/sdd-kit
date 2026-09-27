import { Router } from 'express';

export function bookingsRouter(db) {
  const router = Router();
  router.post('/', (req, res) => {
    const { roomId, start, end, teacherId } = req.body;
    const insert = db.prepare('INSERT INTO bookings (room_id, start, end, teacher_id, status) VALUES (?, ?, ?, ?, ?)');
    const id = insert.run(roomId, start, end, teacherId, 'pending').lastInsertRowid;
    res.status(201).json({ id, status: 'pending' });
  });
  router.post('/:id/confirm', (req, res) => {
    db.prepare("UPDATE bookings SET status = 'confirmed' WHERE id = ?").run(req.params.id);
    res.json({ id: Number(req.params.id), status: 'confirmed' });
  });
  router.post('/:id/cancel', (req, res) => {
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(req.params.id);
    res.json({ id: Number(req.params.id), status: 'cancelled' });
  });
  return router;
}
