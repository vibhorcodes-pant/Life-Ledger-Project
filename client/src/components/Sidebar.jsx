import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Flame, 
  BookOpen, 
  Dumbbell, 
  Wallet, 
  Smile, 
  Target, 
  BarChart3, 
  Settings, 
  User,
  Sparkles,
  Heart
} from 'lucide-react';
import { clsx } from '../utils/helpers';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/wellness', label: 'Wellness Hub', icon: Heart },
  { path: '/life-ledger', label: 'Life Ledger', icon: FileText },
  { path: '/habits', label: 'Habits', icon: Flame },
  { path: '/study', label: 'Study', icon: BookOpen },
  { path: '/fitness', label: 'Fitness', icon: Dumbbell },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/mood', label: 'Mood', icon: Smile },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 glass rounded-none border-t-0 border-l-0 border-b-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Life Ledger
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group',
              isActive 
                ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-medium' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={clsx("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              isActive 
                ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-medium' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
