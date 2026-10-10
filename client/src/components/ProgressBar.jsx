import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from '../utils/helpers';

export default function ProgressBar({ 
  value, 
  max = 100, 
  color = 'bg-indigo-500', 
  height = 'h-2',
  showLabel = false,
  label
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full flex flex-col gap-1.5">
      {showLabel && label && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-600 dark:text-slate-300">{label}</span>
          <span className="text-slate-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx("w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className={clsx("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
