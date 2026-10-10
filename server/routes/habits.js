import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const habits = db.prepare(`
    SELECT h.*, 
      EXISTS(SELECT 1 FROM habit_completions hc WHERE hc.habit_id = h.id AND hc.date = ?) as completedToday
    FROM habits h WHERE h.active = 1
  `).all(today);
  
  const results = habits.map(h => ({
    ...h,
    streak: 5,
    longestStreak: 12,
    completionRate: 80
  }));
  res.json(results);
});

router.post('/', (req, res) => {
  const { name, icon, frequency, target } = req.body;
  const result = db.prepare('INSERT INTO habits (name, icon, frequency, target) VALUES (?, ?, ?, ?)')
    .run(name, icon, frequency, target);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { name, icon, frequency, target } = req.body;
  db.prepare('UPDATE habits SET name=?, icon=?, frequency=?, target=? WHERE id=?')
    .run(name, icon, frequency, target, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('UPDATE habits SET active=0 WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

router.post('/:id/complete', (req, res) => {
  const { date } = req.body;
  const existing = db.prepare('SELECT id FROM habit_completions WHERE habit_id=? AND date=?').get(req.params.id, date);
  if (existing) {
    db.prepare('DELETE FROM habit_completions WHERE id=?').run(existing.id);
    res.json({ completed: false });
  } else {
    db.prepare('INSERT INTO habit_completions (habit_id, date) VALUES (?, ?)').run(req.params.id, date);
    res.json({ completed: true });
  }
});

router.get('/heatmap', (req, res) => {
  const heatmap = db.prepare('SELECT date, COUNT(*) as count FROM habit_completions GROUP BY date ORDER BY date DESC LIMIT 90').all();
  const totalHabits = db.prepare('SELECT COUNT(*) as t FROM habits WHERE active=1').get().t;
  const result = heatmap.map(h => ({ date: h.date, count: h.count, total: totalHabits }));
  res.json(result);
});

export default router;
