import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import { clsx } from '../utils/helpers';

export default function HabitCard({ habit, onToggle }) {
  const isCompleted = habit.completed;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={clsx(
        "glass p-4 flex items-center justify-between transition-colors",
        isCompleted && "bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/20"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{habit.icon || '🔥'}</div>
        <div>
          <h4 className={clsx(
            "font-medium transition-colors",
            isCompleted ? "text-indigo-900 dark:text-indigo-100" : "text-slate-900 dark:text-white"
          )}>
            {habit.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {habit.streak} day streak
            </span>
          </div>
        </div>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(habit.id)}
        className={clsx(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
          isCompleted 
            ? "bg-indigo-500 border-indigo-500 text-white" 
            : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
        )}
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
