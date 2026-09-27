import express from 'express';
import Database from 'better-sqlite3';
import { bookingsRouter } from './bookings.js';

const db = new Database(process.env.DB_PATH ?? 'data/aulario.db');
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.sendStatus(200));
app.use('/bookings', bookingsRouter(db));
app.listen(3000);
