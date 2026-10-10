import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import './database/init.js'; // Initialize DB on start

import dashboardRoutes from './routes/dashboard.js';
import habitsRoutes from './routes/habits.js';
import studyRoutes from './routes/study.js';
import workoutsRoutes from './routes/workouts.js';
import expensesRoutes from './routes/expenses.js';
import moodsRoutes from './routes/moods.js';
import goalsRoutes from './routes/goals.js';
import analyticsRoutes from './routes/analytics.js';
import lifeEntriesRoutes from './routes/lifeEntries.js';
import profileRoutes from './routes/profile.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/life-entries', lifeEntriesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
