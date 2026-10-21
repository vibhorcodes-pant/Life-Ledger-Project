import React from 'react';
import { Utensils, Trash2, PieChart } from 'lucide-react';
import { deleteMeal } from '../services/api';

export default function NutritionMacros3D({ dashboard, onUpdate, onAddMealClick }) {
  const meals = dashboard?.meals || [];
  const macros = dashboard?.macros || { proteinGrams: 0, carbsGrams: 0, fatGrams: 0 };
  const caloriesConsumed = dashboard?.caloriesConsumed || 0;
  const targetCalories = dashboard?.caloriesConsumedTarget || 2200;
  const percentOfTarget = Math.min(100, Math.round((caloriesConsumed / targetCalories) * 100));

  const proteinCals = macros.proteinGrams * 4;
  const carbsCals = macros.carbsGrams * 4;
  const fatCals = macros.fatGrams * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals || 1;

  const proteinPct = Math.round((proteinCals / totalMacroCals) * 100);
  const carbsPct = Math.round((carbsCals / totalMacroCals) * 100);
  const fatPct = Math.round((fatCals / totalMacroCals) * 100);

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Nutrition &amp; Fuel</h3>
              <p className="text-xs text-slate-400">Target: {targetCalories} kcal</p>
            </div>
          </div>
          <button
            onClick={onAddMealClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition shadow-3d-sm"
          >
            + Add Meal
          </button>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 mb-4 shadow-3d-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Caloric Budget</span>
            <span className="text-xs font-bold text-amber-400">{caloriesConsumed} / {targetCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${percentOfTarget}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-teal-400">Protein</div>
              <div className="text-base font-extrabold text-white">{macros.proteinGrams}g</div>
              <div className="text-[10px] text-slate-400">{proteinPct}% cals</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-amber-400">Carbs</div>
              <div className="text-base font-extrabold text-white">{macros.carbsGrams}g</div>
              <div className="text-[10px] text-slate-400">{carbsPct}% cals</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-rose-400">Fat</div>
              <div className="text-base font-extrabold text-white">{macros.fatGrams}g</div>
              <div className="text-[10px] text-slate-400">{fatPct}% cals</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Today's Meals</div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {meals.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-2 text-center">No meals recorded today yet</div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                      {meal.mealType}
                    </span>
                    <span>{meal.foodName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {meal.calories} kcal • P: {meal.proteinGrams}g • C: {meal.carbsGrams}g • F: {meal.fatGrams}g
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(meal.id)}
                  title="Delete Meal"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
