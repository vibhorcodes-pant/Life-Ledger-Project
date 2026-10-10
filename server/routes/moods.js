import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const moods = db.prepare('SELECT * FROM moods ORDER BY date DESC, created_at DESC').all();
  res.json(moods);
});

router.post('/', (req, res) => {
  const { mood, note, date } = req.body;
  const result = db.prepare('INSERT INTO moods (mood, note, date) VALUES (?, ?, ?)')
    .run(mood, note, date);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/stats', (req, res) => {
  const avg = db.prepare('SELECT AVG(mood) as a FROM moods WHERE date >= date("now", "-30 days")').get().a || 0;
  
  const dist = db.prepare('SELECT mood, COUNT(*) as count FROM moods WHERE date >= date("now", "-30 days") GROUP BY mood').all();
  
  const calendar = db.prepare('SELECT date, mood FROM moods WHERE date >= date("now", "-30 days") ORDER BY date ASC').all();
  
  res.json({
    average: parseFloat(avg.toFixed(1)),
    trend: 'stable',
    calendar,
    distribution: dist
  });
});

export default router;
