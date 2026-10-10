import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Smile, Plus, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ChartCard from '../components/ChartCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { formatDate, getMoodEmoji, getMoodLabel, clsx } from '../utils/helpers';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const MOODS = [
  { value: 1, emoji: '😫', color: '#ef4444' }, // red
  { value: 2, emoji: '😔', color: '#f97316' }, // orange
  { value: 3, emoji: '😐', color: '#eab308' }, // yellow
  { value: 4, emoji: '🙂', color: '#84cc16' }, // lime
  { value: 5, emoji: '😄', color: '#22c55e' }  // green
];

export default function Mood() {
  const { data: moods, loading, refetch } = useApi('/moods');
  const { data: stats } = useApi('/moods/stats');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(3);
  const [formData, setFormData] = useState({ note: '', date: new Date().toISOString().split('T')[0] });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const todayStr = new Date().toISOString().split('T')[0];
  const loggedToday = moods?.find(m => m.date === todayStr);

  const avgMoodCounter = useAnimatedCounter(stats?.average || 0, 1000);

  const handleOpenModal = (moodVal = 3) => {
    setSelectedMood(moodVal);
    setFormData({ note: '', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/moods', { mood: selectedMood, ...formData });
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const trendData = useMemo(() => {
    if (!moods) return [];
    return [...moods].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-30);
  }, [moods]);

  const distributionData = useMemo(() => {
    if (!moods) return [];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moods.forEach(m => counts[m.mood]++);
    return Object.entries(counts).map(([mood, count]) => ({
      mood: parseInt(mood),
      count,
      label: `${getMoodEmoji(parseInt(mood))} ${getMoodLabel(parseInt(mood))}`,
      color: MOODS.find(m => m.value === parseInt(mood))?.color || '#cbd5e1'
    }));
  }, [moods]);

  // Calendar logic
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const getMoodForDate = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // adjust for local timezone to string
    const dateStr = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
    return moods?.find(m => m.date === dateStr);
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <PageHeader 
        title="Mood Tracker" 
        subtitle="Track your emotional well-being" 
        actionLabel="Log Mood" 
        onAction={() => handleOpenModal()} 
        actionIcon={Plus} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-6">
          {loggedToday ? (
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="text-6xl">{getMoodEmoji(loggedToday.mood)}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're feeling {getMoodLabel(loggedToday.mood)} today</h3>
                {loggedToday.note && <p className="mt-2 text-gray-600 dark:text-gray-400 italic">"{loggedToday.note}"</p>}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">How are you feeling today?</h3>
              <div className="flex justify-center gap-4">
                {MOODS.map(m => (
                  <button 
                    key={m.value}
                    onClick={() => handleOpenModal(m.value)}
                    className="text-4xl hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                    title={getMoodLabel(m.value)}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Average Mood</div>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            {avgMoodCounter.toFixed(1)}
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Over the last 30 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Mood Over Time">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tickFormatter={(val) => formatDate(val).split(' ')[0]} stroke="currentColor" className="text-gray-400" />
                <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tickFormatter={(val) => getMoodEmoji(val)} stroke="currentColor" className="text-gray-400 text-lg" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
                  labelFormatter={(val) => formatDate(val)}
                  formatter={(val, name, props) => [`${getMoodEmoji(val)} ${getMoodLabel(val)}`, 'Mood']}
                />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No trend data" description="Log your mood to see trends" />
          )}
        </ChartCard>

        <ChartCard title="Mood Distribution">
          {distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="currentColor" className="text-gray-400" />
                <YAxis dataKey="label" type="category" stroke="currentColor" className="text-gray-400 text-sm" width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No distribution data" description="Log your mood to see distribution" />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Mood Calendar">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1 rounded bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-1 rounded bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs font-semibold text-gray-500 py-2">{d}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const moodEntry = getMoodForDate(day);
                const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();
                
                return (
                  <div key={day} className={clsx(
                    "p-2 aspect-square flex items-center justify-center rounded-xl transition-all",
                    isToday ? "bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30" : "hover:bg-gray-50 dark:hover:bg-white/5",
                    moodEntry ? "cursor-pointer" : ""
                  )}>
                    {moodEntry ? (
                      <span className="text-2xl" title={moodEntry.note || getMoodLabel(moodEntry.mood)}>
                        {getMoodEmoji(moodEntry.mood)}
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-700">{day}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
          {moods?.length > 0 ? (
            <div className="space-y-3">
              {[...moods].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 5).map(m => (
                <div key={m.id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="text-3xl">{getMoodEmoji(m.mood)}</div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{getMoodLabel(m.mood)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{formatDate(m.date)}</div>
                    {m.note && <div className="text-sm text-gray-600 dark:text-gray-300">{m.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No recent entries" description="You haven't logged your mood recently." />
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Your Mood">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
            {MOODS.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setSelectedMood(m.value)}
                className={clsx(
                  "text-4xl transition-all duration-200 p-2 rounded-full",
                  selectedMood === m.value ? "scale-125 bg-white dark:bg-white/10 shadow-md" : "opacity-50 hover:opacity-100 hover:scale-110"
                )}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <div className="text-center font-bold text-lg text-gray-900 dark:text-white">
            Feeling {getMoodLabel(selectedMood)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How are you feeling? (optional)</label>
            <textarea 
              rows={3}
              value={formData.note} 
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              placeholder="What's making you feel this way?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              type="date" 
              required 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">Your mood data is private and stored locally.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Mood</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
