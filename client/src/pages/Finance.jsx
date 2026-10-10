import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Plus, Edit2, Trash2, Utensils, Bus, ShoppingBag, GraduationCap, Tv, CreditCard, CircleDot } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { formatCurrency, formatDate, getCategoryColor, clsx } from '../utils/helpers';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const CATEGORY_ICONS = {
  Food: Utensils,
  Travel: Bus,
  Shopping: ShoppingBag,
  Education: GraduationCap,
  Entertainment: Tv,
  Subscriptions: CreditCard,
  Other: CircleDot
};

const CATEGORY_COLORS = {
  Food: '#f59e0b', // amber
  Travel: '#3b82f6', // blue
  Shopping: '#ec4899', // pink
  Education: '#6366f1', // indigo
  Entertainment: '#a855f7', // purple
  Subscriptions: '#06b6d4', // cyan
  Other: '#9ca3af' // gray
};

export default function Finance() {
  const { data: expenses, loading: expensesLoading, refetch: refetchExpenses } = useApi('/expenses');
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useApi('/expenses/stats');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });

  const stats = statsData || { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
  
  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date
      });
    } else {
      setEditingExpense(null);
      setFormData({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, formData);
      } else {
        await api.post('/expenses', formData);
      }
      setIsModalOpen(false);
      refetchExpenses();
      refetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        refetchExpenses();
        refetchStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Process data for charts
  const categoryData = useMemo(() => {
    if (!expenses) return [];
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const trendData = useMemo(() => {
    if (!expenses) return [];
    // Group by date for last 30 days
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  if (expensesLoading || statsLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <PageHeader 
        title="Finance" 
        subtitle="Track your expenses and budget" 
        actionLabel="Add Expense" 
        onAction={() => handleOpenModal()} 
        actionIcon={Plus} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today" value={formatCurrency(stats.today)} icon={Wallet} color="indigo" delay={0.1} />
        <StatCard title="This Week" value={formatCurrency(stats.thisWeek)} icon={Wallet} color="amber" delay={0.2} />
        <StatCard title="This Month" value={formatCurrency(stats.thisMonth)} icon={Wallet} color="emerald" delay={0.3} />
        <StatCard title="Avg Daily" value={formatCurrency(stats.thisMonth / 30)} icon={Wallet} color="cyan" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Spending Trend" className="lg:col-span-2">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tickFormatter={(val) => formatDate(val).split(' ')[0]} stroke="currentColor" className="text-gray-400" />
                <YAxis stroke="currentColor" className="text-gray-400" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
                  labelFormatter={(val) => formatDate(val)}
                  formatter={(val) => [formatCurrency(val), 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No trend data" description="Add expenses to see your spending trend" />
          )}
        </ChartCard>

        <ChartCard title="Category Breakdown">
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
                    formatter={(val) => formatCurrency(val)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((entry, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other }} />
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="No breakdown data" description="Add expenses to see breakdown" />
          )}
        </ChartCard>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Expenses</h3>
        {sortedExpenses.length > 0 ? (
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200/50 dark:divide-white/10">
              {sortedExpenses.map((expense) => {
                const Icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;
                return (
                  <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: `${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}20`, color: CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{expense.description || expense.category}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(expense.date)} • {expense.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(expense)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(expense.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No recent expenses" description="You haven't added any expenses yet." icon={Wallet} actionLabel="Add Expense" onAction={() => handleOpenModal()} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input 
                type="number" 
                required 
                min="0"
                step="0.01"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              {Object.keys(CATEGORY_ICONS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
            <input 
              type="text" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="E.g., Lunch at cafeteria"
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
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingExpense ? 'Save Changes' : 'Add Expense'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
