import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Flame, BookOpen, Wallet, Menu } from 'lucide-react';
import { clsx } from '../utils/helpers';
import { motion } from 'framer-motion';

const mainItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/habits', icon: Flame, label: 'Habits' },
  { path: '/study', icon: BookOpen, label: 'Study' },
  { path: '/finance', icon: Wallet, label: 'Finance' },
];

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="glass rounded-none border-b-0 border-l-0 border-r-0 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex flex-col items-center justify-center w-16 h-14 rounded-xl relative transition-colors",
                isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={clsx("w-6 h-6 z-10 transition-transform", isActive && "scale-110 mb-1")} />
                  {isActive && <span className="text-[10px] font-medium z-10">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
          <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
