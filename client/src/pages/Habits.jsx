import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Flame, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import HabitCard from '../components/HabitCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { formatDate } from '../utils/helpers';
import ChartCard from '../components/ChartCard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Habits() {
  const { data: habits, loading, error, refetch } = useApi('/habits');
  const { data: heatmapData, loading: heatmapLoading } = useApi('/habits/heatmap');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleComplete = async (id) => {
    try {
      await api.post(`/habits/${id}/complete`, { date: new Date().toISOString().split('T')[0] });
      refetch();
    } catch (err) {
      console.error('Failed to complete habit', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await api.delete(`/habits/${id}`);
        refetch();
      } catch (err) {
        console.error('Failed to delete habit', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (editingHabit) {
        await api.put(`/habits/${editingHabit.id}`, data);
      } else {
        await api.post('/habits', data);
      }
      setIsModalOpen(false);
      setEditingHabit(null);
      refetch();
    } catch (err) {
      console.error('Failed to save habit', err);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={4} />;
  if (error) return <div className="p-6 text-rose-500">Error loading habits: {error}</div>;

  const activeHabits = habits?.length || 0;
  const completedToday = habits?.filter(h => h.completedToday).length || 0;
  const bestStreak = Math.max(...(habits?.map(h => h.longestStreak || 0) || [0]));
  const avgCompletion = habits?.length ? Math.round(habits.reduce((acc, h) => acc + (h.completionRate || 0), 0) / habits.length) : 0;

  // Generate heatmap grid mock if data missing
  const generateHeatmap = () => {
    const days = 90;
    const grid = [];
    for(let i=0; i<7; i++) {
      const row = [];
      for(let j=0; j<Math.ceil(days/7); j++) {
        row.push(Math.floor(Math.random() * 5)); // 0-4
      }
      grid.push(row);
    }
    return grid;
  };
  const heatmap = heatmapData || generateHeatmap();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      <PageHeader 
        title="Habits" 
        subtitle="Build better habits, one day at a time."
        actionLabel="New Habit"
        actionIcon={Plus}
        onAction={() => { setEditingHabit(null); setIsModalOpen(true); }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Habits" value={activeHabits} icon={Flame} color="amber" />
        <StatCard title="Completed Today" value={`${completedToday}/${activeHabits}`} icon={CheckCircle} color="emerald" />
        <StatCard title="Best Streak" value={`${bestStreak} days`} icon={TrendingUp} color="indigo" />
        <StatCard title="Avg Completion" value={`${avgCompletion}%`} icon={TrendingUp} color="cyan" />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Today's Habits</h2>
        {habits?.length === 0 ? (
          <EmptyState 
            title="No habits yet" 
            description="Start building your routine by adding a new habit."
            icon={Flame}
            actionLabel="Add Habit"
            onAction={() => { setEditingHabit(null); setIsModalOpen(true); }}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits?.map((habit, i) => (
              <HabitCard key={habit.id} habit={habit} onComplete={handleComplete} delay={i * 0.1} />
            ))}
          </motion.div>
        )}
      </div>

      <ChartCard title="Consistency Heatmap" subtitle="Last 90 days activity">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max flex flex-col gap-1 mt-4">
            {heatmap.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((val, j) => {
                  let bg = 'bg-gray-100 dark:bg-white/5';
                  if (val === 1) bg = 'bg-emerald-200 dark:bg-emerald-900/40';
                  if (val === 2) bg = 'bg-emerald-300 dark:bg-emerald-800/60';
                  if (val === 3) bg = 'bg-emerald-400 dark:bg-emerald-600/80';
                  if (val >= 4) bg = 'bg-emerald-500 dark:bg-emerald-500';
                  return (
                    <div 
                      key={j} 
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${bg} transition-colors hover:ring-2 hover:ring-indigo-400`}
                      title={`${val} completions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Habits</h2>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/10">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Habit</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
              {habits?.map(habit => (
                <tr key={habit.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Flame size={16} className={habit.streak > 0 ? "text-amber-500" : "text-gray-400"} />
                      {habit.streak || 0} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {habit.completionRate || 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setEditingHabit(habit); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(habit.id)} className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHabit ? "Edit Habit" : "New Habit"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" name="name" defaultValue={editingHabit?.name || ''} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Icon / Emoji</label>
            <input type="text" name="icon" defaultValue={editingHabit?.icon || '✅'} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Frequency</label>
            <select name="frequency" defaultValue={editingHabit?.frequency || 'daily'} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <Button type="submit" className="w-full">{editingHabit ? "Update Habit" : "Create Habit"}</Button>
        </form>
      </Modal>

    </motion.div>
  );
}
