import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 overflow-x-hidden min-h-screen flex flex-col relative">
        <div className="absolute top-0 right-0 p-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-8 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key="page-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 md:p-6 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}
