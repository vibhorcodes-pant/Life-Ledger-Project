import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const goals = db.prepare('SELECT * FROM goals').all();
  const milestones = db.prepare('SELECT * FROM goal_milestones').all();
  
  const result = goals.map(g => ({
    ...g,
    milestones: milestones.filter(m => m.goal_id === g.id)
  }));
  res.json(result);
});

router.post('/', (req, res) => {
  const { title, description, category, deadline, priority } = req.body;
  const result = db.prepare('INSERT INTO goals (title, description, category, deadline, priority) VALUES (?, ?, ?, ?, ?)')
    .run(title, description, category, deadline, priority);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { title, description, category, deadline, progress, priority, status } = req.body;
  db.prepare('UPDATE goals SET title=?, description=?, category=?, deadline=?, progress=?, priority=?, status=? WHERE id=?')
    .run(title, description, category, deadline, progress, priority, status, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goal_milestones WHERE goal_id=?').run(req.params.id);
  db.prepare('DELETE FROM goals WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

router.post('/:id/milestones', (req, res) => {
  const { title } = req.body;
  const result = db.prepare('INSERT INTO goal_milestones (goal_id, title) VALUES (?, ?)')
    .run(req.params.id, title);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id/milestones/:mid', (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE goal_milestones SET completed=?, completed_at=CURRENT_TIMESTAMP WHERE id=? AND goal_id=?')
    .run(completed ? 1 : 0, req.params.mid, req.params.id);
  res.json({ success: true });
});

export default router;
