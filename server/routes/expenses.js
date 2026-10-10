import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { period } = req.query;
  let query = 'SELECT * FROM expenses ';
  if (period === 'today') query += 'WHERE date = date("now") ';
  else if (period === 'week') query += 'WHERE date >= date("now", "-7 days") ';
  else if (period === 'month') query += 'WHERE date >= date("now", "-30 days") ';
  
  query += 'ORDER BY date DESC, created_at DESC';
  const expenses = db.prepare(query).all();
  res.json(expenses);
});

router.post('/', (req, res) => {
  const { amount, category, description, date } = req.body;
  const result = db.prepare('INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)')
    .run(amount, category, description, date);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { amount, category, description, date } = req.body;
  db.prepare('UPDATE expenses SET amount=?, category=?, description=?, date=? WHERE id=?')
    .run(amount, category, description, date, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

router.get('/stats', (req, res) => {
  const today = db.prepare('SELECT SUM(amount) as s FROM expenses WHERE date = date("now")').get().s || 0;
  const thisWeek = db.prepare('SELECT SUM(amount) as s FROM expenses WHERE date >= date("now", "-7 days")').get().s || 0;
  const thisMonth = db.prepare('SELECT SUM(amount) as s FROM expenses WHERE date >= date("now", "-30 days")').get().s || 0;
  
  const categories = db.prepare('SELECT category, SUM(amount) as total FROM expenses WHERE date >= date("now", "-30 days") GROUP BY category').all();
  
  res.json({
    today,
    thisWeek,
    thisMonth,
    categoryBreakdown: categories
  });
});

export default router;
