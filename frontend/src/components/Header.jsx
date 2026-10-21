import React from 'react';
import { Activity, Plus, RefreshCw, Calendar, Sparkles } from 'lucide-react';

export default function Header({ dashboard, loading, onRefresh, onOpenQuickLog }) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(dashboard?.date ? new Date(dashboard.date + 'T00:00:00') : new Date());

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#080c14]/85 border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/20 shadow-3d-card">
              <Activity className="w-5 h-5 text-teal-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                Life Ledger
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{todayFormatted}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 hover:border-white/25 transition shadow-3d-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 text-slate-950 font-semibold text-sm shadow-glow-teal hover:shadow-glow-teal hover:brightness-110 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Log</span>
          </button>
        </div>
      </div>
    </header>
  );
}
