import React from 'react';
import { Flame, Clock, Trash2, Dumbbell, Compass, HeartPulse } from 'lucide-react';
import { deleteActivity } from '../services/api';

export default function ActivityLog({ activities, onUpdate, onAddActivityClick }) {
  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const getIntensityBadge = (intensity) => {
    switch (intensity?.toUpperCase()) {
      case 'HIGH':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'LOW':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Exercise &amp; Movement</h3>
              <p className="text-xs text-slate-400">Workouts &amp; active calorie burns</p>
            </div>
          </div>
          <button
            onClick={onAddActivityClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition shadow-3d-sm"
          >
            + Log Workout
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {(!activities || activities.length === 0) ? (
            <div className="text-xs text-slate-500 italic py-4 text-center">No workouts recorded today yet</div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 transition group shadow-3d-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-white/10">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>{act.title}</span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getIntensityBadge(act.intensity)}`}>
                        {act.intensity || 'MODERATE'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {act.durationMinutes} min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-rose-300 font-medium">
                        <Flame className="w-3 h-3 text-rose-400" />
                        {act.caloriesBurned} kcal
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(act.id)}
                  title="Delete workout"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Total Sessions</span>
        <span className="font-semibold text-rose-300">{(activities || []).length} Logged Today</span>
      </div>
    </div>
  );
}
