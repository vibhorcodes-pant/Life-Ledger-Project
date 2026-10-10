import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import LoadingSkeleton from './components/LoadingSkeleton';

// Lazy load all pages for performance
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WellnessHub = lazy(() => import('./pages/WellnessHub'));
const LifeLedger = lazy(() => import('./pages/LifeLedger'));
const Habits = lazy(() => import('./pages/Habits'));
const Study = lazy(() => import('./pages/Study'));
const Fitness = lazy(() => import('./pages/Fitness'));
const Finance = lazy(() => import('./pages/Finance'));
const Mood = lazy(() => import('./pages/Mood'));
const Goals = lazy(() => import('./pages/Goals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center p-8 bg-slate-50 dark:bg-[#0f172a]">
    <div className="w-full max-w-4xl space-y-4">
      <LoadingSkeleton type="card" count={1} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="card" count={1} />
      </div>
      <LoadingSkeleton type="chart" count={1} />
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Landing page without layout */}
              <Route path="/" element={<Landing />} />

              {/* All app pages inside MainLayout with sidebar */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wellness" element={<WellnessHub />} />
                <Route path="/life-ledger" element={<LifeLedger />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/study" element={<Study />} />
                <Route path="/fitness" element={<Fitness />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/mood" element={<Mood />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
