import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { clsx, formatDate, getCategoryColor } from '../utils/helpers';

export default function GoalCard({ goal, delay = 0 }) {
  const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const categoryColor = getCategoryColor(goal.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass p-5 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <div className={clsx("p-2.5 rounded-xl bg-opacity-10 dark:bg-opacity-20", categoryColor, categoryColor.replace('bg-', 'text-'))}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{goal.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 capitalize">
                {goal.category}
              </span>
              {goal.priority === 'high' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  High
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {goal.current} <span className="text-slate-400">/ {goal.target} {goal.unit}</span>
          </span>
          <span className="font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} max={100} color={categoryColor} />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
        <Calendar className="w-3.5 h-3.5" />
        <span>Due {formatDate(goal.deadline)}</span>
      </div>
    </motion.div>
  );
}
