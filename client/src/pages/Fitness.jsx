import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, Activity, Heart, Calendar, Plus, Flame, 
  Trash2, TrendingUp, Clock
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { formatDuration, formatDate } from '../utils/helpers';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const getWorkoutIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'running': return Activity;
    case 'gym': return Dumbbell;
    case 'yoga': return Heart;
    case 'swimming': return Activity;
    case 'cycling': return Activity;
    default: return Activity;
  }
};

export default function Fitness() {
  const { data: workouts, loading: workoutsLoading, refetch } = useApi('/workouts');
  const { data: stats, loading: statsLoading } = useApi('/workouts/stats');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await api.post('/workouts', data);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      try {
        await api.delete(`/workouts/${id}`);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (workoutsLoading || statsLoading) return <LoadingSkeleton type="card" count={4} />;

  // Mock charts data if not provided by backend properly
  const freqData = workouts?.length ? workouts.slice(0, 14).map(w => ({ date: w.date.substring(5), count: 1 })) : [];
  const durationData = workouts?.length ? workouts.slice(0, 30).map(w => ({ date: w.date.substring(5), duration: w.duration })) : [];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader 
        title="Fitness" 
        subtitle="Track your workouts and physical activity."
        actionLabel="Log Workout"
        actionIcon={Plus}
        onAction={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="This Week" value={`${stats?.weekWorkouts || 0} workouts`} icon={Calendar} color="cyan" />
        <StatCard title="This Month" value={`${stats?.monthWorkouts || 0} workouts`} icon={TrendingUp} color="indigo" />
        <StatCard title="Avg Duration" value={formatDuration(stats?.avgDuration || 0)} icon={Clock} color="violet" />
        <StatCard title="Calories Burned" value={`${stats?.caloriesBurned || 0} kcal`} icon={Flame} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard title="Workout Frequency" subtitle="Last 14 days">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData.length ? freqData : [{date: 'No Data', count: 0}]}>
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Workout Duration" subtitle="Trend over last 30 days">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={durationData.length ? durationData : [{date: 'No Data', duration: 0}]}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDuration)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Workouts</h2>
        {workouts?.length === 0 ? (
          <EmptyState title="No workouts logged" description="Start tracking your fitness journey today." icon={Dumbbell} actionLabel="Log Workout" onAction={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts?.map((workout, index) => {
              const Icon = getWorkoutIcon(workout.type);
              return (
                <motion.div 
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{workout.type}</h3>
                        <p className="text-xs text-gray-500">{formatDate(workout.date)}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(workout.id)} className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDuration(workout.duration)}</p>
                    </div>
                    {workout.calories && (
                      <div>
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="font-medium text-amber-500">{workout.calories} kcal</p>
                      </div>
                    )}
                  </div>
                  
                  {workout.notes && <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{workout.notes}</p>}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Workout">
        <form onSubmit={handleAddWorkout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
            <select name="type" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required>
              <option value="Gym">Gym</option>
              <option value="Running">Running</option>
              <option value="Yoga">Yoga</option>
              <option value="Swimming">Swimming</option>
              <option value="Cycling">Cycling</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (min)</label>
              <input type="number" name="duration" min="1" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Calories (optional)</label>
              <input type="number" name="calories" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes (optional)</label>
            <textarea name="notes" rows="2" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"></textarea>
          </div>
          <Button type="submit" className="w-full">Save Workout</Button>
        </form>
      </Modal>

    </motion.div>
  );
}
