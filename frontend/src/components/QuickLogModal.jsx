import React, { useState } from 'react';
import { X, Droplets, Utensils, Dumbbell, Moon, Check } from 'lucide-react';
import { quickAddWater, logMeal, logActivity, recordSleep } from '../services/api';

export default function QuickLogModal({ isOpen, onClose, initialTab = 'water', onUpdate }) {
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const [waterAmount, setWaterAmount] = useState(250);

  const [mealType, setMealType] = useState('LUNCH');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutType, setWorkoutType] = useState('RUNNING');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('MODERATE');

  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepDurationHours, setSleepDurationHours] = useState('8.0');
  const [sleepQuality, setSleepQuality] = useState('GOOD');

  if (!isOpen) return null;

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await quickAddWater(parseInt(waterAmount, 10));
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    if (!foodName.trim() || !calories) return;
    setLoading(true);
    try {
      await logMeal({
        mealType,
        foodName: foodName.trim(),
        calories: parseInt(calories, 10),
        proteinGrams: protein ? parseFloat(protein) : 0,
        carbsGrams: carbs ? parseFloat(carbs) : 0,
        fatGrams: fat ? parseFloat(fat) : 0
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    if (!workoutTitle.trim() || !duration) return;
    setLoading(true);
    try {
      await logActivity({
        title: workoutTitle.trim(),
        type: workoutType,
        durationMinutes: parseInt(duration, 10),
        intensity
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const durationMins = Math.round(parseFloat(sleepDurationHours) * 60);
      await recordSleep({
        bedTime,
        wakeTime,
        durationMinutes: durationMins,
        quality: sleepQuality
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-3d-card">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-extrabold text-white tracking-tight">Quick Wellness Logger</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-2xl bg-slate-800/80 border border-white/5">
          <button
            onClick={() => setTab('water')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'water' ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water</span>
          </button>
          <button
            onClick={() => setTab('meal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'meal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Meal</span>
          </button>
          <button
            onClick={() => setTab('workout')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'workout' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Workout</span>
          </button>
          <button
            onClick={() => setTab('sleep')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'sleep' ? 'bg-indigo-500 text-white font-bold shadow-glow-violet' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Sleep</span>
          </button>
        </div>

        <div className="mt-6">
          {tab === 'water' && (
            <form onSubmit={handleWaterSubmit} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">Select Amount to Add</label>
              <div className="grid grid-cols-4 gap-2">
                {[250, 500, 750, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWaterAmount(amt)}
                    className={`py-3 rounded-xl border text-xs font-bold transition ${
                      waterAmount === amt
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-teal'
                        : 'bg-slate-800/80 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    {amt} ml
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Custom Volume (ml)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(e.target.value)}
                  className="w-full bg-slate-800 text-sm px-3.5 py-2.5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold text-sm shadow-glow-teal active:scale-98 transition disabled:opacity-50"
              >
                {loading ? 'Logging...' : `Log ${waterAmount}ml Water`}
              </button>
            </form>
          )}

          {tab === 'meal' && (
            <form onSubmit={handleMealSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-slate-200"
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 520"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Food / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken & Sweet Potato"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-teal-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 35"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-amber-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 45"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-rose-400 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 14"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-sm shadow-3d-sm active:scale-98 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Record Meal'}
              </button>
            </form>
          )}

          {tab === 'workout' && (
            <form onSubmit={handleWorkoutSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Workout Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening HIIT Run, Leg Day Gym Session"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2.5 rounded-xl border border-white/10 text-slate-200"
                  >
                    <option value="RUNNING">Running</option>
                    <option value="CYCLING">Cycling</option>
                    <option value="SWIMMING">Swimming</option>
                    <option value="GYM">Gym</option>
                    <option value="YOGA">Yoga</option>
                    <option value="WALKING">Walking</option>
                    <option value="MEDITATION">Meditation</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2.5 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Intensity</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-2.5 py-2.5 rounded-xl border border-white/10 text-slate-200"
                  >
                    <option value="LOW">Low</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-3d-sm active:scale-98 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Record Workout'}
              </button>
            </form>
          )}

          {tab === 'sleep' && (
            <form onSubmit={handleSleepSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Total Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="16"
                    value={sleepDurationHours}
                    onChange={(e) => setSleepDurationHours(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Quality Perception</label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-white/10 text-slate-200"
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-sm shadow-glow-violet active:scale-98 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Sleep Log'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
