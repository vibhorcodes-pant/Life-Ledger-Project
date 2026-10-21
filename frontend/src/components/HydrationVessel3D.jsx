import React, { useState } from 'react';
import { Droplets, Plus, Check } from 'lucide-react';
import { quickAddWater } from '../services/api';

export default function HydrationVessel3D({ dashboard, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [recentAdd, setRecentAdd] = useState(null);

  const consumed = dashboard?.waterConsumedMl || 0;
  const target = dashboard?.waterTargetMl || 2500;
  const percentage = Math.min(100, Math.round((consumed / target) * 100));

  const handleQuickAdd = async (amount) => {
    if (adding) return;
    setAdding(true);
    setRecentAdd(amount);
    try {
      await quickAddWater(amount);
      onUpdate();
      setTimeout(() => setRecentAdd(null), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplets className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Hydration Vessel</h3>
            <p className="text-xs text-slate-400">Goal: {(target / 1000).toFixed(1)}L / day</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          {percentage}% Met
        </span>
      </div>

      <div className="flex items-center justify-around my-3 gap-6">
        <div className="relative w-28 h-48 rounded-2xl p-1 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/20 shadow-3d-card flex flex-col justify-end overflow-hidden">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full bg-white/10 border border-white/20 z-10"></div>
          
          <div
            className="w-full bg-gradient-to-t from-cyan-600 via-teal-400 to-sky-300 rounded-b-xl relative transition-all duration-700 ease-out shadow-glow-teal"
            style={{ height: `${percentage}%` }}
          >
            <div className="absolute -top-3 left-0 right-0 h-4 bg-sky-200/40 rounded-full blur-[1px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 text-[9px] text-slate-500 font-mono">
            <div className="border-b border-white/10 pb-0.5">2500ml</div>
            <div className="border-b border-white/10 pb-0.5">1875ml</div>
            <div className="border-b border-white/10 pb-0.5">1250ml</div>
            <div className="border-b border-white/10 pb-0.5">625ml</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-right">
            <div className="text-3xl font-black text-white tracking-tight">
              {consumed} <span className="text-sm font-normal text-slate-400">ml</span>
            </div>
            <div className="text-xs text-slate-400">
              {target - consumed > 0 ? `${target - consumed} ml remaining` : 'Daily target achieved!'}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <button
              onClick={() => handleQuickAdd(250)}
              disabled={adding}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-xs font-medium transition shadow-3d-sm active:scale-95"
            >
              <span>+250ml (Cup)</span>
              {recentAdd === 250 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleQuickAdd(500)}
              disabled={adding}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-xs font-medium transition shadow-3d-sm active:scale-95"
            >
              <span>+500ml (Bottle)</span>
              {recentAdd === 500 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleQuickAdd(750)}
              disabled={adding}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-xs font-medium transition shadow-3d-sm active:scale-95"
            >
              <span>+750ml (Flask)</span>
              {recentAdd === 750 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
