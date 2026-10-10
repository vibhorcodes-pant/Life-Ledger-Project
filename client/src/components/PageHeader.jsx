import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </motion.div>
  );
}
