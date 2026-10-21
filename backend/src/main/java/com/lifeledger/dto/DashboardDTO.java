package com.lifeledger.dto;

import com.lifeledger.model.Activity;
import com.lifeledger.model.Habit;
import com.lifeledger.model.Meal;
import com.lifeledger.model.SleepLog;

import java.time.LocalDate;
import java.util.List;

public class DashboardDTO {
    private LocalDate date;
    private int wellnessScore;
    private int steps;
    private int stepsTarget;
    private int caloriesBurned;
    private int caloriesBurnedTarget;
    private int caloriesConsumed;
    private int caloriesConsumedTarget;
    private int waterConsumedMl;
    private int waterTargetMl;
    private double sleepHours;
    private String sleepQuality;
    private int sleepScore;
    private int activeMinutes;
    private MacroBreakdownDTO macros;
    private List<Activity> recentActivities;
    private List<Meal> meals;
    private List<Habit> habits;
    private SleepLog sleepLog;
    private List<DayTrendDTO> weeklyTrends;

    public DashboardDTO() {}

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public int getWellnessScore() { return wellnessScore; }
    public void setWellnessScore(int wellnessScore) { this.wellnessScore = wellnessScore; }
    public int getSteps() { return steps; }
    public void setSteps(int steps) { this.steps = steps; }
    public int getStepsTarget() { return stepsTarget; }
    public void setStepsTarget(int stepsTarget) { this.stepsTarget = stepsTarget; }
    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public int getCaloriesBurnedTarget() { return caloriesBurnedTarget; }
    public void setCaloriesBurnedTarget(int caloriesBurnedTarget) { this.caloriesBurnedTarget = caloriesBurnedTarget; }
    public int getCaloriesConsumed() { return caloriesConsumed; }
    public void setCaloriesConsumed(int caloriesConsumed) { this.caloriesConsumed = caloriesConsumed; }
    public int getCaloriesConsumedTarget() { return caloriesConsumedTarget; }
    public void setCaloriesConsumedTarget(int caloriesConsumedTarget) { this.caloriesConsumedTarget = caloriesConsumedTarget; }
    public int getWaterConsumedMl() { return waterConsumedMl; }
    public void setWaterConsumedMl(int waterConsumedMl) { this.waterConsumedMl = waterConsumedMl; }
    public int getWaterTargetMl() { return waterTargetMl; }
    public void setWaterTargetMl(int waterTargetMl) { this.waterTargetMl = waterTargetMl; }
    public double getSleepHours() { return sleepHours; }
    public void setSleepHours(double sleepHours) { this.sleepHours = sleepHours; }
    public String getSleepQuality() { return sleepQuality; }
    public void setSleepQuality(String sleepQuality) { this.sleepQuality = sleepQuality; }
    public int getSleepScore() { return sleepScore; }
    public void setSleepScore(int sleepScore) { this.sleepScore = sleepScore; }
    public int getActiveMinutes() { return activeMinutes; }
    public void setActiveMinutes(int activeMinutes) { this.activeMinutes = activeMinutes; }
    public MacroBreakdownDTO getMacros() { return macros; }
    public void setMacros(MacroBreakdownDTO macros) { this.macros = macros; }
    public List<Activity> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<Activity> recentActivities) { this.recentActivities = recentActivities; }
    public List<Meal> getMeals() { return meals; }
    public void setMeals(List<Meal> meals) { this.meals = meals; }
    public List<Habit> getHabits() { return habits; }
    public void setHabits(List<Habit> habits) { this.habits = habits; }
    public SleepLog getSleepLog() { return sleepLog; }
    public void setSleepLog(SleepLog sleepLog) { this.sleepLog = sleepLog; }
    public List<DayTrendDTO> getWeeklyTrends() { return weeklyTrends; }
    public void setWeeklyTrends(List<DayTrendDTO> weeklyTrends) { this.weeklyTrends = weeklyTrends; }
}
