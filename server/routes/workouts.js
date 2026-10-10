import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const workouts = db.prepare('SELECT * FROM workouts ORDER BY date DESC, created_at DESC').all();
  res.json(workouts);
});

router.post('/', (req, res) => {
  const { type, duration, calories, exercises, notes, date } = req.body;
  const result = db.prepare('INSERT INTO workouts (type, duration, calories, exercises, notes, date) VALUES (?, ?, ?, ?, ?, ?)')
    .run(type, duration, calories, exercises, notes, date);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/stats', (req, res) => {
  const thisWeek = db.prepare('SELECT COUNT(*) as c FROM workouts WHERE date >= date("now", "-7 days")').get().c;
  const thisMonth = db.prepare('SELECT COUNT(*) as c FROM workouts WHERE date >= date("now", "-30 days")').get().c;
  const total = db.prepare('SELECT COUNT(*) as c, AVG(duration) as a, SUM(calories) as s FROM workouts').get();
  
  res.json({
    thisWeek,
    thisMonth,
    totalWorkouts: total.c,
    avgDuration: Math.round(total.a || 0),
    caloriesBurned: total.s || 0
  });
});

export default router;
