import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroOverview3D from './components/HeroOverview3D';
import HydrationVessel3D from './components/HydrationVessel3D';
import NutritionMacros3D from './components/NutritionMacros3D';
import HabitMatrix from './components/HabitMatrix';
import SleepCard3D from './components/SleepCard3D';
import ActivityLog from './components/ActivityLog';
import WeeklyTrendsChart from './components/WeeklyTrendsChart';
import QuickLogModal from './components/QuickLogModal';
import { fetchDashboard } from './services/api';

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('water');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard();
      setDashboard(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Life Ledger backend. Ensure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openLogWithTab = (tab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-black">
      <Header
        dashboard={dashboard}
        loading={loading}
        onRefresh={loadData}
        onOpenQuickLog={() => openLogWithTab('water')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between shadow-3d-sm">
            <span>{error}</span>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        <HeroOverview3D dashboard={dashboard} onUpdate={loadData} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HydrationVessel3D dashboard={dashboard} onUpdate={loadData} />
          <NutritionMacros3D dashboard={dashboard} onUpdate={loadData} onAddMealClick={() => openLogWithTab('meal')} />
          <SleepCard3D dashboard={dashboard} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HabitMatrix habits={dashboard?.habits} onUpdate={loadData} />
          <ActivityLog
            activities={dashboard?.recentActivities}
            onUpdate={loadData}
            onAddActivityClick={() => openLogWithTab('workout')}
          />
        </div>

        <WeeklyTrendsChart weeklyTrends={dashboard?.weeklyTrends} />
      </main>

      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <p>Life Ledger &bull; Unified Lifestyle &amp; Wellness Ecosystem &bull; Java Spring Boot &amp; React</p>
      </footer>

      <QuickLogModal
        isOpen={modalOpen}
        initialTab={modalTab}
        onClose={() => setModalOpen(false)}
        onUpdate={loadData}
      />
    </div>
  );
}
