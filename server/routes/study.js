import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/sessions', (req, res) => {
  const sessions = db.prepare(`
    SELECT ss.*, s.name as subjectName, s.color as subjectColor
    FROM study_sessions ss
    LEFT JOIN subjects s ON ss.subject_id = s.id
    ORDER BY ss.date DESC, ss.created_at DESC
  `).all();
  res.json(sessions);
});

router.post('/sessions', (req, res) => {
  const { subjectId, duration, date, notes } = req.body;
  const result = db.prepare('INSERT INTO study_sessions (subject_id, duration, date, notes) VALUES (?, ?, ?, ?)')
    .run(subjectId, duration, date, notes);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/subjects', (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects').all();
  res.json(subjects);
});

router.post('/subjects', (req, res) => {
  const { name, color } = req.body;
  const result = db.prepare('INSERT INTO subjects (name, color) VALUES (?, ?)').run(name, color);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayMinutes = db.prepare('SELECT SUM(duration) as t FROM study_sessions WHERE date = ?').get(today).t || 0;
  
  const dist = db.prepare(`
    SELECT s.name, s.color, SUM(ss.duration) as minutes
    FROM study_sessions ss
    JOIN subjects s ON ss.subject_id = s.id
    GROUP BY s.id
  `).all();
  
  res.json({
    todayMinutes,
    weekMinutes: todayMinutes * 5, // mock
    monthMinutes: todayMinutes * 20, // mock
    streak: 12,
    subjectDistribution: dist
  });
});

export default router;
