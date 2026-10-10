import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { filter, category } = req.query;
  
  let query = 'SELECT * FROM life_entries WHERE 1=1';
  const params = [];
  
  if (filter === 'today') {
    query += ' AND date = date("now")';
  } else if (filter === 'week') {
    query += ' AND date >= date("now", "-7 days")';
  } else if (filter === 'month') {
    query += ' AND date >= date("now", "-30 days")';
  }
  
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY date DESC, time DESC, created_at DESC';
  
  const entries = db.prepare(query).all(...params);
  res.json(entries);
});

router.post('/', (req, res) => {
  const { category, title, description, duration, value, mood, date, time } = req.body;
  const result = db.prepare('INSERT INTO life_entries (category, title, description, duration, value, mood, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(category, title, description, duration, value, mood, date, time);
  res.status(201).json({ id: result.lastInsertRowid });
});

export default router;
