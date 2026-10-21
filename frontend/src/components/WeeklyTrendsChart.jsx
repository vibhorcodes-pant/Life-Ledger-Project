import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export default function WeeklyTrendsChart({ weeklyTrends }) {
  const [activeMetric, setActiveMetric] = useState('score');
  const trends = weeklyTrends || [];

  const getMetricData = (item) => {
    switch (activeMetric) {
      case 'steps':
        return { val: item.steps, max: 12000, suffix: ' steps', color: 'from-teal-400 to-cyan-500' };
      case 'water':
        return { val: item.waterMl, max: 3000, suffix: ' ml', color: 'from-cyan-400 to-blue-500' };
      case 'sleep':
        return { val: item.sleepHours, max: 9, suffix: ' hrs', color: 'from-indigo-400 to-purple-500' };
      default:
        return { val: item.wellnessScore, max: 100, suffix: ' score', color: 'from-teal-400 via-indigo-500 to-purple-500' };
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Weekly Momentum &amp; Trends</h3>
            <p className="text-xs text-slate-400">7-day longitudinal wellness trajectory</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-white/10 shadow-3d-sm text-xs">
          <button
            onClick={() => setActiveMetric('score')}
            className={`px-3 py-1.5 rounded-xl transition font-medium ${
              activeMetric === 'score' ? 'bg-teal-500 text-slate-950 font-bold shadow-glow-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            Score
          </button>
          <button
            onClick={() => setActiveMetric('steps')}
            className={`px-3 py-1.5 rounded-xl transition font-medium ${
              activeMetric === 'steps' ? 'bg-teal-500 text-slate-950 font-bold shadow-glow-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            Steps
          </button>
          <button
            onClick={() => setActiveMetric('water')}
            className={`px-3 py-1.5 rounded-xl transition font-medium ${
              activeMetric === 'water' ? 'bg-teal-500 text-slate-950 font-bold shadow-glow-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            Water
          </button>
          <button
            onClick={() => setActiveMetric('sleep')}
            className={`px-3 py-1.5 rounded-xl transition font-medium ${
              activeMetric === 'sleep' ? 'bg-teal-500 text-slate-950 font-bold shadow-glow-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sleep
          </button>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {trends.map((item, idx) => {
          const { val, max, suffix, color } = getMetricData(item);
          const heightPercent = Math.min(100, Math.max(12, Math.round((val / max) * 100)));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition duration-200">
                {val}{suffix}
              </div>
              <div className="w-full bg-slate-800/80 rounded-t-xl h-full flex flex-col justify-end p-0.5 overflow-hidden">
                <div
                  className={`w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-700 ease-out group-hover:brightness-125 shadow-3d-sm`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              <div className="text-xs font-semibold text-slate-400 group-hover:text-teal-300 transition">
                {item.dayOfWeek}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
