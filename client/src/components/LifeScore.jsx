import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import ProgressBar from './ProgressBar';

export default function LifeScore({ score = 85, breakdown = [] }) {
  const animatedScore = useAnimatedCounter(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-6 flex flex-col items-center justify-center w-full"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="12"
            fill="none"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-indigo-500"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="text-center z-10 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            {animatedScore}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">
            Life Score
          </span>
        </div>
      </div>
      
      {breakdown.length > 0 && (
        <div className="w-full mt-6 space-y-3">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-500">{item.value}%</span>
              </div>
              <ProgressBar value={item.value} max={100} color={item.color} height="h-2" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
