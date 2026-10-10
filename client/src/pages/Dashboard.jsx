import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, Dumbbell, Smile, Sparkles, Brain, X,
  BookOpen, Activity, Moon, Smartphone, Wallet, Target
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { formatCurrency, formatDuration, getGreeting, formatDate } from '../utils/helpers';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import HabitCard from '../components/HabitCard';
import LifeScore from '../components/LifeScore';
import QuickAction from '../components/QuickAction';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { data: dashboardData, loading, error, refetch } = useApi('/dashboard');
  const navigate = useNavigate();

  // Modal states
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  if (loading) return <LoadingSkeleton type="card" count={6} />;
  if (error) return <div className="p-6 text-rose-500">Error loading dashboard: {error}</div>;
  if (!dashboardData) return null;

  const { todayStats, weeklyProductivity, habits, lifeScore, insights, user } = dashboardData;
  const userName = user?.name || 'Alex';

  const completedHabits = habits?.filter(h => h.completedToday).length || 0;
  const totalHabits = habits?.length || 0;

  const handleHabitComplete = async (id) => {
    try {
      await api.post(`/habits/${id}/complete`, { date: new Date().toISOString().split('T')[0] });
      refetch();
    } catch (err) {
      console.error('Failed to complete habit', err);
    }
  };

  const handleQuickAdd = async (endpoint, data, setModal) => {
    try {
      await api.post(endpoint, data);
      setModal(false);
      refetch();
    } catch (err) {
      console.error(`Failed to add ${endpoint}`, err);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(new Date().toISOString())} • Let's make today count.
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center text-white font-bold text-lg">
          {userName.charAt(0)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Row */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-wrap gap-4">
            <QuickAction icon={BookOpen} label="Add Study" onClick={() => setIsStudyModalOpen(true)} color="indigo" />
            <QuickAction icon={Wallet} label="Add Expense" onClick={() => setIsExpenseModalOpen(true)} color="amber" />
            <QuickAction icon={Check} label="Complete Habit" onClick={() => navigate('/habits')} color="emerald" />
            <QuickAction icon={Dumbbell} label="Log Workout" onClick={() => setIsWorkoutModalOpen(true)} color="cyan" />
            <QuickAction icon={Smile} label="Log Mood" onClick={() => setIsMoodModalOpen(true)} color="rose" />
          </motion.div>

          {/* Today's Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Today's Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard title="Study" value={formatDuration(todayStats?.study || 0)} icon={BookOpen} color="indigo" />
              <StatCard title="Workout" value={formatDuration(todayStats?.workout || 0)} icon={Dumbbell} color="cyan" />
              <StatCard title="Sleep" value={formatDuration(todayStats?.sleep || 0)} icon={Moon} color="violet" />
              <StatCard title="Screen Time" value={formatDuration(todayStats?.screenTime || 0)} icon={Smartphone} color="rose" />
              <StatCard title="Expenses" value={formatCurrency(todayStats?.expenses || 0)} icon={Wallet} color="amber" />
              <StatCard title="Habits" value={`${completedHabits}/${totalHabits}`} subtitle="completed" icon={Check} color="emerald" />
            </div>
          </div>

          {/* Productivity Chart */}
          <ChartCard title="Weekly Productivity" subtitle="Study vs Workout hours">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWorkout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="study" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudy)" />
                  <Area type="monotone" dataKey="workout" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWorkout)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Today's Habits */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Habits</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/habits')}>View All</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {habits?.slice(0, 4).map((habit, i) => (
                <HabitCard key={habit.id} habit={habit} onComplete={handleHabitComplete} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Life Score */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <LifeScore score={lifeScore?.total || 0} breakdown={lifeScore?.breakdown || []} />
          </div>

          {/* AI Insights */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-400" size={20} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
            </div>
            <ul className="space-y-4">
              {insights?.map((insight, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Brain className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                  <p>{insight}</p>
                </li>
              ))}
              {(!insights || insights.length === 0) && (
                <li className="text-sm text-gray-500">No new insights right now. Keep logging!</li>
              )}
            </ul>
            <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
              Powered by local analytics. AI integration coming soon.
            </p>
          </div>

          {/* Weekly Summary Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 text-center">
                <p className="text-gray-500 text-xs mb-1">Study Hours</p>
                <p className="font-bold text-lg text-indigo-500">{formatDuration(dashboardData?.weeklySummary?.study || 0)}</p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 text-center">
                <p className="text-gray-500 text-xs mb-1">Workout</p>
                <p className="font-bold text-lg text-cyan-500">{formatDuration(dashboardData?.weeklySummary?.workout || 0)}</p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 text-center">
                <p className="text-gray-500 text-xs mb-1">Avg Sleep</p>
                <p className="font-bold text-lg text-violet-500">{formatDuration(dashboardData?.weeklySummary?.avgSleep || 0)}</p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 text-center">
                <p className="text-gray-500 text-xs mb-1">Money Spent</p>
                <p className="font-bold text-lg text-amber-500">{formatCurrency(dashboardData?.weeklySummary?.expenses || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isStudyModalOpen} onClose={() => setIsStudyModalOpen(false)} title="Log Study Session">
        <form onSubmit={(e) => { e.preventDefault(); handleQuickAdd('/study/sessions', { subjectId: 1, duration: 60, date: new Date().toISOString().split('T')[0], notes: 'Dashboard quick log' }, setIsStudyModalOpen); }} className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Quick log a 60 min session.</p>
          <Button type="submit" className="w-full">Save Session</Button>
        </form>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense">
        <form onSubmit={(e) => { e.preventDefault(); handleQuickAdd('/expenses', { amount: 100, category: 'Food', date: new Date().toISOString().split('T')[0], description: 'Lunch' }, setIsExpenseModalOpen); }} className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Quick log ₹100 for Food.</p>
          <Button type="submit" className="w-full">Save Expense</Button>
        </form>
      </Modal>
      
      <Modal isOpen={isWorkoutModalOpen} onClose={() => setIsWorkoutModalOpen(false)} title="Log Workout">
        <form onSubmit={(e) => { e.preventDefault(); handleQuickAdd('/workouts', { type: 'Gym', duration: 45, date: new Date().toISOString().split('T')[0] }, setIsWorkoutModalOpen); }} className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Quick log 45 min Gym workout.</p>
          <Button type="submit" className="w-full">Save Workout</Button>
        </form>
      </Modal>

      <Modal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} title="Log Mood">
        <form onSubmit={(e) => { e.preventDefault(); handleQuickAdd('/moods', { mood: 4, date: new Date().toISOString().split('T')[0] }, setIsMoodModalOpen); }} className="space-y-4">
          <div className="flex justify-between py-4">
            {['😫', '😔', '😐', '🙂', '😄'].map((emoji, i) => (
              <button key={i} type="button" className="text-4xl hover:scale-110 transition-transform">{emoji}</button>
            ))}
          </div>
          <Button type="submit" className="w-full">Save Mood</Button>
        </form>
      </Modal>

    </motion.div>
  );
}
