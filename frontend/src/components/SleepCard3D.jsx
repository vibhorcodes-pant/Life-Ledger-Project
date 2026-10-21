import React from 'react';
import { Moon, Bed, Sunrise, ShieldCheck } from 'lucide-react';

export default function SleepCard3D({ dashboard }) {
  const sleepLog = dashboard?.sleepLog;
  const hours = dashboard?.sleepHours || 7.5;
  const quality = dashboard?.sleepQuality || 'GOOD';
  const score = dashboard?.sleepScore || 82;
  const deepSleepMinutes = sleepLog?.deepSleepMinutes || 110;
  const totalMinutes = sleepLog?.durationMinutes || (hours * 60);
  const deepPercentage = Math.round((deepSleepMinutes / totalMinutes) * 100);

  const getQualityColor = (q) => {
    switch (q) {
      case 'EXCELLENT': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'GOOD': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'FAIR': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Sleep Architecture</h3>
              <p className="text-xs text-slate-400">Circadian rhythm &amp; recovery</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getQualityColor(quality)}`}>
            {quality}
          </span>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 mb-4 shadow-3d-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Duration</span>
              <div className="text-2xl font-black text-white tracking-tight mt-0.5">
                {hours} <span className="text-sm font-normal text-slate-400">hours</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Rest Score</span>
              <div className="text-2xl font-black text-indigo-400 tracking-tight mt-0.5">
                {score}<span className="text-sm text-slate-500 font-normal">/100</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Deep Sleep: {deepSleepMinutes}m ({deepPercentage}%)</span>
              <span>Light/REM: {Math.max(0, totalMinutes - deepSleepMinutes)}m</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${deepPercentage}%` }}></div>
              <div className="bg-sky-400/60 h-full" style={{ width: `${100 - deepPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <Bed className="w-4 h-4 text-indigo-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Bedtime</div>
            <div className="font-semibold text-slate-200">
              {sleepLog?.bedTime ? sleepLog.bedTime.substring(0, 5) : '23:15'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Wake-up</div>
            <div className="font-semibold text-slate-200">
              {sleepLog?.wakeTime ? sleepLog.wakeTime.substring(0, 5) : '07:00'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
