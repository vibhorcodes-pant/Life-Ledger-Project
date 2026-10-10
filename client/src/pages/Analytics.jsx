import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3, Lightbulb, Brain } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ChartCard from '../components/ChartCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useApi } from '../hooks/useApi';
import { clsx, formatCurrency } from '../utils/helpers';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const PERIODS = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
  { label: '1 Year', value: 365 }
];

export default function Analytics() {
  const [period, setPeriod] = useState(30);
  const { data: analytics, loading } = useApi(`/analytics?period=${period}`);

  if (loading && !analytics) return <LoadingSkeleton type="chart" count={4} />;

  // Generate mock data if API doesn't return full structure
  const mockProductivity = Array.from({ length: period }).map((_, i) => ({
    date: `Day ${i + 1}`,
    score: Math.floor(Math.random() * 40) + 60
  }));

  const mockStudy = Array.from({ length: period }).map((_, i) => ({
    date: `Day ${i + 1}`,
    minutes: Math.floor(Math.random() * 180) + 30
  }));

  const mockHabits = Array.from({ length: period }).map((_, i) => ({
    date: `Day ${i + 1}`,
    rate: Math.floor(Math.random() * 30) + 70
  }));

  const mockSleep = Array.from({ length: period }).map((_, i) => ({
    date: `Day ${i + 1}`,
    hours: (Math.random() * 3 + 5).toFixed(1)
  }));

  const correlations = analytics?.correlations || [
    "You tend to study 20% more on days you get over 7.5 hours of sleep.",
    "Your mood is generally higher on days you complete your workout.",
    "High spending days often correlate with lower productivity scores."
  ];

  const tooltipStyle = { backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <PageHeader 
        title="Analytics" 
        subtitle="Deep insights into your life data." 
        actionIcon={BarChart3}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={clsx(
              "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors",
              period === p.value 
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" 
                : "bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/10"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Productivity Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.productivity || mockProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <YAxis domain={[0, 100]} stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorProd)" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Study Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.study || mockStudy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <YAxis stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <RechartsTooltip contentStyle={tooltipStyle} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Habit Consistency">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.habits || mockHabits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <YAxis domain={[0, 100]} stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sleep Patterns">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.sleep || mockSleep} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <YAxis domain={[0, 12]} stroke="currentColor" className="text-gray-400" tick={{fontSize: 12}} />
              <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Goal: 7h', fill: '#f59e0b', fontSize: 12 }} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSleep)" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="text-indigo-500" /> AI Insights & Correlations
        </h3>
        <div className="space-y-4">
          {correlations.map((insight, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-black/20 p-4 rounded-xl flex gap-4 items-start">
              <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <p className="text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
