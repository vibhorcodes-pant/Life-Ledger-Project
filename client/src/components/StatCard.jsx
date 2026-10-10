import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from '../utils/helpers';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-indigo-500", 
  iconBg = "bg-indigo-500/10",
  trend, 
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="glass p-5 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className={clsx("p-3 rounded-2xl", iconBg)}>
          <Icon className={clsx("w-6 h-6", iconColor)} />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
              : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
          )}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
