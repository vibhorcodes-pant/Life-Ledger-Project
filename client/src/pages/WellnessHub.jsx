import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Droplets, Footprints, Moon, Dumbbell, Utensils, 
  CheckCircle, Plus, Trash2, Save, RefreshCw, AlertCircle, 
  Info, ShieldCheck, Heart, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import wellnessApi from '../services/wellnessApi';

export default function WellnessHub() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  
  // Entry Form State
  const [waterMl, setWaterMl] = useState(2000);
  const [steps, setSteps] = useState(8000);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [notes, setNotes] = useState('');
  const [foodItems, setFoodItems] = useState([
    { name: 'Oatmeal & Fruit', calories: 350, proteinGrams: 10, carbsGrams: 60, fatGrams: 5 },
    { name: 'Chicken Bowl', calories: 550, proteinGrams: 40, carbsGrams: 45, fatGrams: 12 }
  ]);
  const [habits, setHabits] = useState([
    { name: 'Morning Meditation (10 min)', completed: true },
    { name: 'Drink 2.5L Water', completed: false },
    { name: '30 min Physical Exercise', completed: true },
    { name: 'No Screen Before Bed', completed: false }
  ]);

  // Sensor step counter experimental state
  const [isSensorActive, setIsSensorActive] = useState(false);

  // All entries history
  const [entriesHistory, setEntriesHistory] = useState([]);

  // Check backend health on mount
  useEffect(() => {
    checkHealth();
    loadHistory();
  }, []);

  // Fetch entry whenever selected date changes
  useEffect(() => {
    fetchDateEntry(selectedDate);
  }, [selectedDate]);

  const checkHealth = async () => {
    try {
      const res = await wellnessApi.checkHealth();
      if (res && res.success) {
        setBackendStatus({ connected: true, message: 'Spring Boot 3.3 Connected (H2/JPA)' });
      } else {
        setBackendStatus({ connected: false, message: 'Backend Offline (Using Local Fallback)' });
      }
    } catch {
      setBackendStatus({ connected: false, message: 'Backend Offline (Check port 8080)' });
    }
  };

  const loadHistory = async () => {
    try {
      const res = await wellnessApi.getAllEntries();
      if (res && res.success) {
        setEntriesHistory(res.data || []);
      }
    } catch (err) {
      console.warn('Could not load history:', err.message);
    }
  };

  const fetchDateEntry = async (date) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await wellnessApi.getEntryByDate(date);
      if (res && res.success && res.data) {
        const d = res.data;
        setWaterMl(d.waterIntakeMl || 0);
        setSteps(d.steps || 0);
        setSleepHours(d.sleepHours || 0);
        setExerciseMinutes(d.exerciseMinutes || 0);
        setNotes(d.notes || '');
        setFoodItems(d.foodItems || []);
        setHabits(d.habits && d.habits.length > 0 ? d.habits : habits);
      } else {
        resetFormToDefaults();
      }
    } catch {
      // Date record not found in backend, keep clean form
      resetFormToDefaults();
    } finally {
      setLoading(false);
    }
  };

  const resetFormToDefaults = () => {
    setWaterMl(0);
    setSteps(0);
    setSleepHours(7.0);
    setExerciseMinutes(0);
    setNotes('');
    setFoodItems([]);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    // FR-11 Validation check
    if (steps < 0 || waterMl < 0 || sleepHours < 0 || sleepHours > 24) {
      setFeedback({ type: 'error', message: 'Validation Error: Values cannot be negative, and sleep must be ≤ 24 hrs.' });
      setSaving(false);
      return;
    }

    const payload = {
      entryDate: selectedDate,
      waterIntakeMl: Number(waterMl),
      steps: Number(steps),
      sleepHours: Number(sleepHours),
      exerciseMinutes: Number(exerciseMinutes),
      notes: notes,
      foodItems: foodItems,
      habits: habits
    };

    try {
      const res = await wellnessApi.saveOrUpdateEntry(selectedDate, payload);
      if (res && res.success) {
        setFeedback({ type: 'success', message: `Entry for ${selectedDate} saved to Spring Boot backend!` });
        loadHistory();
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to save entry.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: `Save error: ${err.response?.data?.message || err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete entry for ${selectedDate}?`)) return;
    try {
      await wellnessApi.deleteEntry(selectedDate);
      setFeedback({ type: 'success', message: `Entry for ${selectedDate} deleted.` });
      resetFormToDefaults();
      loadHistory();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Could not delete entry.' });
    }
  };

  const changeDateByOffset = (offset) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + offset);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  // Food handlers
  const addFoodRow = () => {
    setFoodItems([...foodItems, { name: 'New Item', calories: 200, proteinGrams: 10, carbsGrams: 20, fatGrams: 5 }]);
  };

  const updateFoodRow = (index, field, value) => {
    const updated = [...foodItems];
    updated[index][field] = field === 'name' ? value : Number(value) || 0;
    setFoodItems(updated);
  };

  const removeFoodRow = (index) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  // Habit handlers
  const toggleHabit = (index) => {
    const updated = [...habits];
    updated[index].completed = !updated[index].completed;
    setHabits(updated);
  };

  const totalCalories = foodItems.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalProtein = foodItems.reduce((acc, item) => acc + (item.proteinGrams || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Health Indicator */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-200" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Life Ledger — Daily Wellness</h1>
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            Personal Wellness & Lifestyle Management Platform (Spring Boot + React + JDBC/JPA)
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs">
          <div className={`w-3 h-3 rounded-full ${backendStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-medium">{backendStatus.message}</span>
          <button 
            onClick={checkHealth} 
            className="hover:rotate-180 transition-transform p-1 rounded-full hover:bg-white/10"
            title="Refresh status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Date Navigation Bar (FR-01, FR-02) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => changeDateByOffset(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 text-sm outline-none cursor-pointer"
            />
          </div>

          <button 
            onClick={() => changeDateByOffset(1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold hover:bg-emerald-100 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save to Spring Boot'}
          </button>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete this date's entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center justify-between text-sm ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-rose-500" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs font-semibold underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Grid Tracker Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. Hydration Tracker (FR-04) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-white">Hydration Tracker</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Target: 2500ml</span>
          </div>

          <div className="text-center py-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{waterMl}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">ml</span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterMl / 2500) * 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setWaterMl(w => Math.max(0, w + 250))}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold rounded-lg transition-colors"
            >
              +250 ml (Glass)
            </button>
            <button 
              onClick={() => setWaterMl(w => Math.max(0, w + 500))}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold rounded-lg transition-colors"
            >
              +500 ml (Bottle)
            </button>
            <button 
              onClick={() => setWaterMl(0)}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-semibold rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 2. Step Counter & Motion Sensor (FR-06) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Footprints className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-white">Step Counter</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Goal: 10,000</span>
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Manual Steps Entry</label>
            <input 
              type="number"
              value={steps}
              onChange={(e) => setSteps(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Motion Sensor (Experimental)</span>
              <button 
                onClick={() => setIsSensorActive(!isSensorActive)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  isSensorActive ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isSensorActive ? 'Active' : 'Enable'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              *Note: Browser motion sensors provide estimated steps on supported mobile devices only.
            </p>
          </div>
        </div>

        {/* 3. Sleep & Exercise (FR-07) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-violet-500/10 text-violet-500 rounded-xl">
                <Moon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-white">Sleep & Exercise</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Sleep Duration</label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">hrs</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Workout Time</label>
              <div className="relative">
                <input 
                  type="number"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">min</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Personal Notes (FR-08)</label>
            <textarea 
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reflections, energy levels, workout notes..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none resize-none"
            />
          </div>
        </div>

      </div>

      {/* 4. Food Diary & Nutrition Estimates (FR-03) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">Food Diary & Nutrition Tracker</h2>
              <p className="text-xs text-slate-400">Calculates estimated calories, proteins, carbohydrates, and fats.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-orange-50 dark:bg-orange-950/30 px-4 py-2 rounded-xl text-xs font-semibold text-orange-700 dark:text-orange-300">
            <span>Total: <strong>{totalCalories} kcal</strong></span>
            <span>Protein: <strong>{totalProtein}g</strong></span>
            <button 
              onClick={addFoodRow}
              className="flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Food
            </button>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                <th className="pb-2">Food Item</th>
                <th className="pb-2">Calories (kcal)</th>
                <th className="pb-2">Protein (g)</th>
                <th className="pb-2">Carbs (g)</th>
                <th className="pb-2">Fat (g)</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {foodItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 pr-2">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateFoodRow(idx, 'name', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 w-24">
                    <input 
                      type="number" 
                      value={item.calories}
                      onChange={(e) => updateFoodRow(idx, 'calories', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 w-20">
                    <input 
                      type="number" 
                      value={item.proteinGrams}
                      onChange={(e) => updateFoodRow(idx, 'proteinGrams', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 w-20">
                    <input 
                      type="number" 
                      value={item.carbsGrams}
                      onChange={(e) => updateFoodRow(idx, 'carbsGrams', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-2 w-20">
                    <input 
                      type="number" 
                      value={item.fatGrams}
                      onChange={(e) => updateFoodRow(idx, 'fatGrams', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                    />
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <button 
                      onClick={() => removeFoodRow(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {foodItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-slate-400">
                    No food logged for this date. Click "+ Add Food" to record your meals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Habit Tracker (FR-05) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Daily Habit Tracker</h2>
            <p className="text-xs text-slate-400">Tick habits completed for {selectedDate}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {habits.map((habit, idx) => (
            <div 
              key={idx}
              onClick={() => toggleHabit(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                habit.completed 
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              <span className="text-xs font-semibold">{habit.name}</span>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                habit.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
              }`}>
                {habit.completed && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Historical Records Browser (FR-02) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Historical Records (Spring Boot & JDBC)</h2>
          </div>
          <button 
            onClick={loadHistory}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Records
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {entriesHistory.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedDate(item.entryDate)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedDate === item.entryDate
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-sm text-slate-800 dark:text-white">{item.entryDate}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Score: {item.wellnessScore || 85}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <p>Steps: <strong>{item.steps}</strong> | Water: <strong>{item.waterIntakeMl}ml</strong></p>
                <p>Sleep: <strong>{item.sleepHours}h</strong> | Exercise: <strong>{item.exerciseMinutes}m</strong></p>
                {item.notes && <p className="italic truncate mt-1">"{item.notes}"</p>}
              </div>
            </div>
          ))}

          {entriesHistory.length === 0 && (
            <div className="col-span-3 text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No saved records found yet. Click "Save to Spring Boot" or seed demo data.
            </div>
          )}
        </div>
      </div>

      {/* 7. Data Transparency & Architecture Notice (FR-12) */}
      <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Data Transparency & Privacy Notice (FR-12)</span>
        </div>
        <p>
          Life Ledger stores your wellness logs in an in-memory H2 database during development, and can be configured with PostgreSQL for production persistence. 
          All communication is handled via the Java Spring Boot REST API (`/api/entries`, `/api/health`). 
          Browser local storage is utilized for offline session caching when API persistence is temporarily disconnected.
        </p>
      </div>

    </div>
  );
}
