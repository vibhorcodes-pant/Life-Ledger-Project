import React, { useState } from 'react';
import { Flame, Check, Plus, Sparkles, Brain, Footprints, Droplets, Moon, BookOpen, Activity } from 'lucide-react';
import { toggleHabit, createHabit } from '../services/api';

const ICON_MAP = {
  brain: Brain,
  footprints: Footprints,
  droplets: Droplets,
  moon: Moon,
  'book-open': BookOpen,
  activity: Activity,
  star: Sparkles
};

export default function HabitMatrix({ habits, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newCategory, setNewCategory] = useState('BODY');

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    try {
      await createHabit({
        name: newHabitName.trim(),
        category: newCategory,
        targetDaysPerWeek: 7,
        icon: 'star'
      });
      setNewHabitName('');
      setShowAdd(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = (habits || []).filter(h => h.completedToday).length;
  const totalCount = (habits || []).length;
  const completionPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Habit Matrix &amp; Streaks</h3>
              <p className="text-xs text-slate-400">{completedCount} of {totalCount} completed today ({completionPct}%)</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/30 transition shadow-3d-sm"
          >
            {showAdd ? 'Cancel' : '+ New Habit'}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleCreate} className="mb-4 p-3.5 rounded-2xl bg-slate-900/90 border border-violet-500/30 shadow-3d-sm flex flex-col gap-2.5">
            <input
              type="text"
              placeholder="Habit title (e.g. Read 20 mins, Cold shower)..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="bg-slate-800 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-violet-400"
              required
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-slate-800 text-xs px-2.5 py-1.5 rounded-xl border border-white/10 text-slate-300"
              >
                <option value="MIND">Mind</option>
                <option value="BODY">Body</option>
                <option value="NUTRITION">Nutrition</option>
                <option value="SLEEP">Sleep</option>
                <option value="FOCUS">Focus</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold shadow-3d-sm"
              >
                Save Habit
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {(!habits || habits.length === 0) ? (
            <div className="text-xs text-slate-500 italic py-3 text-center">No habits added yet</div>
          ) : (
            habits.map((habit) => {
              const IconComponent = ICON_MAP[habit.icon] || Sparkles;
              return (
                <div
                  key={habit.id}
                  onClick={() => handleToggle(habit.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group select-none shadow-3d-sm ${
                    habit.completedToday
                      ? 'bg-violet-950/20 border-violet-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        habit.completedToday
                          ? 'bg-gradient-to-tr from-violet-500 to-indigo-500 text-white shadow-glow-violet'
                          : 'border border-white/20 text-transparent group-hover:border-violet-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold transition ${habit.completedToday ? 'text-white line-through opacity-85' : 'text-slate-200'}`}>
                        {habit.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {habit.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-white/5">
                    <Flame className={`w-3.5 h-3.5 ${habit.currentStreak > 0 ? 'text-orange-400 fill-orange-400 animate-pulse' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-200">{habit.currentStreak}d</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Completion Consistency</span>
        <span className="font-semibold text-violet-300">{completedCount}/{totalCount} Active Today</span>
      </div>
    </div>
  );
}
