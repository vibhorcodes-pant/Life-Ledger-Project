import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Plus, BookOpen, Clock, 
  Calendar as CalendarIcon, Target 
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
import { formatDuration, formatDate, clsx } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Study() {
  const { data: sessions, loading: sessionsLoading, refetch: refetchSessions } = useApi('/study/sessions');
  const { data: subjects, loading: subjectsLoading, refetch: refetchSubjects } = useApi('/study/subjects');
  const { data: stats, loading: statsLoading } = useApi('/study/stats');

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // focus, break, longBreak
  const [pomodoros, setPomodoros] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      console.log('Timer finished!'); // subtle notification
      if (timerMode === 'focus') {
        const newPomodoros = pomodoros + 1;
        setPomodoros(newPomodoros);
        if (newPomodoros % 4 === 0) {
          setTimerMode('longBreak');
          setTimeLeft(15 * 60);
        } else {
          setTimerMode('break');
          setTimeLeft(5 * 60);
        }
      } else {
        setTimerMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, pomodoros]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerMode === 'focus' ? 25 * 60 : timerMode === 'break' ? 5 * 60 : 15 * 60);
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.post('/study/sessions', data);
      setIsSessionModalOpen(false);
      refetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.post('/study/subjects', data);
      setIsSubjectModalOpen(false);
      refetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (sessionsLoading || subjectsLoading || statsLoading) return <LoadingSkeleton type="card" count={4} />;

  // Mock pie data if no real data
  const pieData = subjects?.length ? subjects.map(s => ({
    name: s.name,
    value: sessions?.filter(sess => sess.subjectId === s.id).reduce((acc, sess) => acc + sess.duration, 0) || 10,
    color: s.color
  })) : [{name: 'No data', value: 1, color: '#9ca3af'}];

  const totalTime = timerMode === 'focus' ? 25 * 60 : timerMode === 'break' ? 5 * 60 : 15 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader 
        title="Study" 
        subtitle="Track your focus sessions and academic progress."
        actionLabel="Add Session"
        actionIcon={Plus}
        onAction={() => setIsSessionModalOpen(true)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Today" value={formatDuration(stats?.todayMinutes || 0)} icon={Clock} color="indigo" />
        <StatCard title="This Week" value={formatDuration(stats?.weekMinutes || 0)} icon={CalendarIcon} color="cyan" />
        <StatCard title="This Month" value={formatDuration(stats?.monthMinutes || 0)} icon={BookOpen} color="violet" />
        <StatCard title="Streak" value={`${stats?.streak || 0} days`} icon={Target} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-1 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white capitalize">{timerMode.replace(/([A-Z])/g, ' $1')}</h2>
          <p className="text-gray-500 mb-8">Completed: {pomodoros}</p>
          
          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-white/5" />
              <circle 
                cx="128" cy="128" r={radius} 
                stroke="currentColor" strokeWidth="8" fill="transparent" 
                className={timerMode === 'focus' ? 'text-indigo-500' : 'text-emerald-500'}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute text-5xl font-bold font-mono text-gray-900 dark:text-white">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={toggleTimer} size="lg" className={`w-16 h-16 rounded-full flex items-center justify-center p-0 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isActive ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} className="ml-1" />}
            </Button>
            <Button onClick={resetTimer} variant="secondary" size="lg" className="w-16 h-16 rounded-full flex items-center justify-center p-0">
              <RotateCcw size={24} />
            </Button>
          </div>
        </div>

        {/* Charts and Lists */}
        <div className="lg:col-span-2 space-y-8">
          <ChartCard title="Subject Distribution" subtitle="Time spent per subject">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Sessions</h2>
            </div>
            {sessions?.length === 0 ? (
              <EmptyState title="No sessions" description="Start a timer or log a session manually." icon={BookOpen} />
            ) : (
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
                    {sessions?.slice(0, 5).map(session => {
                      const subject = subjects?.find(s => s.id == session.subjectId);
                      return (
                        <tr key={session.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatDate(session.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: subject?.color || '#9ca3af' }}>
                              {subject?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDuration(session.duration)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title="Log Study Session">
        <form onSubmit={handleAddSession} className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <button type="button" onClick={() => setIsSubjectModalOpen(true)} className="text-xs text-indigo-500 hover:text-indigo-600">+ New Subject</button>
            </div>
            <select name="subjectId" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required>
              {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (minutes)</label>
            <input type="number" name="duration" min="1" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
            <textarea name="notes" rows="2" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"></textarea>
          </div>
          <Button type="submit" className="w-full">Save Session</Button>
        </form>
      </Modal>

      <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="New Subject">
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject Name</label>
            <input type="text" name="name" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Color</label>
            <input type="color" name="color" defaultValue="#6366f1" className="w-full h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 cursor-pointer" />
          </div>
          <Button type="submit" className="w-full">Create Subject</Button>
        </form>
      </Modal>

    </motion.div>
  );
}
