import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  // period could be 7, 30, 90, 365. Default 30.
  const period = parseInt(req.query.period) || 30;
  
  // Mock analytics responses based on real DB data
  const dateLimit = `date("now", "-${period} days")`;
  
  const studyTrend = db.prepare(`SELECT date, SUM(duration) as minutes FROM study_sessions WHERE date >= ${dateLimit} GROUP BY date ORDER BY date ASC`).all();
  const totalStudy = studyTrend.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgStudy = Math.round(totalStudy / (studyTrend.length || 1));
  const bestStudy = studyTrend.reduce((prev, current) => (prev.minutes > current.minutes) ? prev : current, { date: '', minutes: 0 });

  const workoutTrend = db.prepare(`SELECT date, duration, calories FROM workouts WHERE date >= ${dateLimit} ORDER BY date ASC`).all();
  const totalWorkouts = workoutTrend.length;
  const totalCalories = workoutTrend.reduce((acc, curr) => acc + curr.calories, 0);

  const sleepTrend = db.prepare(`SELECT date, duration, quality FROM sleep_logs WHERE date >= ${dateLimit} ORDER BY date ASC`).all();
  const avgSleep = Math.round(sleepTrend.reduce((acc, curr) => acc + curr.duration, 0) / (sleepTrend.length || 1));

  const expensesTrend = db.prepare(`SELECT date, SUM(amount) as amount FROM expenses WHERE date >= ${dateLimit} GROUP BY date ORDER BY date ASC`).all();
  const totalExp = expensesTrend.reduce((acc, curr) => acc + curr.amount, 0);
  const byCat = db.prepare(`SELECT category, SUM(amount) as total FROM expenses WHERE date >= ${dateLimit} GROUP BY category`).all();

  const moodTrend = db.prepare(`SELECT date, mood FROM moods WHERE date >= ${dateLimit} ORDER BY date ASC`).all();
  const avgMood = moodTrend.reduce((acc, curr) => acc + curr.mood, 0) / (moodTrend.length || 1);

  // Mock habits consistency
  const habitsConsistency = [];
  for(let i=period; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    habitsConsistency.push({ date: d.toISOString().split('T')[0], completed: Math.floor(Math.random()*8), total: 8 });
  }
  
  const productivity = habitsConsistency.map(h => ({
    date: h.date,
    score: Math.floor((h.completed / h.total) * 100)
  }));

  res.json({
    productivity,
    study: {
      trend: studyTrend,
      total: totalStudy,
      average: avgStudy,
      best: bestStudy
    },
    habits: {
      consistency: habitsConsistency,
      averageRate: 75
    },
    fitness: {
      trend: workoutTrend,
      totalWorkouts,
      totalCalories
    },
    sleep: {
      trend: sleepTrend,
      average: avgSleep
    },
    expenses: {
      trend: expensesTrend,
      total: totalExp,
      average: Math.round(totalExp / (expensesTrend.length || 1)),
      byCategory: byCat
    },
    mood: {
      trend: moodTrend,
      average: parseFloat(avgMood.toFixed(1))
    },
    correlations: [
      "On days when you sleep 7+ hours, your average mood is 23% higher.",
      "You study 35% more on days you complete your morning habits.",
      "Your workout consistency peaks on Tuesdays and Thursdays."
    ]
  });
});

export default router;
