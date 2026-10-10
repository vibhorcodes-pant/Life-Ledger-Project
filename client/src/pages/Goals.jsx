import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Clock, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import GoalCard from '../components/GoalCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { clsx } from '../utils/helpers';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Goals() {
  const { data: goals, loading, refetch } = useApi('/goals');
  
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const defaultFormData = {
    title: '',
    description: '',
    category: 'personal',
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    priority: 'medium',
    status: 'active'
  };
  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description || '',
        category: goal.category,
        deadline: goal.deadline || '',
        priority: goal.priority,
        status: goal.status
      });
    } else {
      setEditingGoal(null);
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, { ...editingGoal, ...formData });
      } else {
        await api.post('/goals', formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredGoals = useMemo(() => {
    if (!goals) return [];
    if (filter === 'Active') return goals.filter(g => g.status === 'active');
    if (filter === 'Completed') return goals.filter(g => g.status === 'completed');
    if (filter === 'High Priority') return goals.filter(g => g.priority === 'high');
    return goals;
  }, [goals, filter]);

  const stats = useMemo(() => {
    if (!goals) return { total: 0, active: 0, completed: 0, avgProgress: 0 };
    const total = goals.length;
    const active = goals.filter(g => g.status === 'active').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const avgProgress = total > 0 ? goals.reduce((acc, g) => acc + g.progress, 0) / total : 0;
    return { total, active, completed, avgProgress };
  }, [goals]);

  const avgProgressCounter = useAnimatedCounter(stats.avgProgress, 1000);

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <PageHeader 
        title="Goals" 
        subtitle="Set and track your long-term objectives" 
        actionLabel="New Goal" 
        onAction={() => handleOpenModal()} 
        actionIcon={Plus} 
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Active', 'Completed', 'High Priority'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors",
              filter === f 
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" 
                : "bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Goals</div>
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active</div>
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-500">{stats.completed}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Completed</div>
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-500">{Math.round(avgProgressCounter)}%</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Avg Progress</div>
        </div>
      </div>

      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredGoals.map((goal, i) => (
              <motion.div key={goal.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                <GoalCard 
                  goal={goal} 
                  onUpdate={() => handleOpenModal(goal)} 
                  onDelete={() => handleDelete(goal.id)} 
                  delay={i * 0.1} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState 
          title={`No ${filter !== 'All' ? filter.toLowerCase() : ''} goals found`} 
          description="Create a new goal to start tracking your progress." 
          icon={Target} 
          actionLabel="New Goal" 
          onAction={() => handleOpenModal()} 
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGoal ? 'Edit Goal' : 'New Goal'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="E.g., Learn React Native"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              rows={3}
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              placeholder="What exactly do you want to achieve?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option value="academic">Academic</option>
                <option value="fitness">Fitness</option>
                <option value="finance">Finance</option>
                <option value="personal">Personal</option>
                <option value="career">Career</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
              <input 
                type="date" 
                value={formData.deadline} 
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            {editingGoal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingGoal ? 'Save Changes' : 'Create Goal'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
