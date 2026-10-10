import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const profile = db.prepare('SELECT id, name, email, college, course, year, avatar FROM users LIMIT 1').get();
  
  const studyHours = Math.round((db.prepare('SELECT SUM(duration) as s FROM study_sessions').get().s || 0) / 60);
  const workouts = db.prepare('SELECT COUNT(*) as c FROM workouts').get().c || 0;
  const goalsCompleted = db.prepare('SELECT COUNT(*) as c FROM goals WHERE progress >= 100 OR status = "completed"').get().c || 0;
  
  res.json({
    ...profile,
    stats: {
      totalStudyHours: studyHours,
      totalWorkouts: workouts,
      bestHabitStreak: 12, // Mocked
      goalsCompleted
    }
  });
});

router.put('/', (req, res) => {
  const { name, email, college, course, year } = req.body;
  db.prepare('UPDATE users SET name=?, email=?, college=?, course=?, year=? WHERE id=1')
    .run(name, email, college, course, year);
  res.json({ success: true });
});

export default router;
