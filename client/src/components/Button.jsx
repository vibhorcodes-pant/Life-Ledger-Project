import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from '../utils/helpers';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className,
  disabled,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md focus:ring-indigo-500",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500 shadow-sm",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 focus:ring-slate-500",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-md focus:ring-rose-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={clsx("w-4 h-4", size === 'lg' && "w-5 h-5")} />}
      {children}
    </motion.button>
  );
}
