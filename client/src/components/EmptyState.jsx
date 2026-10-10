import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { clsx } from '../utils/helpers';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className
}) {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-8 text-center", className)}>
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-20 h-20 mb-6 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500/50 dark:text-indigo-400/50"
      >
        <Icon className="w-10 h-10" />
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={Icon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
