import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Dumbbell, Wallet, Smile, Award, FileText, Plus 
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { formatTime, formatDate, getCategoryColor, clsx } from '../utils/helpers';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Button from '../components/Button';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'study': return BookOpen;
    case 'workout': return Dumbbell;
    case 'expense': return Wallet;
    case 'mood': return Smile;
    case 'achievement': return Award;
    default: return FileText;
  }
};

export default function LifeLedger() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: entries, loading, error, refetch } = useApi(`/life-entries?filter=${timeFilter}&category=${categoryFilter}`);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await api.post('/life-entries', data);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to add entry', err);
    }
  };

  // Group entries by date
  const groupedEntries = entries?.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {}) || {};

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-5xl mx-auto"
    >
      <PageHeader 
        title="Life Ledger" 
        subtitle="Your timeline of activities, thoughts, and progress."
        actionLabel="Add Entry"
        actionIcon={Plus}
        onAction={() => setIsAddModalOpen(true)}
      />

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg w-max">
          {['today', 'week', 'month'].map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={clsx(
                "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors",
                timeFilter === f 
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'study', 'workout', 'expense', 'mood', 'achievement', 'personal'].map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors border",
                categoryFilter === c 
                  ? "bg-indigo-500 text-white border-indigo-500" 
                  : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : error ? (
        <div className="text-rose-500 p-4 bg-rose-500/10 rounded-xl">Failed to load entries.</div>
      ) : Object.keys(groupedEntries).length === 0 ? (
        <EmptyState 
          title="No entries found" 
          description="Try changing your filters or add a new entry to get started."
          icon={FileText}
          actionLabel="Add Entry"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 -translate-x-1/2"></div>
          
          {Object.entries(groupedEntries).sort((a,b) => new Date(b[0]) - new Date(a[0])).map(([date, dayEntries], dayIndex) => (
            <div key={date} className="mb-12 relative">
              <div className="flex justify-center mb-6 relative z-10">
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700">
                  {formatDate(date)}
                </span>
              </div>
              
              <div className="space-y-8">
                {dayEntries.sort((a,b) => (b.time||'').localeCompare(a.time||'')).map((entry, index) => {
                  const Icon = getCategoryIcon(entry.category);
                  const colorStr = getCategoryColor(entry.category);
                  const isEven = index % 2 === 0;

                  return (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={clsx(
                        "flex items-center w-full",
                        isEven ? "md:flex-row-reverse" : "md:flex-row",
                        "flex-row-reverse" // mobile defaults to one side (right side text, left side line)
                      )}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 bg-white flex items-center justify-center -translate-x-1/2 z-10 shadow-sm" style={{ backgroundColor: `var(--color-${colorStr}-500)` }}>
                         <Icon size={14} className="text-white" />
                      </div>

                      {/* Content Card */}
                      <div className={clsx(
                        "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)]",
                        isEven ? "md:pr-8 pl-12 md:pl-0" : "md:pl-8 pl-12 md:pr-0"
                      )}>
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-5 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{entry.title}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatTime(entry.time || '12:00:00')}</span>
                          </div>
                          {entry.description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{entry.description}</p>}
                          
                          {(entry.duration || entry.value || entry.mood) && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                              {entry.duration && <span className="text-xs bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">{entry.duration} min</span>}
                              {entry.value && <span className="text-xs bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">{entry.value}</span>}
                              {entry.mood && <span className="text-xs bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">Mood: {entry.mood}/5</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Life Entry">
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
            <select name="category" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
              <option value="workout">Workout</option>
              <option value="expense">Expense</option>
              <option value="mood">Mood</option>
              <option value="achievement">Achievement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" name="title" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea name="description" rows="3" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"></textarea>
          </div>
          <Button type="submit" className="w-full">Save Entry</Button>
        </form>
      </Modal>
    </motion.div>
  );
}
