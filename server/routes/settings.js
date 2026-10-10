import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const settings = db.prepare('SELECT theme, currency, week_start as weekStart, notifications, reduced_motion as reducedMotion FROM settings LIMIT 1').get();
  res.json({
    ...settings,
    notifications: !!settings.notifications,
    reducedMotion: !!settings.reducedMotion
  });
});

router.put('/', (req, res) => {
  const { theme, currency, weekStart, notifications, reducedMotion } = req.body;
  db.prepare('UPDATE settings SET theme=?, currency=?, week_start=?, notifications=?, reduced_motion=? WHERE id=1')
    .run(theme, currency, weekStart, notifications ? 1 : 0, reducedMotion ? 1 : 0);
  res.json({ success: true });
});

export default router;
