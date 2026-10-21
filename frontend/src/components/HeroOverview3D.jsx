import React, { useState } from 'react';
import { Flame, Footprints, Clock, Zap, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { updateSteps } from '../services/api';

export default function HeroOverview3D({ dashboard, onUpdate }) {
  const [editingSteps, setEditingSteps] = useState(false);
  const [stepInput, setStepInput] = useState(dashboard?.steps || 0);

  const score = dashboard?.wellnessScore || 0;
  const steps = dashboard?.steps || 0;
  const stepsTarget = dashboard?.stepsTarget || 10000;
  const stepPercent = Math.min(100, Math.round((steps / stepsTarget) * 100));

  const calBurned = dashboard?.caloriesBurned || 0;
  const calBurnTarget = dashboard?.caloriesBurnedTarget || 500;
  const burnPercent = Math.min(100, Math.round((calBurned / calBurnTarget) * 100));

  const activeMins = dashboard?.activeMinutes || 0;
  const calConsumed = dashboard?.caloriesConsumed || 0;

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleSaveSteps = async (e) => {
    e.preventDefault();
    try {
      await updateSteps(parseInt(stepInput, 10));
      setEditingSteps(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const getTier = (s) => {
    if (s >= 85) return { label: 'Optimal Flow', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (s >= 70) return { label: 'On Track', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' };
    return { label: 'Needs Focus', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
  };

  const tier = getTier(score);

  return (
    <div className="perspective-1000">
      <div className="glass-card rounded-3xl p-6 sm:p-8 preserve-3d transition-transform duration-500 hover:rotate-x-1">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-teal-500/15 blur-xl animate-pulse"></div>
              
              <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  stroke="url(#scoreGradient)"
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="50%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white">{score}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
                  {tier.label}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Top 12% Consistency
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Daily Wellness Score
              </h2>
              <p className="text-sm text-slate-400 max-w-md mt-1">
                Real-time composite metric aggregating step milestones, sleep recuperation, active burn, and habit adherence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
            
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-3d-sm relative overflow-hidden group hover:border-teal-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Steps</span>
                <Footprints className="w-4 h-4 text-teal-400" />
              </div>
              {editingSteps ? (
                <form onSubmit={handleSaveSteps} className="flex items-center gap-1">
                  <input
                    type="number"
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    className="w-20 bg-slate-800 text-xs px-2 py-1 rounded border border-teal-500 text-white"
                    autoFocus
                  />
                  <button type="submit" className="text-teal-400 text-xs hover:text-teal-300">Save</button>
                </form>
              ) : (
                <div onClick={() => { setStepInput(steps); setEditingSteps(true); }} className="cursor-pointer" title="Click to edit steps">
                  <div className="text-xl font-bold text-white">{steps.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{stepPercent}% of {stepsTarget.toLocaleString()}</div>
                </div>
              )}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700" style={{ width: `${stepPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-3d-sm relative overflow-hidden group hover:border-rose-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Calorie Burn</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-white">{calBurned} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              <div className="text-[11px] text-slate-400 mt-0.5">{burnPercent}% of {calBurnTarget} kcal</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-rose-500 h-full rounded-full transition-all duration-700" style={{ width: `${burnPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-3d-sm relative overflow-hidden group hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Active Time</span>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">{activeMins} <span className="text-xs font-normal text-slate-400">min</span></div>
              <div className="text-[11px] text-slate-400 mt-0.5">Target: 45 min</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.round((activeMins / 45) * 100))}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-3d-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Net Energy</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {calConsumed - calBurned > 0 ? `+${calConsumed - calBurned}` : `${calConsumed - calBurned}`}
                <span className="text-xs font-normal text-slate-400"> kcal</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Intake: {calConsumed} kcal</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.round((calConsumed / 2200) * 100))}%` }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
