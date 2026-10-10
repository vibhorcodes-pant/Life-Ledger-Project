import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from '../utils/helpers';

export default function QuickAction({ icon: Icon, label, onClick, colorClass = "bg-indigo-500 text-white" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="glass p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/90 dark:hover:bg-white/10 transition-colors w-full aspect-square"
    >
      <div className={clsx("p-3 rounded-full flex items-center justify-center", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
    </motion.button>
  );
}
