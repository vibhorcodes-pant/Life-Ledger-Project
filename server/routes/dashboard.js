import express from 'express';
import db from '../database/init.js';

const router = express.Router();

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const user = db.prepare('SELECT name, email, college, course, year FROM users LIMIT 1').get();
  
  const habits = db.prepare(`
    SELECT h.*, 
      EXISTS(SELECT 1 FROM habit_completions hc WHERE hc.habit_id = h.id AND hc.date = ?) as completedToday
    FROM habits h WHERE h.active = 1
  `).all(today);

  const study = db.prepare('SELECT SUM(duration) as total FROM study_sessions WHERE date = ?').get(today);
  const workout = db.prepare('SELECT SUM(duration) as total FROM workouts WHERE date = ?').get(today);
  const sleep = db.prepare('SELECT duration FROM sleep_logs WHERE date = ?').get(today);
  const expenses = db.prepare('SELECT SUM(amount) as total FROM expenses WHERE date = ?').get(today);
  
  const todayStats = {
    study: study.total || 0,
    workout: workout.total || 0,
    sleep: sleep ? sleep.duration : 0,
    screenTime: 180, // Mocked
    expenses: expenses.total || 0,
    habitsCompleted: habits.filter(h => h.completedToday).length,
    habitsTotal: habits.length
  };

  const lifeScore = {
    total: 82,
    breakdown: [
      { label: "Productivity", value: 78, max: 100, color: "indigo" },
      { label: "Study", value: 85, max: 100, color: "violet" },
      { label: "Fitness", value: 72, max: 100, color: "cyan" },
      { label: "Sleep", value: 88, max: 100, color: "blue" },
      { label: "Habits", value: 82, max: 100, color: "emerald" },
      { label: "Finance", value: 76, max: 100, color: "amber" },
      { label: "Mood", value: 90, max: 100, color: "rose" }
    ]
  };

  const weeklyProductivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dStudy = db.prepare('SELECT SUM(duration) as total FROM study_sessions WHERE date = ?').get(dateStr);
    const dWorkout = db.prepare('SELECT SUM(duration) as total FROM workouts WHERE date = ?').get(dateStr);
    const dSleep = db.prepare('SELECT duration FROM sleep_logs WHERE date = ?').get(dateStr);
    
    weeklyProductivity.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      study: dStudy.total || 0,
      workout: dWorkout.total || 0,
      sleep: dSleep ? dSleep.duration : 0
    });
  }

  const weeklyStats = {
    studyHours: Math.round(weeklyProductivity.reduce((acc, curr) => acc + curr.study, 0) / 60),
    workoutHours: Math.round(weeklyProductivity.reduce((acc, curr) => acc + curr.workout, 0) / 60),
    avgSleep: Math.round(weeklyProductivity.reduce((acc, curr) => acc + curr.sleep, 0) / 7),
    avgMood: 4.2,
    moneySpent: 1250,
    goalsCompleted: 1
  };

  const insights = [
    "Your productivity was 18% higher this week compared to last week.",
    "You studied most effectively between 7 PM and 10 PM.",
    "Your sleep dropped by 42 minutes compared to last week.",
    "You're spending more on food on weekends.",
    "Great job maintaining your workout streak!"
  ];

  res.json({
    user,
    lifeScore,
    todayStats,
    habits,
    weeklyProductivity,
    weeklyStats,
    insights
  });
});

export default router;
