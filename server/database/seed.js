import db from './init.js';

console.log('Seeding database...');

const today = new Date('2026-10-07T00:00:00Z');

function getDate(daysAgo) {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const clearTables = [
  'users', 'settings', 'habits', 'habit_completions', 'subjects',
  'study_sessions', 'workouts', 'expenses', 'moods', 'goals',
  'goal_milestones', 'life_entries', 'sleep_logs'
];

db.transaction(() => {
  for (const table of clearTables) {
    db.prepare(`DELETE FROM ${table}`).run();
    db.prepare(`DELETE FROM sqlite_sequence WHERE name='${table}'`).run();
  }

  // 1. User
  db.prepare(`
    INSERT INTO users (name, email, college, course, year)
    VALUES ('Alex', 'alex@university.edu', 'Tech University', 'Computer Science', 3)
  `).run();

  // 2. Settings
  db.prepare(`
    INSERT INTO settings (user_id, theme, currency, week_start)
    VALUES (1, 'dark', 'INR', 'monday')
  `).run();

  // 3. Habits
  const habits = [
    { name: 'Drink Water', icon: '💧' },
    { name: 'Study 2 Hours', icon: '📚' },
    { name: 'Read 20 Pages', icon: '📖' },
    { name: 'Workout', icon: '💪' },
    { name: 'Sleep Before 12', icon: '🌙' },
    { name: 'Meditate', icon: '🧘' },
    { name: 'No Junk Food', icon: '🥗' },
    { name: 'Journal', icon: '📝' }
  ];

  const insertHabit = db.prepare(`INSERT INTO habits (name, icon, frequency, target) VALUES (?, ?, 'daily', 1)`);
  habits.forEach(h => insertHabit.run(h.name, h.icon));

  // 4. Habit Completions (30 days)
  const insertCompletion = db.prepare(`INSERT INTO habit_completions (habit_id, date) VALUES (?, ?)`);
  for (let i = 0; i <= 30; i++) {
    const d = getDate(i);
    if (i === 0) {
      // Today: habits 1,2,4,5,6,7 (1-based IDs)
      [1, 2, 4, 5, 6, 7].forEach(hId => insertCompletion.run(hId, d));
    } else {
      // Random 4-7 habits
      const numCompletions = Math.floor(Math.random() * 4) + 4; // 4 to 7
      let completedIds = [];
      while (completedIds.length < numCompletions) {
        let randId = Math.floor(Math.random() * 8) + 1;
        if (!completedIds.includes(randId)) completedIds.push(randId);
      }
      completedIds.forEach(hId => insertCompletion.run(hId, d));
    }
  }

  // 5. Subjects
  const subjects = [
    { name: 'Data Structures & Algorithms', color: '#6366f1' },
    { name: 'Operating Systems', color: '#8b5cf6' },
    { name: 'Database Management', color: '#06b6d4' },
    { name: 'Web Development', color: '#f59e0b' },
    { name: 'Machine Learning', color: '#22c55e' }
  ];
  const insertSubject = db.prepare(`INSERT INTO subjects (name, color) VALUES (?, ?)`);
  subjects.forEach(s => insertSubject.run(s.name, s.color));

  // 6. Study Sessions (30 days)
  const insertStudy = db.prepare(`INSERT INTO study_sessions (subject_id, duration, date, notes) VALUES (?, ?, ?, ?)`);
  for (let i = 0; i <= 30; i++) {
    const d = getDate(i);
    if (i === 0) {
      // Today: ~205 min
      insertStudy.run(1, 90, d, 'Graph algorithms');
      insertStudy.run(4, 60, d, 'React hooks');
      insertStudy.run(2, 55, d, 'Process scheduling');
    } else {
      const numSessions = Math.floor(Math.random() * 3) + 2; // 2 to 4
      for (let j = 0; j < numSessions; j++) {
        const subId = Math.floor(Math.random() * 5) + 1;
        const dur = Math.floor(Math.random() * 91) + 30; // 30 to 120
        insertStudy.run(subId, dur, d, 'Study notes');
      }
    }
  }

  // 7. Sleep Logs
  const insertSleep = db.prepare(`INSERT INTO sleep_logs (duration, quality, date) VALUES (?, ?, ?)`);
  for (let i = 0; i <= 30; i++) {
    const d = getDate(i);
    if (i === 0) {
      insertSleep.run(452, 4, d); // Today
    } else {
      const dur = Math.floor(Math.random() * 121) + 380; // 380 to 500
      const qual = Math.floor(Math.random() * 3) + 3; // 3 to 5
      insertSleep.run(dur, qual, d);
    }
  }

  // 8. Workouts
  const insertWorkout = db.prepare(`INSERT INTO workouts (type, duration, calories, date) VALUES (?, ?, ?, ?)`);
  const wTypes = ['Running', 'Gym', 'Yoga', 'Swimming', 'Cycling'];
  // Today
  insertWorkout.run('Gym', 45, 300, getDate(0));
  // 19 more workouts
  for (let i = 0; i < 19; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const type = wTypes[Math.floor(Math.random() * wTypes.length)];
    const dur = Math.floor(Math.random() * 61) + 30; // 30-90
    const cal = Math.floor(Math.random() * 351) + 150; // 150-500
    insertWorkout.run(type, dur, cal, getDate(daysAgo));
  }

  // 9. Expenses
  const insertExpense = db.prepare(`INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)`);
  const expCats = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Subscriptions'];
  // Today: ₹420
  insertExpense.run(220, 'Food', 'Lunch', getDate(0));
  insertExpense.run(200, 'Travel', 'Bus ticket', getDate(0));
  // 60+ expenses
  for (let i = 0; i < 65; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const cat = expCats[Math.floor(Math.random() * expCats.length)];
    const amount = Math.floor(Math.random() * 1971) + 30; // 30-2000
    insertExpense.run(amount, cat, 'Misc', getDate(daysAgo));
  }

  // 10. Moods
  const insertMood = db.prepare(`INSERT INTO moods (mood, note, date) VALUES (?, ?, ?)`);
  for (let i = 0; i <= 30; i++) {
    const d = getDate(i);
    if (i === 0) {
      insertMood.run(4, 'Feeling productive', d);
    } else {
      const mood = Math.floor(Math.random() * 4) + 2; // 2-5
      insertMood.run(mood, 'Daily check-in', d);
    }
  }

  // 11. Goals & Milestones
  const goals = [
    { title: 'Finish DSA Course', cat: 'academic', prog: 65, pri: 'high', ms: 4 },
    { title: 'Reach 70kg', cat: 'fitness', prog: 40, pri: 'medium', ms: 3 },
    { title: 'Save ₹20,000', cat: 'finance', prog: 55, pri: 'high', ms: 2 },
    { title: 'Build Final Year Project', cat: 'academic', prog: 30, pri: 'high', ms: 5 },
    { title: 'Get 9.0 CGPA', cat: 'academic', prog: 75, pri: 'high', ms: 3 }
  ];
  const insertGoal = db.prepare(`INSERT INTO goals (title, category, progress, priority) VALUES (?, ?, ?, ?)`);
  const insertMs = db.prepare(`INSERT INTO goal_milestones (goal_id, title, completed) VALUES (?, ?, ?)`);
  goals.forEach((g, idx) => {
    insertGoal.run(g.title, g.cat, g.prog, g.pri);
    const gId = idx + 1;
    for (let m = 1; m <= g.ms; m++) {
      const isComp = m <= Math.ceil(g.ms * (g.prog / 100)) ? 1 : 0;
      insertMs.run(gId, `Milestone ${m}`, isComp);
    }
  });

  // 12. Life Entries
  const insertLifeEntry = db.prepare(`INSERT INTO life_entries (category, title, duration, value, mood, date) VALUES (?, ?, ?, ?, ?, ?)`);
  const leCats = ['study', 'workout', 'expense', 'mood', 'achievement', 'personal'];
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const cat = leCats[Math.floor(Math.random() * leCats.length)];
    insertLifeEntry.run(cat, `Logged ${cat}`, 60, 100, 4, getDate(daysAgo));
  }
})();

console.log('Database seeded successfully!');
