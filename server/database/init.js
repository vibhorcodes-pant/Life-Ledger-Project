import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'life-ledger.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const initSql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT 'Alex',
  email TEXT DEFAULT 'alex@university.edu',
  college TEXT DEFAULT 'Tech University',
  course TEXT DEFAULT 'Computer Science',
  year INTEGER DEFAULT 3,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'dark',
  currency TEXT DEFAULT 'INR',
  week_start TEXT DEFAULT 'monday',
  notifications INTEGER DEFAULT 1,
  reduced_motion INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✅',
  frequency TEXT DEFAULT 'daily',
  target INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER,
  date TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  subject_id INTEGER,
  duration INTEGER NOT NULL,
  date TEXT NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER,
  exercises TEXT,
  notes TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  mood INTEGER NOT NULL,
  note TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'personal',
  deadline TEXT,
  progress INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goal_milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id INTEGER,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  completed_at DATETIME
);

CREATE TABLE IF NOT EXISTS life_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  value REAL,
  mood INTEGER,
  date TEXT NOT NULL,
  time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sleep_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  duration INTEGER NOT NULL,
  quality INTEGER,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(initSql);

export default db;
